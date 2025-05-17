import {SolidNodeClient,localUri} from '../src/solid-node-client.js';
const client = new SolidNodeClient();

const folders = {
   remotePublic : 'https://jeff-zucker.solidcommunity.net/public/',
  remotePrivate : 'https://jeff-zucker.solidcommunity.net/settings/',
          local : localUri('./'),
}
const content = `
  @prefix ex: <http://example.com/#>.
  ex:this a ex:triple.
`;
const patchContent = `
  @prefix solid: <http://www.w3.org/ns/solid/terms#> .
  @prefix ex: <http://example.com/#>.
  <> a solid:InsertDeletePatch ;
  solid:inserts {ex:another ex:test ex:triple} .
`;

async function test() {
  await client.login();
  if(client.isLoggedIn){
    let patchedContent;
    for(let f of Object.keys(folders)) {
      let file = folders[f] + 'test.ttl';
      let r1 = await client.put(file,content);
      let r2 = await client.head(file);
      let r3 = await client.patch(file,patchContent);
      patchedContent = await client.get(file);
      let r4 = await client.delete(file);
      if(r1.ok) console.log(`${f} Create okay!`);
      if(r2.ok) console.log(`${f} Read okay!`);
      if(r3.ok) console.log(`${f} Update okay!`);
      else console.log(r3);
      if(r4.ok) console.log(`${f} Delete okay!`);
    }
    console.log("\n",await patchedContent.text());
  }
}
test();


