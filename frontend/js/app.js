class IPManagementApp {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('token');
        this.currentUser = null;
        this.selectedCountry = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        if (this.token) {
            const isValid = await this.validateToken();
            if (isValid) {
                this.showApp();
            } else {
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // IP form
        document.getElementById('ipForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddIP();
        });

        // Country select change event
        document.getElementById('countrySelect').addEventListener('change', (e) => {
            this.updateServerPrefix(e.target.value);
        });

        // Server number input validation
        document.getElementById('serverNumber').addEventListener('input', (e) => {
            // 숫자만 허용
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            // 최대 4자리까지만 허용
            if (e.target.value.length > 4) {
                e.target.value = e.target.value.slice(0, 4);
            }
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                this.currentUser = data.user;
                localStorage.setItem('token', this.token);
                
                this.showApp();
                this.showToast('로그인 성공', 'success');
            } else {
                this.showToast(data.error || '로그인 실패', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('로그인 중 오류가 발생했습니다', 'error');
        }
    }

    async validateToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();
            
            if (data.valid) {
                this.currentUser = data.user;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    handleLogout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('token');
        this.showLogin();
        this.showToast('로그아웃되었습니다', 'success');
    }

    showLogin() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    showApp() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('currentUser').textContent = this.currentUser?.username || '';
        
        // 초기 데이터 로드
        this.loadInitialData();
    }

    async loadInitialData() {
        await this.loadCountries();
    }

    async loadCountries() {
        try {
            // Initialize countries if needed
            await fetch(`${this.baseURL}/countries/initialize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const response = await fetch(`${this.baseURL}/countries`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const countries = await response.json();

            if (response.ok) {
                this.displayCountries(countries);
                this.populateCountrySelect(countries);
            } else {
                this.showToast('국가 목록 로드 실패', 'error');
            }
        } catch (error) {
            console.error('Countries load error:', error);
            this.showToast('국가 목록 로드 중 오류 발생', 'error');
        }
    }

    displayCountries(countries) {
        const container = document.getElementById('countriesList');
        
        console.log('Displaying countries:', countries.map(c => ({ name: c.nameKo, isFavorite: c.isFavorite })));
        
        if (countries.length === 0) {
            container.innerHTML = '<div class="loading">등록된 국가가 없습니다</div>';
            return;
        }

        container.innerHTML = countries.map(country => `
            <div class="country-item ${country.isFavorite ? 'favorite' : ''}" data-country-code="${country.code}">
                <span class="country-flag">${country.flag}</span>
                <div class="country-info">
                    <span class="country-name">${country.nameKo || country.name}</span>
                    <span class="country-name-en">${country.name}</span>
                </div>
                <div class="country-actions">
                    <button class="favorite-btn ${country.isFavorite ? 'active' : ''}" 
                            data-country-code="${country.code}"
                            title="${country.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}">
                        <i class="fas fa-star"></i>
                    </button>
                    <div class="blocked-count">차단 IP: ${country.blockedIPCount}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers for country selection
        document.querySelectorAll('.country-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // 즐겨찾기 버튼 클릭이 아닌 경우에만 국가 선택
                if (!e.target.closest('.favorite-btn')) {
                    this.selectCountry(item.dataset.countryCode);
                }
            });
        });

        // Add click handlers for favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 국가 선택 이벤트 방지
                const countryCode = btn.dataset.countryCode;
                this.toggleFavorite(countryCode, e);
            });
        });
    }

    async selectCountry(countryCode) {
        // Update UI
        document.querySelectorAll('.country-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-country-code="${countryCode}"]`).classList.add('selected');

        this.selectedCountry = countryCode;
        
        // Update header
        const countryName = document.querySelector(`[data-country-code="${countryCode}"] .country-name`).textContent;
        document.getElementById('selectedCountryName').textContent = `${countryName} - 차단된 IP 목록`;

        // 상단 폼의 국가 선택도 자동으로 설정
        document.getElementById('countrySelect').value = countryCode;
        this.updateServerPrefix(countryCode);

        // Load blocked IPs for this country
        await this.loadBlockedIPs(countryCode);
    }

    async loadBlockedIPs(countryCode) {
        try {
            const response = await fetch(`${this.baseURL}/ips/country/${countryCode}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.displayBlockedIPs(data.ips);
            } else {
                this.showToast('차단된 IP 목록 로드 실패', 'error');
            }
        } catch (error) {
            console.error('Blocked IPs load error:', error);
            this.showToast('차단된 IP 목록 로드 중 오류 발생', 'error');
        }
    }

    populateCountrySelect(countries) {
        const select = document.getElementById('countrySelect');
        select.innerHTML = '<option value="">국가를 선택하세요</option>';
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = `${country.flag} ${country.nameKo || country.name} (${country.name})`;
            select.appendChild(option);
        });
    }

    displayBlockedIPs(ips) {
        const container = document.getElementById('ipListContainer');
        
        if (ips.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-server"></i>
                    <p>이 국가에 등록된 서버가 없습니다.</p>
                </div>
            `;
            return;
        }

        const serverGrid = `
            <div class="server-grid">
                ${ips.map(ip => `
                    <div class="server-card">
                        <div class="server-info">
                            <div class="server-name">${ip.serverName || 'Unknown'}</div>
                            <div class="server-ip">${ip.ipAddress || '미지정'}</div>
                        </div>
                        <button class="delete-btn" data-ip-id="${ip._id}" title="서버 삭제">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = serverGrid;

        // Add click handlers for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const ipId = btn.dataset.ipId;
                this.removeIP(ipId);
            });
        });
    }

    updateServerPrefix(countryCode) {
        const prefixInput = document.getElementById('serverPrefix');
        if (countryCode) {
            prefixInput.value = `${countryCode}#`;
        } else {
            prefixInput.value = '';
        }
    }

    async handleAddIP() {
        const formData = new FormData(document.getElementById('ipForm'));
        const countryCode = formData.get('countryCode');
        const serverNumber = formData.get('serverNumber');
        
        // 서버명 조합
        const serverName = countryCode && serverNumber ? `${countryCode}#${serverNumber}` : '';
        
        const ipData = {
            countryCode: countryCode,
            serverName: serverName,
            ipAddress: formData.get('ipAddress') || null
        };

        // 필수 필드 검증
        if (!ipData.countryCode || !serverNumber) {
            this.showToast('국가와 서버 번호는 필수 입력 항목입니다', 'error');
            return;
        }

        // 서버 번호 유효성 검증
        const serverNum = parseInt(serverNumber);
        if (isNaN(serverNum) || serverNum < 1 || serverNum > 9999) {
            this.showToast('서버 번호는 1-9999 사이의 숫자여야 합니다', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/ips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(ipData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showToast('서버가 성공적으로 등록되었습니다', 'success');
                
                // 폼 초기화 (국가 선택은 유지)
                document.getElementById('serverNumber').value = '';
                document.getElementById('ipAddress').value = '';
                
                // 선택된 국가가 있으면 해당 국가의 목록을 새로고침
                if (this.selectedCountry) {
                    await this.loadBlockedIPs(this.selectedCountry);
                }
            } else {
                this.showToast(data.error || '서버 등록 실패', 'error');
            }
        } catch (error) {
            console.error('Add IP error:', error);
            this.showToast('서버 등록 중 오류가 발생했습니다', 'error');
        }
    }

    async removeIP(ipId) {
        if (!confirm('이 서버를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/ips/${ipId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.showToast('서버가 삭제되었습니다', 'success');
                
                // 선택된 국가의 목록 새로고침
                if (this.selectedCountry) {
                    await this.loadBlockedIPs(this.selectedCountry);
                }
            } else {
                this.showToast(data.error || '서버 삭제 실패', 'error');
            }
        } catch (error) {
            console.error('Remove IP error:', error);
            this.showToast('서버 삭제 중 오류가 발생했습니다', 'error');
        }
    }

    async toggleFavorite(countryCode, event) {
        event.stopPropagation(); // 국가 선택 이벤트 방지
        
        console.log('Toggling favorite for:', countryCode);
        
        try {
            const response = await fetch(`${this.baseURL}/countries/${countryCode}/favorite`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                this.showToast(data.message, 'success');
                // 국가 목록 새로고침
                console.log('Reloading countries...');
                await this.loadCountries();
                console.log('Countries reloaded');
            } else {
                this.showToast(data.error || '즐겨찾기 설정 실패', 'error');
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            this.showToast('즐겨찾기 설정 중 오류가 발생했습니다', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.getElementById('toastContainer').appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize app
const app = new IPManagementApp();