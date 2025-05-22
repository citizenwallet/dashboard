export class StorageService {
  alias: string;
  constructor(alias: string) {
    this.alias = alias;
  }

  setKey(key: StorageKey, value: string) {
    localStorage.setItem(`${this.alias}_${key}`, value);
  }

  getKey(key: StorageKey) {
    return localStorage.getItem(`${this.alias}_${key}`);
  }

  deleteKey(key: StorageKey) {
    localStorage.removeItem(`${this.alias}_${key}`);
  }
}

export const StorageKeys = {
  session_private_key: 'session_private_key',
  session_hash: 'session_hash',
  session_source_value: 'session_source_value',
  session_source_type: 'session_source_type',

  hash: 'hash' //hash of local accounts
} as const;

export type StorageKey = keyof typeof StorageKeys;
