import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const VERSION_BYTE = 0x01;
const KEY_SALT = 'cda-invoice-pdf-v1';

function deriveKey(secret: string): Buffer {
  return crypto.scryptSync(secret, KEY_SALT, 32);
}

export function encrypt(buffer: Buffer, secret: string): Buffer {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([Buffer.from([VERSION_BYTE]), iv, authTag, encrypted]);
}

export function decrypt(data: Buffer, secret: string): Buffer {
  if (data.length < 1 + IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    return data;
  }
  const version = data[0];
  if (version !== VERSION_BYTE) {
    return data;
  }
  const iv = data.subarray(1, 1 + IV_LENGTH);
  const authTag = data.subarray(1 + IV_LENGTH, 1 + IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(1 + IV_LENGTH + AUTH_TAG_LENGTH);
  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  try {
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  } catch {
    return data;
  }
}
