// 통합 API 핸들러
const url = require('url');

// 메모리 데이터 저장소
const countries = [
    { _id: '1', name: 'United States', nameKo: '미국', code: 'US', flag: '🇺🇸', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '2', name: 'Netherlands', nameKo: '네덜란드', code: 'NL', flag: '🇳🇱', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '3', name: 'Germany', nameKo: '독일', code: 'DE', flag: '🇩🇪', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '4', name: 'United Kingdom', nameKo: '영국', code: 'GB', flag: '🇬🇧', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '5', name: 'Switzerland', nameKo: '스위스', code: 'CH', flag: '🇨🇭', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '6', name: 'France', nameKo: '프랑스', code: 'FR', flag: '🇫🇷', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '7', name: 'Canada', nameKo: '캐나다', code: 'CA', flag: '🇨🇦', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '8', name: 'Japan', nameKo: '일본', code: 'JP', flag: '🇯🇵', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '9', name: 'Sweden', nameKo: '스웨덴', code: 'SE', flag: '🇸🇪', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '10', name: 'Norway', nameKo: '노르웨이', code: 'NO', flag: '🇳🇴', blockedIPCount: 0, isFavorite: false, isActive: true },
    { _id: '38', name: 'South Korea', nameKo: '한국', code: 'KR', flag: '🇰🇷', blockedIPCount: 0, isFavorite: true, isActive: true }
];

let blockedIPs = [];
let idCounter = 1;

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
                const { username, password } = req.body;

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

        // 국가 API
        if (pathname === '/api/countries') {
            if (req.method === 'GET') {
                const sortedCountries = countries.sort((a, b) => {
                    if (a.isFavorite && !b.isFavorite) return -1;
                    if (!a.isFavorite && b.isFavorite) return 1;
                    return a.name.localeCompare(b.name);
                });
                return res.status(200).json(sortedCountries);
            }
        }

        // IP API
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
                const { countryCode, serverNumber, ipAddress } = req.body;

                if (!countryCode || !serverNumber) {
                    return res.status(400).json({ error: 'Country code and server number required' });
                }

                const newIP = {
                    _id: (idCounter++).toString(),
                    countryCode: countryCode.toUpperCase(),
                    serverName: `${countryCode.toUpperCase()}#${serverNumber}`,
                    ipAddress: ipAddress || '',
                    severity: 'medium',
                    reason: 'Manual block',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                blockedIPs.push(newIP);
                return res.status(201).json(newIP);
            }

            if (req.method === 'DELETE') {
                const { id } = query;
                
                const index = blockedIPs.findIndex(ip => ip._id === id);
                if (index !== -1) {
                    blockedIPs[index].isActive = false;
                    return res.status(200).json({ message: 'IP deleted successfully' });
                } else {
                    return res.status(404).json({ error: 'IP not found' });
                }
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