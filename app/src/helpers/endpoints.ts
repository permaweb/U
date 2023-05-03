export function getBalanceEndpoint(wallet: string) {
  return `${import.meta.env.VITE_LOCAL ? 'http://localhost:1984' : 'https://arweave.net'}/wallet/${wallet}/balance`;
}
