// Enhanced security input validation utilities
import { sanitizeText, validateUrl } from '@/utils/secureValidation';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  sanitizedValue?: string;
}

// File upload security validation
export const validateFileUpload = (file: File): ValidationResult => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, message: 'Le fichier ne peut pas dépasser 10MB' };
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf', 'text/plain', 'application/json'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Type de fichier non autorisé' };
  }

  // Check filename for malicious patterns
  const filename = file.name;
  if (/[<>:"/\\|?*]/.test(filename) || filename.includes('..')) {
    return { isValid: false, message: 'Nom de fichier invalide' };
  }

  // Check for double extensions
  const parts = filename.split('.');
  if (parts.length > 2) {
    return { isValid: false, message: 'Extensions multiples non autorisées' };
  }

  return { isValid: true, message: 'Fichier valide' };
};

// URL redirect validation
export const validateRedirectUrl = (url: string, allowedDomains: string[] = []): ValidationResult => {
  if (!validateUrl(url)) {
    return { isValid: false, message: 'URL invalide' };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Block local/private addresses
    const hostname = parsedUrl.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^169\.254\./,
      /^0\./
    ];

    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      return { isValid: false, message: 'Adresse locale non autorisée' };
    }

    // Check allowed domains if specified
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      
      if (!isAllowed) {
        return { isValid: false, message: 'Domaine non autorisé' };
      }
    }

    return { isValid: true, message: 'URL valide', sanitizedValue: url };
  } catch {
    return { isValid: false, message: 'URL malformée' };
  }
};

// Enhanced SQL injection prevention
export const validateUserInput = (input: string, maxLength: number = 1000): ValidationResult => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, message: 'Entrée invalide' };
  }

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(-{2,}|\/\*|\*\/)/,
    /(;|\||&)/,
    /('|"|`)/
  ];

  if (sqlPatterns.some(pattern => pattern.test(input))) {
    return { isValid: false, message: 'Caractères non autorisés détectés' };
  }

  const sanitized = sanitizeText(input, maxLength);
  
  if (sanitized !== input) {
    return { 
      isValid: true, 
      message: 'Entrée nettoyée', 
      sanitizedValue: sanitized 
    };
  }

  return { isValid: true, message: 'Entrée valide', sanitizedValue: sanitized };
};

// Content Security Policy validation for user-generated content
export const validateUserContent = (content: string): ValidationResult => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, message: 'Contenu invalide' };
  }

  // Check for XSS patterns
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /<form[\s\S]*?>/gi
  ];

  if (xssPatterns.some(pattern => pattern.test(content))) {
    return { isValid: false, message: 'Contenu potentiellement malveillant détecté' };
  }

  // Sanitize and limit content
  const sanitized = sanitizeText(content, 10000);
  
  return { 
    isValid: true, 
    message: 'Contenu valide', 
    sanitizedValue: sanitized 
  };
};

// IP address validation and classification
export const validateAndClassifyIp = (ip: string): { 
  isValid: boolean; 
  isPrivate: boolean; 
  isSuspicious: boolean; 
  type: 'ipv4' | 'ipv6' | 'invalid' 
} => {
  if (!ip || typeof ip !== 'string') {
    return { isValid: false, isPrivate: false, isSuspicious: false, type: 'invalid' };
  }

  // IPv4 validation
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipv4Match = ip.match(ipv4Regex);
  
  if (ipv4Match) {
    const octets = ipv4Match.slice(1).map(Number);
    const isValidIpv4 = octets.every(octet => octet >= 0 && octet <= 255);
    
    if (isValidIpv4) {
      const isPrivate = (
        octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168) ||
        (octets[0] === 127)
      );
      
      // Check for suspicious patterns (common bot/scanner IPs)
      const isSuspicious = (
        octets[0] === 0 ||
        (octets[0] === 169 && octets[1] === 254)
      );
      
      return { isValid: true, isPrivate, isSuspicious, type: 'ipv4' };
    }
  }

  // Basic IPv6 validation
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  if (ipv6Regex.test(ip)) {
    const isPrivate = ip.startsWith('::1') || ip.startsWith('fc') || ip.startsWith('fd');
    return { isValid: true, isPrivate, isSuspicious: false, type: 'ipv6' };
  }

  return { isValid: false, isPrivate: false, isSuspicious: false, type: 'invalid' };
};