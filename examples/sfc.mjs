/* Use Solid-Node-Client with Solid-File-Client
   Log in,  then copy a private file from your pod to local file system
*/
import {SolidNodeClient} from '../dist/esm/index.js';
import SolidFileClient from 'solid-file-client';
const auth = new SolidNodeClient();
const fileClient = new SolidFileClient(auth);

// Set paths to your files here
const remoteUrl = `https://jeff-zucker.solidcommunity.net/private/hidden.html`;
const localUrl =  `file://${process.cwd()}/test.html`;

async function main(){
  let session = await auth.login();
  if( session.isLoggedIn ){
     console.log(`Logged in as <${session.webId}>`);
     let content = await fileClient.readFile( remoteUrl );
     let res=await fileClient.createFile( localUrl, content,'text/turtle');
     console.log(res.statusText)
  }
}
main();
