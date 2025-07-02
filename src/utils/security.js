// Security utility functions for Veiled-Verse

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - Sanitized HTML content
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.textContent = html; // This automatically escapes HTML
  
  // Allow only safe HTML tags and attributes
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'span', 'div'
  ];
  const allowedAttributes = ['class', 'id', 'style'];
  
  // Basic sanitization - remove script tags and dangerous attributes
  let sanitized = tempDiv.innerHTML
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/<[^>]*>/g, (match) => {
      // Only allow specific tags
      const tagName = match.match(/<(\w+)/)?.[1]?.toLowerCase();
      if (!allowedTags.includes(tagName)) {
        return '';
      }
      return match;
    });
  
  return sanitized;
};

/**
 * Validate and sanitize URLs
 * @param {string} url - The URL to validate
 * @param {Array} allowedDomains - Array of allowed domains
 * @returns {Object} - { isValid: boolean, error: string, sanitizedUrl: string }
 */
export const validateUrl = (url, allowedDomains = []) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required', sanitizedUrl: '' };
  }

  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed', sanitizedUrl: '' };
    }
    
    // Check against allowed domains if specified
    if (allowedDomains.length > 0) {
      const domain = urlObj.hostname.toLowerCase();
      if (!allowedDomains.some(allowed => domain.includes(allowed.toLowerCase()))) {
        return { isValid: false, error: 'Domain not allowed', sanitizedUrl: '' };
      }
    }
    
    return { isValid: true, error: '', sanitizedUrl: urlObj.href };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format', sanitizedUrl: '' };
  }
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {Object} - Password strength analysis
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      strength: 0,
      errors: ['Password is required'],
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
  }

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const strength = Object.values(requirements).filter(Boolean).length;
  const errors = [];

  if (!requirements.length) errors.push('At least 8 characters');
  if (!requirements.uppercase) errors.push('One uppercase letter');
  if (!requirements.lowercase) errors.push('One lowercase letter');
  if (!requirements.number) errors.push('One number');
  if (!requirements.special) errors.push('One special character');

  return {
    isValid: strength >= 4,
    strength,
    errors,
    requirements
  };
};

/**
 * Sanitize user input for display
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 15 minutes default
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }

  getRemainingAttempts(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

/**
 * Generate a secure random token
 * @param {number} length - Length of the token
 * @returns {string} - Secure random token
 */
export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Encrypt sensitive data for localStorage
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {string} - Encrypted data
 */
export const encryptData = (data, key) => {
  // This is a basic implementation - use a proper encryption library in production
  try {
    const encoded = btoa(encodeURIComponent(data));
    return encoded;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypt data from localStorage
 * @param {string} encryptedData - Encrypted data
 * @param {string} key - Decryption key
 * @returns {string} - Decrypted data
 */
export const decryptData = (encryptedData, key) => {
  // This is a basic implementation - use a proper encryption library in production
  try {
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}; 