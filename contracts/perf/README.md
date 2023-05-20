# Perf

Install dependencies, start arlocal, load wallets with AR tokens and run the performance test.

The performance test runs 20,000 `create-mint` requests and runs `mint` after each 10,000 requests. After running the requests, it spits out memory usage info.

- `npm i`
- `npx arlocal`
- `npm run perf:load-wallets && npm run perf`