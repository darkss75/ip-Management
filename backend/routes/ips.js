const express = require('express');
const memoryStore = require('../data/vercelStore');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const totalBlocked = await memoryStore.countBlockedIPs({ isActive: true });
        const topCountries = await memoryStore.getTopCountries();
        const severityStats = await memoryStore.getSeverityStats();
        const recentBlocks = await memoryStore.getRecentBlocks(10);

        res.json({
            totalBlocked,
            topCountries,
            severityStats,
            recentBlocks
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get blocked IPs by country
router.get('/country/:countryCode', authenticateToken, async (req, res) => {
    try {
        const { countryCode } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const allIPs = await memoryStore.findBlockedIPs({
            countryCode: countryCode.toUpperCase(),
            isActive: true
        });

        const total = allIPs.length;
        const skip = (page - 1) * limit;
        const ips = allIPs.slice(skip, skip + limit);

        res.json({
            ips,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching blocked IPs:', error);
        res.status(500).json({ error: 'Failed to fetch blocked IPs' });
    }
});

// Add new server/IP entry
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { countryCode, serverName, ipAddress } = req.body;

        if (!countryCode || !serverName) {
            return res.status(400).json({
                error: 'Country code and server name are required'
            });
        }

        // Check if server already exists
        const existingIPs = await memoryStore.findBlockedIPs({
            countryCode: countryCode.toUpperCase(),
            isActive: true
        });

        const existingServer = existingIPs.find(ip =>
            ip.serverName === serverName &&
            (!ipAddress || ip.ipAddress === ipAddress)
        );

        if (existingServer) {
            return res.status(409).json({ error: 'Server already exists' });
        }

        const serverEntry = await memoryStore.createBlockedIP({
            countryCode: countryCode.toUpperCase(),
            serverName,
            ipAddress: ipAddress || null,
            blockedBy: req.user.username,
            isActive: true,
            lastDetected: new Date()
        });

        res.status(201).json(serverEntry);
    } catch (error) {
        console.error('Error adding server:', error);
        res.status(500).json({ error: 'Failed to add server' });
    }
});

// Update blocked IP
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { reason, severity, expiresAt } = req.body;

        const blockedIP = await memoryStore.updateBlockedIP(req.params.id, {
            reason,
            severity,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        if (!blockedIP) {
            return res.status(404).json({ error: 'Blocked IP not found' });
        }

        res.json(blockedIP);
    } catch (error) {
        console.error('Error updating blocked IP:', error);
        res.status(500).json({ error: 'Failed to update blocked IP' });
    }
});

// Remove blocked IP
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const blockedIP = await memoryStore.deleteBlockedIP(req.params.id);

        if (!blockedIP) {
            return res.status(404).json({ error: 'Blocked IP not found' });
        }

        res.json({ message: 'IP unblocked successfully' });
    } catch (error) {
        console.error('Error removing blocked IP:', error);
        res.status(500).json({ error: 'Failed to remove blocked IP' });
    }
});

module.exports = router;