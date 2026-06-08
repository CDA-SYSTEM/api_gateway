import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const V1 = 0x01;
const V2_WITH_MIME = 0x02;
const KEY_SALT = 'cda-encrypted-files-v2';

function deriveKey(secret: string): Buffer {
  return crypto.scryptSync(secret, KEY_SALT, 32);
}

export function encrypt(buffer: Buffer, secret: string, mimeType?: string): Buffer {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  if (mimeType) {
    const mimeBuf = Buffer.from(mimeType, 'utf-8');
    const mimeLen = Math.min(mimeBuf.length, 255);
    return Buffer.concat([
      Buffer.from([V2_WITH_MIME, mimeLen]),
      mimeBuf.subarray(0, mimeLen),
      iv,
      authTag,
      encrypted,
    ]);
  }

  return Buffer.concat([Buffer.from([V1]), iv, authTag, encrypted]);
}

export function decrypt(data: Buffer, secret: string): Buffer {
  if (data.length < 2) return data;

  const version = data[0];
  let offset: number;

  if (version === V2_WITH_MIME) {
    const mimeLen = data[1];
    offset = 2 + mimeLen;
  } else if (version === V1) {
    offset = 1;
  } else {
    return data;
  }

  if (data.length < offset + IV_LENGTH + AUTH_TAG_LENGTH + 1) return data;

  const iv = data.subarray(offset, offset + IV_LENGTH);
  const authTag = data.subarray(offset + IV_LENGTH, offset + IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = data.subarray(offset + IV_LENGTH + AUTH_TAG_LENGTH);

  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  try {
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  } catch {
    return data;
  }
}

export function extractMimeType(data: Buffer): string | null {
  if (data.length < 2) return null;
  if (data[0] !== V2_WITH_MIME) return null;

  const mimeLen = data[1];
  if (data.length < 2 + mimeLen) return null;

  return data.subarray(2, 2 + mimeLen).toString('utf-8');
}
