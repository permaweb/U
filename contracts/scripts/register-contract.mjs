import { WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

async function register(tx) {
  // const jwk = JSON.parse(
  //   fs.readFileSync(process.env.PATH_TO_WALLET).toString()
  // );
  const warp = WarpFactory.forMainnet().use(new DeployPlugin());
  const result = await warp.register(tx, 'node2');
  console.log('RESULT', result);
  return result;
}
register(process.argv[2]).catch(console.log);
