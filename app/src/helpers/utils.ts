export function formatAddress(address: any, wrap: boolean) {
  if (!address || address.error) {
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
