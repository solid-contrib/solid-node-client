/** UNAUTHENTICATED SESSION 
 */

export class NoAuthSession {
  session:any
  fileHandler: any;
  httpFetch: any;
  createServerlessPod:any;
  constructor(options:any={}){
    this.fileHandler=options.fileHandler;
    this.httpFetch = options.httpFetch;
    this.createServerlessPod = this.fileHandler.createServerlessPod.bind(this.fileHandler);
    this.session = {
      isLoggedIn:false,
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


