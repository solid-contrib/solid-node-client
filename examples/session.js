import {SolidNodeClient} from '../';

import {credentials} from '/home/jeff/.solid-identities.js';
let creds = credentials.inruptCom;
let authn = "solid-client-authn-node";

//let creds = credentials.inruptNet;
//let authn = "solid-auth-fetcher";

const client = new SolidNodeClient({ handlers : {  https : authn } });

async function main(){
  let session = await client.getSession();
  console.log( "Pre-login : ",session.isLoggedIn, session.webId );
  let sess = await client.login(creds);
  session = await client.getSession();
  console.log( "Post-login : ",sess.isLoggedIn, sess.webId );
  console.log( "Post-login : ",session.isLoggedIn, session.webId );
  console.log(sess);
}
main()
