/* Use Solid-Node-Client and rdflib to read the contents of a local folder 
*/
import {SolidNodeClient,localUri,sym} from '../src/solid-node-client.js';
const cli = new SolidNodeClient();

const localFolder = sym( localUri('./') );
const contains = sym(`http://www.w3.org/ns/ldp#contains`);

(async()=>{
  await cli.fetcher.load( localFolder );
  cli.store.each( localFolder, contains ).filter( (resource)=>{
    console.log( resource.uri )
  });
})();

