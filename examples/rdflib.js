/* Use Solid-Node-Client and rdflib to read the contents of a local folder 
*/
import {SolidNodeClient} from '../';
import * as $rdf from 'rdflib';

let client = new SolidNodeClient();
let store = $rdf.graph();
let fetcher = $rdf.fetcher(store,{fetch:client.fetch.bind(client)});

let folder = $rdf.sym(`file://${process.cwd()}/`);
let contains = $rdf.sym(`http://www.w3.org/ns/ldp#contains`);

async function main(){
  await fetcher.load( folder );
  store.match( folder, contains ).filter( (stmt)=>{
    console.log( stmt.object.value )
  });
}
main();
