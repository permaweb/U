export function formatAddress(address: string | null, wrap: boolean) {
  if (!address) {
    return '';
  }
  const formattedAddress =
    address.substring(0, 5) + '...' + address.substring(36, address.length - 1);
  return wrap ? `(${formattedAddress})` : formattedAddress;
}

export function convertCamelCase(str: string) {
  const s = str.replace(/([A-Z])/g, ' $1');
  return s.replace(/^./, (firstChar) => firstChar.toUpperCase()).trim();
}
