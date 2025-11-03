// MongoDB initialization script
db = db.getSiblingDB('ip_management');

// Create collections
db.createCollection('countries');
db.createCollection('blockedips');

// Create indexes for better performance
db.countries.createIndex({ "code": 1 }, { unique: true });
db.countries.createIndex({ "name": 1 });
db.countries.createIndex({ "isActive": 1 });

db.blockedips.createIndex({ "countryCode": 1, "isActive": 1 });
db.blockedips.createIndex({ "ipAddress": 1 });
db.blockedips.createIndex({ "severity": 1 });
db.blockedips.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

print('Database initialized successfully');