export function shortenAddress(address?: string, chars = 4) {
  // Check if it's a valid address
  if (!address) return "";
  const parsed = address.toString();

  if (parsed.length <= chars * 2) {
    return parsed;
  }

  return `${parsed.slice(0, chars)}...${parsed.slice(-chars)}`;
}
