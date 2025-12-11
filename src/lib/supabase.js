import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Security: Enable secure cookie storage
    storage: window.localStorage,
    // Security: Set secure session options
    flowType: 'pkce', // PKCE flow for enhanced security
  },
});

// Encryption utilities for password storage
export const encryptPassword = (password, masterPassword) => {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
};

export const decryptPassword = (encryptedPassword, masterPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Invalid master password');
    }
    return decrypted;
  } catch (error) {
    throw new Error('Invalid master password');
  }
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password is too common. Please choose a stronger password');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate secure random password
export const generateSecurePassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
};

