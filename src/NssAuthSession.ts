/* Login and return session for NSS/PSS via solid-auth-fetcher
*/

import { getSession, getNodeSolidServerCookie, getAuthFetcher } 
 from "solid-auth-fetcher";
import { ILoginOptions } from ".";
import { IAuthSession, INssSession } from "./IAuthSession";

export class NssAuthSession implements IAuthSession {

  session:INssSession
  authFetcher:any

  async login(options:ILoginOptions = {}) {
    options.idp      = options.idp || process.env.SOLID_IDP || "";
    options.username = options.username || process.env.SOLID_USERNAME;
    options.password = options.password || process.env.SOLID_PASSWORD;
    options.debug    = options.debug || (process.env.SOLID_DEBUG) ?true :false;
    let self=this;
    return new Promise((resolve, reject) => {
      this._getAuthFetcher( options, (session) => {
        self.session = session;
        resolve(session);
      });
    })
  }

  async _getAuthFetcher(options:ILoginOptions,callback:Function){
    let cookie;
    try {
      cookie = await getNodeSolidServerCookie(
        options.idp, options.username, options.password
      );
    }catch(e){
      this.authFetcher = null;
      return callback( null );
    }
    if( !cookie || !cookie.match(/nssidp/) ){
      // couldn't login
      this.authFetcher = null;
      return callback( null );
    }
    this.authFetcher = await getAuthFetcher(
      options.idp, cookie, "https://solid-node-client"
    );
    let session = await getSession();
    this.authFetcher.onSession( async(s: INssSession) => {
      s.info = {};
      s.info.isLoggedIn = s.isLoggedIn = s.loggedIn;
      s.info.webId = s.webId
      s.info.isNss = true
      callback(s);
    });
  }
}

// ENDS