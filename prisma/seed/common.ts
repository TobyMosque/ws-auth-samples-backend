import { v4 as uid } from 'uuid';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';

export const randomBytesAsync = promisify(randomBytes);
export const scryptAsync = promisify(scrypt);

const _date = new Date();
export function comb({ date }: { date?: Date } = {}) {
  if (!date) {
    _date.setTime(_date.getTime() + 1);
    date = _date;
  }
  const uuid = uid();
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
  return uuid.replace(uuid.slice(0, 13), comb);
}
