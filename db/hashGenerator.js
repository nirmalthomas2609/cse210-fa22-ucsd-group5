import {createHash} from crypto

export function generateHash(string) {
    return createHash('sha256').update(string).digest('hex');
  }