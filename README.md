# Solid-Node-Client                                                            
                                                                               
-- **a nodejs client for Solid** --    

This library uses [solid-auth-fetcher](https://github.com/solid/solid-auth-fetcher) to provide session management and fetching for https: URLs and uses [solid-rest](https://github.com/solid/solid-rest) to provide solid-like fetches on file: and other non-http URLs.  It supports login and authenticated fetches to NSS servers.  Support for login to other servers will be added in the future.
                                                                               
## Synopsis   
**Stand alone usage :**
```javascript               
import { login, logout, fetch } from 'solid-node-client';
async function main(){
    let response = await fetch('https://example.com/publicResource');
    response = await fetch('file:///home/me/someResource');
    let session = await login();
    if( session ) {
        console.log (`logged in as <${session.webId}>`);
        response = await fetch('https://example.com/privateResource');
        logout();
    }    
}
``` 
**Usage with rdflib :**
```javascript
import { login,fetch } from 'solid-node-client';
import * as $rdf from 'rdflib';
async function main(){
    let session = await login();  // may be omitted if you don't need authentication
    let store = $rdf.graph();
    let fetcher = $rdf.fetcher( store, { fetch:fetch } );
    // now all rdflib methods support authenticated http: and local file: requests in nodejs
}
```
## Installation
                                                                               
**1. install the app**
```                                                                            
  download or clone this repo
  cd to install-folder                                                        
  npm install                
```

**2. give the app permission**                                                 

                           
Skip this step if you don't need authenticated access to a pod.  To get authenticated access to a pod, you will need to add "https://solid-node-client" as a trusted app on that pod or the portion of it you want to access. See [how to make an app trusted](https://github.com/solid/userguide#manage-your-trusted-applications) for how to do this.                       
    
## Methods

### login(options)

Logs the user in to a Solid pod and returns an authenticated session.  Credentials for the login may be set as environment variables in your operating system or passed in the options.  

If these variables are part of your environment, you can use the login() method without arguments.

  * **SOLID_IDP** // the server root e.g. https://solidcoummunity.net (no trailing slash)
  * **SOLID_USERNAME** // your username on the server
  * **SOLID_PASSWORD** // your password on the server
  * **SOLID_DEBUG** // set this if you want to output extended login and session debugging

If you don't have those environment variables set or if you wish to override them, you can set them in the arguments to login().
```javascript
   let session = await login({
       idp : "https://yourIdentityProvider",
       username : "yourUsername",
       password : "yourPassword",
       debug : true // or false
   });
```
The session object returned will be a solid-auth-fetcher Session object which has properties loggedIn and webId.  See the solid-auth-fetcher docs for further details if you need them.

### logout()

Logs the user out.  This means that authenticated fetches are no longer possible but you can still use unauthenticated fetches.

### fetch()

This method performs CRUD operations as specified in the [Solid REST spec](https://github.com/solid/solid-spec).  When used with file: URLs, most of the REST spec is followed and, as with http: URLs, the return value is a Response object containing fields such status and statusText and methods such as text(), json(), and headers.get().  See the [solid-rest docs](https://github.com/solid/solid-rest) for details of how file: URLs are handled.

Here's an example :
```javascript
// write a resource
let writeResponse = await fetch( 'https://example.com/file.text', {
  method : "PUT",
  body : "some content to go in the resource",
  headers : { "Content-type" : 'text/plain' }
}
console.log( writeResponse.status  );  // 201
// now read it
let readResponse = await fetch( 'https://example.com/file.text' );
// display its contents
console.log( await response.text()  );
```

### currentSession() 

Returns the current solid-auth-fetcher Session object if the user is logged in or null otherwise.  See the [solid-auth-fetcher documentation](https://github.com/solid/solid-auth-fetcher) for how to use this object.

### currentAuthFetcher()

Returns the current solid-auth-fetcher authFetcher object if the user is logged in or null otherwise.  See the [solid-auth-fetcher documentation](https://github.com/solid/solid-auth-fetcher) on how to use this object.

### setRestHandlers( handlers )

Solid-Rest has a plugin system which allows plugins for almost any storage backend.  By default, it handles file: URLs.  To specify other storage spaces, you can use this method to define a new SolidRest object that includes a plugin for that storage space. See [solid-rest docs](https://github.com/solid/solid-rest) for details.

## Acknowledgements

All of the session management is from Jackson Creed's solid-auth-fetcher.  The login is from Michiel de Jong's solid-crud-tests.

## Copyright and License

copyright © 2020, Jeff Zucker, may be freely distributed with the MIT license
