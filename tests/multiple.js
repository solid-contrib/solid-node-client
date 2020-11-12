const SolidNodeClient = require("../").SolidNodeClient;

let url = `https://jeff-zucker.solidcommunity.net/public/hidden.html`

async function main(){
  const client_1 = new SolidNodeClient();
  const client_2 = new SolidNodeClient();
  await client_2.login();
  let response_1 = await client_1.fetch(url);
  let response_2 = await client_2.fetch(url);
  console.log(
`
    Unauthorized client got <${response_1.status}>.  
    Authorized client got <${response_2.status}>.  
`)
}
main();

/** EXPECTED OUTPUT

    Unauthorized client got <401>.  
    Authorized client got <200>.  
*/
