import {SolidRestFile} from '@solid-rest/file';
import {NoAuthSession} from './NoAuthSession'
import fetch from "node-fetch";
import * as UrlObj from 'url';

export class SolidNodeClient {
  debug?:any;
  handlers?:any;
  parser?:any;
  constructor(options:any={}){
    options = options || {};
    options.handlers = options.handlers || {};
    options.handlers.http = options.handlers.http || fetch;
    options.handlers.file = options.handlers.file || new NoAuthSession({
      httpFetch: options.handlers.http,
      fileHandler: new SolidRestFile() 
    });
    this.handlers = options.handlers;    
    this.debug = false;
    return this;
  }
  async fetch(url:string,options:any) {
    let protocol = new UrlObj.URL(url).protocol.replace(/:$/,'');
    let _fetch = this.handlers[protocol] && this.handlers[protocol].session 
               ? this.handlers[protocol].session.fetch 
               : this.handlers.file.session.fetch;
    return await _fetch(url.toString(),options)
  }
  async login(credentials:any={},protocol:string="https") {
    this.handlers.https = this.handlers.https || "";
    if(protocol==='https' && typeof this.handlers.https === 'string'){
      if(this.handlers.https==='solid-client-authn-node'){
        let scan = await import('./EssAuthSession');           
        this.handlers.https = new scan.EssAuthSession();
      }
      else {
        let saf = await import('./NssAuthSession');           
        this.handlers.https = new saf.NssAuthSession();
      }
    }
    const session = this.handlers[protocol] ?await this.handlers[protocol].login(credentials) :this.handlers.file.session;
    return session;
  }
  async getSession(protocol:string="https") {
    const session = this.handlers[protocol] && this.handlers[protocol].session ?this.handlers[protocol].session :this.handlers.file.session;
    return session;
  }
  async logout(protocol:string="https") {
    const session = await this.getSession(protocol);    
    if(session.info.isLoggedIn) {
      await session.logout();
    }
  }
  async createServerlessPod( base:string ){
    return await this.handlers.file.createServerlessPod( base );
  }
}

/** INTERFACES
 */
interface InodeClient {
  session? : any;
//  rest? : any;
  debug? : any;
  authFetcher? : any;
  fetch(url:string,options:any):any;
  login(options:IloginOptions):any;
  logout():void;
}
  interface IloginOptions {
    idp? : string,
    username? : string,
    password? : string,
    debug? : boolean,
//    rest? : any,
  }
