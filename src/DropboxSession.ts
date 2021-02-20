/** DROPBOX SESSION 
 */
import {SolidRestDropbox} from '@solid-rest/dropbox';

export class DropboxSession {
  session:any
  dbx:any
  constructor(options:any={}){
    this.dbx = new SolidRestDropbox();
//    this.fetch = this.dbx.fetch;
    this.session = {
      info : { isLoggedIn:false },
    }
  }
  async login(credentials:any) {
    const session = await this.dbx.login(credentials);
    if(session){
       this.session.info = { isLoggedIn:true };
//       this.session.fetch = this.dbx.fetch.bind(this.dbx);
    }
    return this.session;
  }
}

import {credentials} from '/home/jeff/.solid-identities.js';
async function main(){
//  let client = new DropboxSession();
  let client = new SolidRestDropbox();
  let session = await client.login(credentials.dropbox);
  console.log(session)
  let response = await client.fetch('dropbox:///x.txt');
  console.log(response.status)
}
main();

