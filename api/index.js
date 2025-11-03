// 통합 API 핸들러
const url = require('url');

// 메모리 데이터 저장소 (Vercel 기본 목록 재사용)
const vercelStore = require('../backend/data/vercelStore');
const countries = vercelStore.getDefaultCountries();

let blockedIPs = [];
let idCounter = 1;

async function parseJsonBody(req) {
    if (req.body) return req.body;
    return await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

function updateCountryBlockedCount(countryCode) {
    const cc = (countryCode || '').toUpperCase();
    const country = countries.find(c => c.code === cc);
    if (country) {
        country.blockedIPCount = blockedIPs.filter(ip => ip.countryCode === cc && ip.isActive).length;
        country.updatedAt = new Date();
    }
}

module.exports = async (req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // OPTIONS 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        console.log('API Request:', { method: req.method, pathname, query });

        // 인증 API
        if (pathname === '/api/auth') {
            if (req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { username, password } = body;

                if (!username || !password) {
                    return res.status(400).json({ error: 'Username and password required' });
                }

                if (username === 'aldis' && password === 'aldis1201!') {
                    const token = 'simple_token_' + Date.now();
                    return res.status(200).json({
                        token,
                        user: { id: 1, username: 'aldis', role: 'admin' }
                    });
                } else {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
            }

            if (req.method === 'GET') {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];

                if (!token || !token.startsWith('simple_token_')) {
                    return res.status(401).json({ valid: false });
                }

                return res.status(200).json({ 
                    valid: true, 
                    user: { id: 1, username: 'aldis', role: 'admin' }
                });
            }
        }

        // 국가 초기화 (프런트에서 호출)
        if (pathname === '/api/countries/initialize' && req.method === 'POST') {
            return res.status(200).json({ message: 'Countries already initialized' });
        }

        // 국가 즐겨찾기 토글
        if (pathname.startsWith('/api/countries/') && pathname.endsWith('/favorite') && req.method === 'PUT') {
            const parts = pathname.split('/');
            const code = decodeURIComponent(parts[3] || '').toUpperCase();
            const country = countries.find(c => c.code === code);
            if (!country) {
                return res.status(404).json({ error: 'Country not found' });
            }
            country.isFavorite = !country.isFavorite;
            country.updatedAt = new Date();
            return res.status(200).json({ 
                message: country.isFavorite ? 'Added to favorites' : 'Removed from favorites',
                country 
            });
        }

        // 국가 목록
        if (pathname === '/api/countries' && req.method === 'GET') {
            const sortedCountries = countries.sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return a.name.localeCompare(b.name);
            });
            return res.status(200).json(sortedCountries);
        }

        // 국가별 IP 목록
        if (pathname.startsWith('/api/ips/country/') && req.method === 'GET') {
            const parts = pathname.split('/');
            const countryCode = decodeURIComponent(parts[4] || '').toUpperCase();
            const ips = blockedIPs
                .filter(ip => ip.isActive && ip.countryCode === countryCode)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({ ips, pagination: { page: 1, limit: ips.length, total: ips.length, pages: 1 } });
        }

        // IP 생성/조회
        if (pathname === '/api/ips') {
            if (req.method === 'GET') {
                let result = blockedIPs.filter(ip => ip.isActive);
                if (query.countryCode) {
                    result = result.filter(ip => ip.countryCode === query.countryCode.toUpperCase());
                }
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                return res.status(200).json(result);
            }

            if (req.method === 'POST') {
                const body = await parseJsonBody(req);
                const { countryCode, serverName, ipAddress } = body || {};

                if (!countryCode || !serverName) {
                    return res.status(400).json({ error: 'Country code and server name required' });
                }

                const newIP = {
                    _id: (idCounter++).toString(),
                    countryCode: countryCode.toUpperCase(),
                    serverName: serverName,
                    ipAddress: ipAddress || '',
                    severity: 'medium',
                    reason: 'Manual block',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                blockedIPs.push(newIP);
                updateCountryBlockedCount(countryCode);
                return res.status(201).json(newIP);
            }
        }

        // IP 삭제 (경로 파라미터)
        if (pathname.startsWith('/api/ips/') && req.method === 'DELETE') {
            const parts = pathname.split('/');
            const id = decodeURIComponent(parts[3] || '');
            const index = blockedIPs.findIndex(ip => ip._id === id);
            if (index !== -1) {
                const countryCode = blockedIPs[index].countryCode;
                blockedIPs[index].isActive = false;
                blockedIPs[index].updatedAt = new Date();
                updateCountryBlockedCount(countryCode);
                return res.status(200).json({ message: 'IP deleted successfully' });
            } else {
                return res.status(404).json({ error: 'IP not found' });
            }
        }

        // Health check
        if (pathname === '/api/health') {
            return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
        }

        // 404
        return res.status(404).json({ error: 'Not found' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};