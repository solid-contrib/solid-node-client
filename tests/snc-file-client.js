import {SolidNodeClient,localUri} from '../src/solid-node-client.js';
const client = new SolidNodeClient();
const fileManager = client.getFileManager();

let remotePrivateThing = 'https://jeff-zucker.solidcommunity.net/settings/privateTypeIndex.ttl';
let localLocation = localUri('./test.ttl');

async function test(){
  await client.login();
  let response = await fileManager.copy( remotePrivateThing, localLocation );
  console.log(response.status,response.statusText);
}
test();



