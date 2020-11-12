import { getSession, getNodeSolidServerCookie, getAuthFetcher } 
  from "solid-auth-fetcher";
import fetch from "node-fetch";
import SolidRest from "solid-rest";

export function init(){
  return new SolidNodeClient();
}

export class SolidNodeClient {
  rest?:any;
  session?:any;
  debug?:any;
  authFetcher?:any;
  constructor(options:any={}){
    options = options || {};
    this.rest = options.rest || new SolidRest();
    this.session = options.session || new NodeNoAuthSession({rest:this.rest});
    this.debug = false;
    return this;
  }
  async fetch(url:string,options:any) {
    return await this.session.fetch(url,options);
  }
  async login(options:IloginOptions) {
    options = options || {};
    options.idp      = options.idp || process.env.SOLID_IDP;
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
  async _getAuthFetcher(options:IloginOptions,callback:Function){
    const cookie = await getNodeSolidServerCookie(
      options.idp, options.username, options.password
    );
    this.authFetcher = await getAuthFetcher(
      options.idp, cookie, "https://solid-node-client"
    );
    let session = await getSession();
    let self=this;
    this.authFetcher.onSession( async(s) => {
      let originalFetch = s.fetch;
      s.fetch = (url:string,opts:any) => {
        if( url.startsWith('http') ) return originalFetch(url,opts);
        return self.rest.fetch(url,opts);
      }
      s.fetch.bind(s)
      callback(s);
    });
  }
  async logout() {
    if(this.session.loggedIn) {
      await this.session.logout();
    }
    this.session = new NodeNoAuthSession({rest:this.rest});
    this.authFetcher = null;
 }
 async currentSession(){
    return ( this.session.loggedIn ) ? this.session : null ;
  }
}

/** UNAUTHENTICATED SESSION 
 */
class NodeNoAuthSession {
  loggedIn: boolean;
  rest: any;
  constructor(options:any={}){
    this.loggedIn=false;
    this.rest=options.rest;
  }
  logout() {}
  fetch(url:string,options:any) {
    if( url.startsWith('http') ) return fetch(url,options)
    return this.rest.fetch(url,options);
  }
}

/** INTERFACES
 */
interface IloginOptions {
  idp? : string,
  username? : string,
  password? : string,
  debug? : boolean,
  rest? : any,
}
interface InodeClient {
  session? : any;
  rest? : any;
  debug? : any;
  authFetcher? : any;
  fetch(url:string,options:any):any;
  login(options:IloginOptions):any;
  logout():void;
}

/* END */