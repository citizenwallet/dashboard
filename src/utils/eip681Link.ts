export const generateEIP681Link = ({
  address,
  chainId = 1,
  amount,
}: {
  address: string;
  chainId?: number;
  amount?: number;
}): string => {
  let link = `ethereum:${address}@${chainId}`;

  if (amount) {
    link += `?value=${amount}`;
  }
  return link;
};
