import {SolidNodeClient} from '../';
const client = new SolidNodeClient();
// import * as readline from 'readline-sync';

async function main(){
/*
  console.log('\nThis will create a local file-system-based pod.')
  console.log(
    'Enter a full path to the place you want your pod (e.g. /home/jeff/myPod/)'
  );
  let basePath = await readline.question(' > ').replace(/\/$/,'');
*/
  let basePath = "/home/jeff/myPod/";
  client.createLocalPod(basePath);
}
main()

