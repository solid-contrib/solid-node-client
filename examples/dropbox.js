import {credentials} from '/home/jeff/.solid-identities.js';
import {SolidNodeClient} from '../';
import {DropboxSession} from '../src/DropboxSession';
const client = new SolidNodeClient({
  handlers : { dropbox: new DropboxSession() }
});

const loginProfile = { access_token : credentials.dropbox.access_token };
const protocol = 'dropbox';

const testFolder = 'dropbox:///';
const testFile = 'dropbox:///x.txt';

async function main(){
  let session = await client.login( loginProfile, protocol );
//  console.log('session:',session);
  await readFolder( testFolder );
  await readFile( testFile );
}
main();

async function readFile(file){
   console.log("reading file ",file);
   let response = await client.fetch(file);
   console.log("got content : ",await response.text(),"\n");
   console.log("got status : ",response.status,response.statusText,"\n");
}
async function readFolder(folder){
   console.log("reading folder ",folder);
   let response = await client.fetch(folder);
   let content = await response.text();
   console.log("got container turtle : ",content.length,"\n");
   console.log("got status : ",response.status,response.statusText,"\n");
}


  
