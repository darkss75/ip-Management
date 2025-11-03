// Vercel-compatible in-memory store (no file persistence)
class VercelStore {
    constructor() {
        // 메모리에만 저장 (Vercel 서버리스 환경)
        this.countries = this.getDefaultCountries();
        this.blockedIPs = [];
        this.idCounter = 1;
        
        console.log(`Initialized with ${this.countries.length} countries`);
    }

    getDefaultCountries() {
        return [
            // 주요 서버 보유 국가들
            { _id: '1', name: 'United States', nameKo: '미국', code: 'US', flag: '🇺🇸', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '2', name: 'Netherlands', nameKo: '네덜란드', code: 'NL', flag: '🇳🇱', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '3', name: 'Germany', nameKo: '독일', code: 'DE', flag: '🇩🇪', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '4', name: 'United Kingdom', nameKo: '영국', code: 'GB', flag: '🇬🇧', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '5', name: 'Switzerland', nameKo: '스위스', code: 'CH', flag: '🇨🇭', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '6', name: 'France', nameKo: '프랑스', code: 'FR', flag: '🇫🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '7', name: 'Canada', nameKo: '캐나다', code: 'CA', flag: '🇨🇦', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '8', name: 'Japan', nameKo: '일본', code: 'JP', flag: '🇯🇵', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '9', name: 'Sweden', nameKo: '스웨덴', code: 'SE', flag: '🇸🇪', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '10', name: 'Norway', nameKo: '노르웨이', code: 'NO', flag: '🇳🇴', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '11', name: 'Australia', nameKo: '호주', code: 'AU', flag: '🇦🇺', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '12', name: 'Italy', nameKo: '이탈리아', code: 'IT', flag: '🇮🇹', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '13', name: 'Spain', nameKo: '스페인', code: 'ES', flag: '🇪🇸', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '14', name: 'Austria', nameKo: '오스트리아', code: 'AT', flag: '🇦🇹', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '15', name: 'Belgium', nameKo: '벨기에', code: 'BE', flag: '🇧🇪', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '16', name: 'Denmark', nameKo: '덴마크', code: 'DK', flag: '🇩🇰', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '17', name: 'Finland', nameKo: '핀란드', code: 'FI', flag: '🇫🇮', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '18', name: 'Poland', nameKo: '폴란드', code: 'PL', flag: '🇵🇱', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '19', name: 'Czech Republic', nameKo: '체코', code: 'CZ', flag: '🇨🇿', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '20', name: 'Luxembourg', nameKo: '룩셈부르크', code: 'LU', flag: '🇱🇺', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '21', name: 'Iceland', nameKo: '아이슬란드', code: 'IS', flag: '🇮🇸', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '22', name: 'Portugal', nameKo: '포르투갈', code: 'PT', flag: '🇵🇹', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '23', name: 'Ireland', nameKo: '아일랜드', code: 'IE', flag: '🇮🇪', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '24', name: 'Romania', nameKo: '루마니아', code: 'RO', flag: '🇷🇴', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '25', name: 'Hungary', nameKo: '헝가리', code: 'HU', flag: '🇭🇺', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '26', name: 'Bulgaria', nameKo: '불가리아', code: 'BG', flag: '🇧🇬', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '27', name: 'Croatia', nameKo: '크로아티아', code: 'HR', flag: '🇭🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '28', name: 'Estonia', nameKo: '에스토니아', code: 'EE', flag: '🇪🇪', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '29', name: 'Latvia', nameKo: '라트비아', code: 'LV', flag: '🇱🇻', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '30', name: 'Lithuania', nameKo: '리투아니아', code: 'LT', flag: '🇱🇹', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '31', name: 'Slovakia', nameKo: '슬로바키아', code: 'SK', flag: '🇸🇰', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '32', name: 'Slovenia', nameKo: '슬로베니아', code: 'SI', flag: '🇸🇮', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '33', name: 'Greece', nameKo: '그리스', code: 'GR', flag: '🇬🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '34', name: 'Cyprus', nameKo: '키프로스', code: 'CY', flag: '🇨🇾', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '35', name: 'Malta', nameKo: '몰타', code: 'MT', flag: '🇲🇹', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            
            // 아시아-태평양
            { _id: '36', name: 'Singapore', nameKo: '싱가포르', code: 'SG', flag: '🇸🇬', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '37', name: 'Hong Kong', nameKo: '홍콩', code: 'HK', flag: '🇭🇰', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '38', name: 'South Korea', nameKo: '한국', code: 'KR', flag: '🇰🇷', blockedIPCount: 0, isFavorite: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '39', name: 'Taiwan', nameKo: '대만', code: 'TW', flag: '🇹🇼', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '40', name: 'New Zealand', nameKo: '뉴질랜드', code: 'NZ', flag: '🇳🇿', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '41', name: 'India', nameKo: '인도', code: 'IN', flag: '🇮🇳', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            
            // 아메리카
            { _id: '42', name: 'Brazil', nameKo: '브라질', code: 'BR', flag: '🇧🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '43', name: 'Argentina', nameKo: '아르헨티나', code: 'AR', flag: '🇦🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '44', name: 'Chile', nameKo: '칠레', code: 'CL', flag: '🇨🇱', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '45', name: 'Mexico', nameKo: '멕시코', code: 'MX', flag: '🇲🇽', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            
            // 중동 및 아프리카
            { _id: '46', name: 'Israel', nameKo: '이스라엘', code: 'IL', flag: '🇮🇱', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '47', name: 'South Africa', nameKo: '남아프리카', code: 'ZA', flag: '🇿🇦', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() },
            { _id: '48', name: 'Turkey', nameKo: '터키', code: 'TR', flag: '🇹🇷', blockedIPCount: 0, isFavorite: false, isActive: true, createdAt: new Date(), updatedAt: new Date() }
        ];
    }

    // Country methods
    findCountries(filter = {}) {
        let result = this.countries;
        if (filter.isActive !== undefined) {
            result = result.filter(c => c.isActive === filter.isActive);
        }
        // 즐겨찾기가 먼저 오고, 그 다음 이름순으로 정렬
        return Promise.resolve(result.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return a.name.localeCompare(b.name);
        }));
    }

    findCountryByCode(code) {
        const country = this.countries.find(c => c.code === code.toUpperCase() && c.isActive);
        return Promise.resolve(country || null);
    }

    updateCountryBlockedCount(countryCode) {
        const country = this.countries.find(c => c.code === countryCode);
        if (country) {
            country.blockedIPCount = this.blockedIPs.filter(ip => ip.countryCode === countryCode && ip.isActive).length;
        }
    }

    toggleCountryFavorite(countryCode) {
        const country = this.countries.find(c => c.code === countryCode.toUpperCase());
        if (country) {
            country.isFavorite = !country.isFavorite;
            country.updatedAt = new Date();
            return Promise.resolve(country);
        }
        return Promise.resolve(null);
    }

    // BlockedIP methods
    findBlockedIPs(filter = {}) {
        let result = this.blockedIPs;
        
        if (filter.countryCode) {
            result = result.filter(ip => ip.countryCode === filter.countryCode.toUpperCase());
        }
        if (filter.isActive !== undefined) {
            result = result.filter(ip => ip.isActive === filter.isActive);
        }
        
        return Promise.resolve(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }

    findBlockedIPById(id) {
        const ip = this.blockedIPs.find(ip => ip._id === id);
        return Promise.resolve(ip || null);
    }

    createBlockedIP(data) {
        const newIP = {
            _id: (++this.idCounter).toString(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.blockedIPs.push(newIP);
        this.updateCountryBlockedCount(data.countryCode);
        
        return Promise.resolve(newIP);
    }

    updateBlockedIP(id, data) {
        const index = this.blockedIPs.findIndex(ip => ip._id === id);
        if (index !== -1) {
            this.blockedIPs[index] = {
                ...this.blockedIPs[index],
                ...data,
                updatedAt: new Date()
            };
            
            return Promise.resolve(this.blockedIPs[index]);
        }
        return Promise.resolve(null);
    }

    deleteBlockedIP(id) {
        const index = this.blockedIPs.findIndex(ip => ip._id === id);
        if (index !== -1) {
            const ip = this.blockedIPs[index];
            this.blockedIPs[index].isActive = false;
            this.updateCountryBlockedCount(ip.countryCode);
            
            return Promise.resolve(this.blockedIPs[index]);
        }
        return Promise.resolve(null);
    }

    countBlockedIPs(filter = {}) {
        let result = this.blockedIPs;
        
        if (filter.countryCode) {
            result = result.filter(ip => ip.countryCode === filter.countryCode.toUpperCase());
        }
        if (filter.isActive !== undefined) {
            result = result.filter(ip => ip.isActive === filter.isActive);
        }
        
        return Promise.resolve(result.length);
    }

    // Aggregation methods for statistics
    async getTopCountries() {
        const countryCounts = {};
        
        this.blockedIPs
            .filter(ip => ip.isActive)
            .forEach(ip => {
                countryCounts[ip.countryCode] = (countryCounts[ip.countryCode] || 0) + 1;
            });

        const result = Object.entries(countryCounts)
            .map(([countryCode, count]) => {
                const country = this.countries.find(c => c.code === countryCode);
                return {
                    _id: countryCode,
                    count,
                    country: country ? [country] : []
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return Promise.resolve(result);
    }

    async getSeverityStats() {
        const severityCounts = {};
        
        this.blockedIPs
            .filter(ip => ip.isActive)
            .forEach(ip => {
                severityCounts[ip.severity] = (severityCounts[ip.severity] || 0) + 1;
            });

        const result = Object.entries(severityCounts)
            .map(([severity, count]) => ({ _id: severity, count }));

        return Promise.resolve(result);
    }

    async getRecentBlocks(limit = 10) {
        const result = this.blockedIPs
            .filter(ip => ip.isActive)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit)
            .map(ip => ({
                serverName: ip.serverName,
                ipAddress: ip.ipAddress,
                countryCode: ip.countryCode,
                createdAt: ip.createdAt
            }));

        return Promise.resolve(result);
    }
}

module.exports = new VercelStore();