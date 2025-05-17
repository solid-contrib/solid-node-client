import SolidFileClient from 'solid-file-client';
import * as $rdf from 'rdflib';
global.$rdf = $rdf;
import {SolidRestFile} from '@solid-rest/file';
import 'readline-sync';

export function localUri(uri){
  if(uri.startsWith('./')){
    uri = 'file://'+process.cwd()+'/'+uri.replace(/^\.\//,'');
  }
  return uri;
}
export const sym = $rdf.sym;

export class SolidNodeClient {

  constructor(){
    this.remoteFetch = fetch;
    const restClient = new SolidRestFile({parser:$rdf});
    const restFetch = restClient.fetch.bind(restClient);
    this.handler = {};
    const self = this;
    this.fetch = async function (uri,options){
      const protocol = (new URL(uri)).protocol;
      if( protocol.match('file') ){
        return await restFetch(uri,options);
      }
      else if( protocol.match(/^http/) )  return await self.remoteFetch(uri,options);
      else if(this.handler[protocol]) return await this.handler[protocol](uri,options);
    }
    this.isLoggedIn = false;
    this.store = $rdf.graph();
    this.fetcher = $rdf.fetcher(this.store,{fetch:this.fetch.bind(this)});
    this.updateManager = new $rdf.UpdateManager(this.store);
  }
  getFileManager(){
     return new SolidFileClient(this);
  }
  addProtocolHandler(handler){
     this.handler[handler.protocol] = handler.fetch;     
  }
  async login(credentials) {
    credentials ||= await this.getCredentials();
    credentials.email ||= credentials.username;
    credentials.provider ||= credentials.idp;
    credentials.webId ||= credentials.webid;
    try {
      const v7 = (await import('css-authn')).v7;
      console.log('Logging in to '+credentials.provider);
      this.remoteFetch = await v7.getAuthenticatedFetch(credentials);
      this.isLoggedIn = true;
      this.idp = credentials.provider;
      this.webid = credentials.webId;
      console.log('Logged in as '+credentials.webId);
    }
    catch(e){ console.log('Could not login ...',e); }
  }
  async get(url,options){
    options ||= {};
    options.METHOD='GET';
    // options.accept ||= "text/turtle";
    return await this.fetch( url, options )
  }
  async head(url){
    return await this.fetch( url, {method:"HEAD"} )
  }
  async exists(url){
    try {
      let res = await this.fetch( url, {method:"HEAD"} );
      return res.ok;
     }
     catch(e){ return false; }
  }
  async put(url,text,ctype){
    ctype = ctype || 'text/turtle';
    try {
      return await this.fetch( url, {method:"PUT",body:text,headers:{"content-type":ctype}} );
    }
    catch(e){console.log('put error ',e);}
  }
  async patch(url, patchContent, patchContentType){
    patchContentType ||= 'text/n3';
    return await this.fetch(url, {
      method: 'PATCH',
      body:patchContent,
      headers:{
        'Content-Type': patchContentType,
        link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
      },
      relative: true
    });
  } 
  async delete(url){
    return await this.fetch( url, {method:"DELETE"} )
  }
  async post(parent,item,content,link){
    return await this.fetch( parent,{
      method:"POST",
      headers:{slug:item,link:link,"content-type":"text/turtle"},
      body:content
    })
  }
  async postFile(parent,file,content){
    let link = '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    return this.post(parent,file,content,link)
  }
  async postFolder(parent,folder){
    let link ='<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
    return this.post(parent,folder,'',link)
  }
  async getCredentials(){
    const e = process.env
    let provider =  e.SOLID_IDP || await this.prompt("idp? ");
    let email =  e.SOLID_USERNAME || await this.prompt("username? ");
    let password = e.SOLID_PASSWORD || await this.prompt("password? ","mute");
    let base = e.SOLID_REMOTE_BASE || await this.prompt("remote base? ");
    let webId = e.SOLID_WEBID || await this.prompt("webID? ");
    return { provider,email, password, base, webId }
  }
  prompt(question,mute) {
    return new Promise(function(resolve, reject) {
      if(mute) resolve( readlineSync.question(question,{hideEchoBack: true}))
      else resolve( readlineSync.question( question ) )
    });
  }
}
