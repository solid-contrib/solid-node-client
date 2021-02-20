/** UNAUTHENTICATED SESSION 
 */

export class NoAuthSession {
  session:any
  fileHandler: any;
  httpFetch: any;
  constructor(options:any={}){
    this.session = {
      isLoggedIn:false,
      info : { isLoggedIn:false },
      fetch : this._fetch.bind(this),
      logout : ()=>{},
    }
    this.fileHandler=options.fileHandler;
    this.httpFetch = options.httpFetch;
  }
  _fetch(url:string,options:any) {
    if( url.startsWith('file') ) return this.fileHandler.fetch(url,options);
    else return this.httpFetch(url,options)
  }
}


