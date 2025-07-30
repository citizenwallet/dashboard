import { create } from 'zustand';

export interface SessionState {
  sourceValue: string | null;
  sourceType: string | null;
  privateKey: string | null;
  hash: string | null; // convert to bytes when signing
  accountAddress: string | null;
  balance: string | null;

  setAccountAddress: (accountAddress: string | null) => void;
  setBalance: (balance: string | null) => void;

  setSourceValue: (sourceValue: string) => void;
  resetSourceValue: () => void;

  setSourceType: (sourceType: string) => void;
  resetSourceType: () => void;

  setPrivateKey: (privateKey: string) => void;
  resetPrivateKey: () => void;

  setHash: (hash: string) => void;
  resetHash: () => void;

  clear: () => void;
}

const initialState = () => ({
  sourceValue: null,
  sourceType: null,
  privateKey: null,
  hash: null,
  accountAddress: null,
  balance: null
});

export const useSessionStore = create<SessionState>()((set) => ({
  ...initialState(),

  setAccountAddress: (accountAddress) => set({ accountAddress }),
  setBalance: (balance) => set({ balance }),

  setSourceValue: (sourceValue) => set({ sourceValue }),
  resetSourceValue: () => set({ sourceValue: null }),

  setSourceType: (sourceType) => set({ sourceType }),
  resetSourceType: () => set({ sourceType: null }),

  setPrivateKey: (privateKey) => set({ privateKey }),
  resetPrivateKey: () => set({ privateKey: null }),

  setHash: (hash) => set({ hash }),
  resetHash: () => set({ hash: null }),

  clear: () => set(initialState())
}));
