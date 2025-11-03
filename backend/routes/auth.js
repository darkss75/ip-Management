const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple in-memory user store (replace with database in production)
const users = [
    {
        id: 1,
        username: 'aldis',
        password: '$2a$10$S.6sVSTPmGVVgOEycmW3w.CvXzJgpHW29l/Uga40c4SdOIqR54ama', // aldis1201!
        role: 'admin'
    }
];

// Login endpoint (simplified for Vercel)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt:', { username, password }); // 디버깅용

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // 간단한 하드코딩된 인증 (Vercel 호환성을 위해)
        if (username === 'aldis' && password === 'aldis1201!') {
            const token = 'simple_token_' + Date.now(); // 간단한 토큰
            
            res.json({
                token,
                user: {
                    id: 1,
                    username: 'aldis',
                    role: 'admin'
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Token validation endpoint (simplified)
router.get('/validate', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ valid: false });
    }

    // 간단한 토큰 검증 (실제 운영에서는 JWT 사용 권장)
    if (token.startsWith('simple_token_')) {
        res.json({ 
            valid: true, 
            user: { id: 1, username: 'aldis', role: 'admin' }
        });
    } else {
        return res.status(403).json({ valid: false });
    }
});

module.exports = router;