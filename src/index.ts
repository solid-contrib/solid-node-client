import { getSession, getNodeSolidServerCookie, getAuthFetcher } from "solid-auth-fetcher";
import fetch from "node-fetch";
import SolidRest from "solid-rest";

let rest = new SolidRest();
let DEBUG = false;
let authFetcher;
let globalSession;

/** PUBLIC METHODS 
 */
export interface IloginOptions {
  idp? : string,
  username? : string,
  password? : string,
  debug? : boolean,
  rest? : any,
}
export async function fetch(url:string,options:any) {
  return await globalSession.fetch(url,options);
}
export async function login(options:IloginOptions={}) {
  options.idp      = options.idp || process.env.SOLID_IDP;
  options.username = options.username || process.env.SOLID_USERNAME;
  options.password = options.password || process.env.SOLID_PASSWORD;
  options.debug    = options.debug || (process.env.SOLID_DEBUG) ?true :false;
  options.rest     = rest
  return await  _getAuthSession( options );
}
export async function logout() {
  if(globalSession.loggedIn) {
    await globalSession.logout();
  }
  globalSession = new NodeNoAuthSession();
  authFetcher = null;
}
export async function currentSession(){
  return ( globalSession.loggedIn ) ? globalSession : null ;
}
export function currentAuthFetcher() {
   return authFetcher; 
}
export function setRestHandlers(handlers){
  if(typeof handlers !="undefined"){
    rest = new SolidRest( handlers ); 
  }
} 

/** END OF PUBLIC METHODS 
 */


/** AUTHENTICATED SESSION
 */

async function _getAuthSession(options:IloginOptions){
  options.idp      = options.idp || process.env.SOLID_IDP;
  options.username = options.username || process.env.SOLID_USERNAME;
  options.password = options.password || process.env.SOLID_PASSWORD;
  options.debug    = options.debug || (process.env.SOLID_DEBUG) ?true :false;
  options.rest     = rest;
  return new Promise((resolve, reject) => {
    _getAuthFetcher( options, (session) => {
      resolve(session);
    });
  })
}
async function _getAuthFetcher(options:IloginOptions,callback:Function){
  const cookie = await getNodeSolidServerCookie(options.idp, options.username, options.password);
  const authFetcher = await getAuthFetcher(options.idp, cookie, "https://solid-node-client");
  let session = await getSession();
  authFetcher.onSession( async(s) => {
    let originalFetch = s.fetch;
    s.fetch = (url:string,opts:any) => {
      if( url.startsWith('http') ) return originalFetch(url,opts);
      return options.rest.fetch(url,opts);
    }
    globalSession =  s;
    callback(s);
  });
}


/** UNAUTHENTICATED SESSION 
 */
class NodeNoAuthSession {
  loggedIn: boolean;
  constructor(){
    this.loggedIn=false;
  }
  logout() {}
  fetch(url:string,options:any) {
    if( url.startsWith('http') ) return fetch(url,options)
    return rest.fetch(url,options);
  }
}
globalSession = new NodeNoAuthSession();

/* END */