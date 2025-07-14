import 'server-only';

export interface Paymaster {
  contract: string;
  paymaster: string;
  alias: string;
  name: string;
  published?: string;
}
