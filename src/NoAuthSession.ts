/** UNAUTHENTICATED SESSION 
 */
import { IAuthSession, ISession } from './IAuthSession';

export class NoAuthSession implements IAuthSession {

  session:ISession;
  fileHandler: any;
  httpFetch: any;
  createServerlessPod:any;

  constructor(options:INoAuthOptions={}){
    this.fileHandler = options.fileHandler;
    this.httpFetch = options.httpFetch;
    this.createServerlessPod = this.fileHandler?.createServerlessPod.bind(this.fileHandler);
    this.session = {
      isLoggedIn: false,
      info : { isLoggedIn:false },
      fetch : this._fetch.bind(this),
      logout : ()=>{},
    }
  }
  _fetch(url:string,options:any) {
    if( url.startsWith('file') ) return this.fileHandler.fetch(url,options);
    else return this.httpFetch(url,options)
  }
  
}

/* INTERFACES */

interface INoAuthOptions {
	fileHandler?: any,
	httpFetch?: any
}


