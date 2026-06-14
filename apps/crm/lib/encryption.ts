import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '01234567890123456789012345678901';

if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY).length !== 32) {
  console.warn('WARNING: ENCRYPTION_KEY is not set or not 32 bytes long. Using fallback insecure key.');
}

export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  // Use a proper key derived from the ENCRYPTION_KEY
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  // Return format: iv:salt:tag:encrypted
  return `${iv.toString('hex')}:${salt.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 4) return encryptedText; // Not encrypted with our format or empty
    
    const [ivHex, saltHex, tagHex, encryptedHex] = parts;
    
    const iv = Buffer.from(ivHex, 'hex');
    const salt = Buffer.from(saltHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return ''; // Return empty string on failure to avoid leaking data
  }
}
