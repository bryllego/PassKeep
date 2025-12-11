import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key-change-in-production';

// In-memory storage (replace with database in production)
const users = [];
const passwords = [];

app.use(cors());
app.use(express.json());
app.set('trust proxy', 1); // Trust first proxy for correct IP detection

// Rate limiting middleware (simple implementation)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const userAttempts = rateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userAttempts.resetTime) {
    userAttempts.count = 0;
    userAttempts.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userAttempts.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  userAttempts.count++;
  rateLimit.set(ip, userAttempts);
  return true;
}

// Input validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // Strong password requirements: min 12 chars, uppercase, lowercase, number, special char
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Encrypt/Decrypt passwords
function encryptPassword(password, masterPassword) {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
}

function decryptPassword(encryptedPassword, masterPassword) {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user exists
    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password with bcrypt (10 rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store user
    const user = {
      id: users.length + 1,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Rate limiting
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all passwords for user
app.get('/api/passwords', authenticateToken, (req, res) => {
  try {
    const userPasswords = passwords.filter(p => p.userId === req.user.userId);
    // Don't send encrypted passwords, just metadata
    const passwordList = userPasswords.map(p => ({
      id: p.id,
      website: p.website,
      username: p.username,
      createdAt: p.createdAt
    }));
    res.json(passwordList);
  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific password (decrypted) - POST because we need master password in body
app.post('/api/passwords/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { masterPassword } = req.body;

    if (!masterPassword) {
      return res.status(400).json({ error: 'Master password required' });
    }

    const passwordEntry = passwords.find(p => p.id === parseInt(id) && p.userId === req.user.userId);
    if (!passwordEntry) {
      return res.status(404).json({ error: 'Password not found' });
    }

    // Verify master password by attempting decryption
    try {
      const decryptedPassword = decryptPassword(passwordEntry.encryptedPassword, masterPassword);
      
      res.json({
        id: passwordEntry.id,
        website: passwordEntry.website,
        username: passwordEntry.username,
        password: decryptedPassword
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid master password' });
    }
  } catch (error) {
    console.error('Get password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new password
app.post('/api/passwords', authenticateToken, (req, res) => {
  try {
    const { website, username, password, masterPassword } = req.body;

    if (!website || !username || !password || !masterPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Encrypt password with master password
    const encryptedPassword = encryptPassword(password, masterPassword);

    const passwordEntry = {
      id: passwords.length + 1,
      userId: req.user.userId,
      website,
      username,
      encryptedPassword,
      createdAt: new Date().toISOString()
    };

    passwords.push(passwordEntry);

    res.status(201).json({
      id: passwordEntry.id,
      website: passwordEntry.website,
      username: passwordEntry.username,
      createdAt: passwordEntry.createdAt
    });
  } catch (error) {
    console.error('Add password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update password
app.put('/api/passwords/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { website, username, password, masterPassword } = req.body;

    const passwordEntry = passwords.find(p => p.id === parseInt(id) && p.userId === req.user.userId);
    if (!passwordEntry) {
      return res.status(404).json({ error: 'Password not found' });
    }

    if (website) passwordEntry.website = website;
    if (username) passwordEntry.username = username;
    if (password && masterPassword) {
      passwordEntry.encryptedPassword = encryptPassword(password, masterPassword);
    }

    res.json({
      id: passwordEntry.id,
      website: passwordEntry.website,
      username: passwordEntry.username,
      createdAt: passwordEntry.createdAt
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete password
app.delete('/api/passwords/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const index = passwords.findIndex(p => p.id === parseInt(id) && p.userId === req.user.userId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Password not found' });
    }

    passwords.splice(index, 1);
    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel serverless function
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

