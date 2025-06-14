
// Validation et sanitisation sécurisées centralisées
import DOMPurify from 'dompurify';

// Rate limiting en mémoire (pour le côté client)
const rateLimitStore = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

// Validation email renforcée
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Pattern email strict conforme RFC 5322
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Vérifications supplémentaires
  if (email.length > 254) return false; // RFC 5321 limite
  if (email.includes('..')) return false; // Doubles points consécutifs
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return emailRegex.test(email);
};

// Validation mot de passe renforcée
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Le mot de passe est requis' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Le mot de passe ne peut pas dépasser 128 caractères' };
  }
  
  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre minuscule' };
  }
  
  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre majuscule' };
  }
  
  // Au moins un chiffre
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  
  // Au moins un caractère spécial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial' };
  }
  
  // Vérifier contre les mots de passe communs
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    return { isValid: false, message: 'Ce mot de passe est trop commun, veuillez en choisir un autre' };
  }
  
  return { isValid: true, message: 'Mot de passe valide' };
};

// Sanitisation de texte sécurisée
export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  if (!text || typeof text !== 'string') return '';
  
  // Supprimer les caractères de contrôle et les espaces multiples
  let sanitized = text
    .replace(/[\x00-\x1F\x7F]/g, '') // Caractères de contrôle
    .replace(/\s+/g, ' ') // Espaces multiples
    .trim();
  
  // Limiter la longueur
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Nettoyer avec DOMPurify pour supprimer tout HTML/script potentiel
  sanitized = DOMPurify.sanitize(sanitized, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  return sanitized;
};

// Validation nom d'utilisateur
export const validateUsername = (username: string): { isValid: boolean; message: string } => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Le nom est requis' };
  }
  
  const sanitized = sanitizeText(username, 50);
  
  if (sanitized.length < 2) {
    return { isValid: false, message: 'Le nom doit contenir au moins 2 caractères' };
  }
  
  if (sanitized.length > 50) {
    return { isValid: false, message: 'Le nom ne peut pas dépasser 50 caractères' };
  }
  
  // Vérifier les caractères autorisés (lettres, espaces, tirets, apostrophes)
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(sanitized)) {
    return { isValid: false, message: 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes' };
  }
  
  return { isValid: true, message: 'Nom valide' };
};

// Rate limiting côté client
export const checkRateLimit = (
  key: string, 
  maxAttempts: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  // Nettoyer les entrées expirées
  if (record && now - record.lastAttempt > windowMs) {
    rateLimitStore.delete(key);
    return true;
  }
  
  // Vérifier si bloqué
  if (record && record.blockedUntil && now < record.blockedUntil) {
    return false;
  }
  
  if (!record) {
    rateLimitStore.set(key, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Incrémenter le compteur
  record.count++;
  record.lastAttempt = now;
  
  // Bloquer si limite atteinte
  if (record.count >= maxAttempts) {
    record.blockedUntil = now + windowMs;
    return false;
  }
  
  return true;
};

// Validation URL sécurisée
export const validateUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    // Autoriser seulement HTTP et HTTPS
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

// Échapper les caractères HTML
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

// Générateur de messages d'erreur génériques pour l'auth
export const getGenericAuthError = (errorType: 'login' | 'signup' | 'general' = 'general'): string => {
  const errors = {
    login: 'Les informations de connexion sont incorrectes. Veuillez vérifier votre email et mot de passe.',
    signup: 'Impossible de créer le compte. Veuillez vérifier vos informations et réessayer.',
    general: 'Une erreur est survenue. Veuillez réessayer plus tard.'
  };
  
  return errors[errorType];
};
