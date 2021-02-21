/* To run  this example
    1. change directories to the solid-node-client folder
    2. npm run getToken, then follow prompts until JSON credentials are shown
    3. cut and past the JSON credentrals into the $COOKIE below
    4. change the userRoot variable below to your own pod root
*/
const userRoot = "https://pod.inrupt.com/jeff-zucker/";
const {SolidNodeClient} = require('../');

async function main(){
  const client = new SolidNodeClient({
    handlers : { https: 'solid-client-authn-node' }
  })
  let response1 = await client.fetch( userRoot );
  console.log(`Unauthenticated fetch of <${userRoot}> : ${response1.status}`);
  console.log( `\nlogging in ...` );
  let session = await client.login({
        clientId: $COOKIE.clientId,
    clientSecret: $COOKIE.clientSecret,
    refreshToken: $COOKIE.refreshToken,
      oidcIssuer: $COOKIE.oidcIssuer
  });
  if( session.info.isLoggedIn ) {
    console.log('Logged in!');
    let response2 = await session.fetch( userRoot );
    console.log(`Authenticated fetch of <${userRoot}> : ${response2.status}`);
  }
  else {
    console.log(`Couldn't log in.`);
  }
}
main();

