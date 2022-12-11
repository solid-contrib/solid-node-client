# Solid-Node-Client                                                            
                                                                               
-- **Solid access to Pods, local file systems, and other backends via nodejs**

## New in 2.0.6
* no longer need to specify solid-node-client-authn or solid-auth-fetcher, both are used transparently as needed
* no longer need to separate ESS and NSS logins, both may be done in the same script (e.g. have one client of each)
* login arguments may be specified in environment variables

## Overview

This library provides access to [Solid](https://solidproject.org/) from the command line and from local scripts and apps which either run in the console or in a local browser-based context like electron. It can move resources back and forth between a local commputer and one or more  Pods, carry out remote operations on Pods, and can also treat your local file system, and other backends as a serverless Pod.

## An Example of Stand-Alone Usage
```javascript               
import { SolidNodeClient } from 'solid-node-client';
const client = new SolidNodeClient();

async function readFile(){
  // fetch & display a public resource
  let response = await client.fetch('https://example.com/publicResource');
  console.log(await response.text());
  // login, then fetch & display a private resource
  let session = await client.login(); // see login details below
  if( session.isLoggedIn ) {
    console.log (`logged in as <${session.WebID}>`);
    response = await client.fetch('https://example.com/privateResource');
    console.log(await response.text())
  }    
}
``` 

## Install
```                                                                            
  npm install solid-node-client
```

## <a id="auth">Authenticate and Login</a>

You can skip this section if all you need to do is access public materials or your local file system as a serverless Pod.

Solid-Node-Client supports two types of logins : username/password, and JSON token.  

### Authentication using username/password

The username/password method only works on an Node Solid Server([NSS]()) (such as solidcommunity.net). It is insecure because it sends the password un-encrypted.  However, it's simpler to use and works well for testing and never requires manually requesting a new token as the JSON token method does.  

1. Preparation : add "https://solid-node-client" (or whatever you put as `appUrl` in below) as a trusted app on that Pod or the portion of it you want to access. See [how to make an app trusted](https://github.com/solid/userguide#manage-your-trusted-applications) for how to do this. 

2. In each script :
```javascript               
  import { SolidNodeClient } from 'solid-node-client';
  const client = new SolidNodeClient({
    appUrl : "https://solid-node-client", // Optional, to set your custom app URL
  });
  await client.login({
    idp : "YOUR_IDENTITY_PROVIDER", // e.g. https://solidcommunity.net
    username : "YOUR_USERNAME",
    password : "YOUR_PASSWORD",
  });
  // you can now do authenticated reading & writing on that pod
  // or any pod on an NSS server that your WebID has access to
```

### Authentication using a JSON Token

The JSON token method works on either NSS servers or [ESS]() servers. 

1. Install an app to get tokens
```
  a. Install @inrupt/generate-oidc-token npm i --save 
```
2. Preparation : obtain a token from the server by following these steps
```
  a. Run @inrupt/generate-oidc-token
  b. A script will run in your console, answer its prompts
  c. The script will show a URL, go there in a browser
  d. In the browser, login to your Pod provider and authorize yourself
  e. A JSON snippet with a token and related fields will show in your console
  f. Save the JSON snippet or use directly in login (see step #2 below)
```
2. In each script :
You can now use the token and other information from step #1 to login.
```javascript               
  import { SolidNodeClient } from 'solid-node-client';
  const client = new SolidNodeClient();
  await client.login({
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    refreshToken: "YOUR_REFRESH_TOKEN",
    oidcIssuer: "YOUR_IDENTITY_PROVIDER" // e.g. https://broker.pod.inrumpt.com
  });
  // you can now do authenticated reading & writing on that pod
  // or any pod on any Solid server that your WebID has access to
```

**IMPORTANT** JSON tokens are either rotated or expire, at which point you need to manually get a new one by starting at step 1a above.
 * NSS tokens expire after three weeks
 * ESS tokens expire after thirty minutes

**Notes:** 
 * The JSON token has information unique to you, guard it well!
 * See https://github.com/inrupt/generate-oidc-token, for documentation on tokens

## Grabbing credentials from environment variables
If the following variables are found in the environment, you can call login() with no parameters.
```
Either
  SOLID_USERNAME
  SOLID_PASSWORD
  SOLID_IDP
Or
  SOLID_REFRESH_TOKEN
  SOLID_CLIENT_ID
  SOLID_CLIENT_SECRET
  SOLID_OIDC_ISSUER
```
**CAUTION** Storing these in the environment long-term is a security risk because, if found, they provide access to your private data.


## Using Sessions : login(), getSession()

A session object is returned from both the login() and getSession() methods.  The object will depend on your login status.  If login() was successful, then the session.isLoggedIn will be true and the session.WebID will be the URL of your WebID, otherwise session.isLoggedIn will be false and session.WebID will be undefined.
```javascript
  // login in and read your profile
  let session = await client.login( ... );
  if( session.isLoggedIn ) { await client.fetch(session.WebID); ... }
  // or 
  await client.login( ... );
  // ...
  let session = client.getSession();
  if( session.isLoggedIn ) { await client.fetch(session.WebID); ... }
```
The session object is the underlying object of the authentication package you logged in with : either a solid-auth-fetcher Session object if you use the username/password login, or a solid-client-authn-node Session object if you logged in with a JSON token.  See the documentation for those packages to see what you can do with this object.

## Read and Write : fetch()

This method performs CRUD operations as specified in the [Solid REST spec](https://github.com/solid/solid-spec).  

Fetch can be used for public and local file system resources at any time and for services requiring authentciation after login.

When used with serverless Pods, most of the REST spec is followed and, as with https: URLs, the return value is a Response object containing fields such status and statusText and methods such as text(), json(), and headers.get().  See the [solid-rest docs](https://github.com/solid/solid-rest) for details of how file: URLs are handled.

Here's an example :
```javascript
// write a resource
let writeResponse = await client.fetch( 'https://example.com/file.txt', {
  method : "PUT",
  body : "some content to go in the resource",
  headers : { "Content-type" : 'text/plain' }
}
console.log( writeResponse.status  );  // 201
// now read it
let readResponse = await client.fetch( 'https://example.com/file.txt' );
// display its contents
console.log( await readResponse.text()  );
```

## logout()

Logs the user out.  This means that authenticated fetches are no longer possible but you can still use unauthenticated fetches.  If no protocol parameters are used, https is assummed.
```javascript
   await client.logout()          // log out from an https Pod server
   await client.logout('dropbox') // log out of Dropbox account
```


## Note about Patch

PATCH is supported by default on server-based Pods.  For serverless Pods your script needs to import rdflib and set a global $rdf variable *before* creating the client, like this :
```javascript
import {SolidNodeClient} from 'solid-node-client';
import * as $rdf from 'rdflib';
global.$rdf = $rdf;
const client = new SolidNodeClient();
// client.fetch() now supports PATCH on file: URLs and all solid-rest backends
```

## <a name="multiple">Multiple Identities</a>

It is now possible to login multiple times from the same script.  You can create clients authorized for several different identities.
```javascript
  const client_1 = new SolidNodeClient();
  const client_2 = new SolidNodeClient();
  const client_3 = new SolidNodeClient();
  await client_1.login( siteA_credentials);
  await client_2.login( siteB_credentials);
  // now client_1 is authenticated at siteA;
  //     client_2 is authenticated at siteB;
  //     client_3 is unauthenticated
}
```

## <a name="Pod">Creating a serverless Pod</a>

Solid-Node-Client, when using solid-rest-* plugins for file: and other protocls, can treat the backend as a serverless Pod. This means that requests to the backend will respond the way a Pod does - reading a directory returns a turtle representation of the directory, writing a file creates its parent directories if they don't exist, headers are sent for wac-allow, content-type, etc.  This all means that core Solid libraries and apps such as rdlib, mashlib, the databrowser can address the serverless Pod the same way they would a server-based Pod.  The one exception is ACL files.  These are returned in link headers and read and written as on a server-based Pod.  However, they do not control access to resources, that is done with file system checks (e.g. *nix read/write permissions).

Solid Node Client can access the local file system using file:// URLs without using a server.  In most respects, it will treat the file system as a Pod.  To get the full benefit of this, it's best to create some local files such as a profile, a preferences file, and type indexes. You can create them manually or copy them from a remote Pod, but the easiest thing to do is use the built-in createServerlessPod method.
```javascript
import {SolidNodeClient} from 'solid-node-client';
const client = new SolidNodeClient();
client.createServerlessPod('file:///home/jeff/myPod/');
```
The code above will create a profile, preferences and other key Pod resources in the named folder. Your profile will be located at '/home/jeff/myPod/profile/card' and your preferences file will be located at '/home/jeff/myPod/settings/prefs.ttl'.  You can now use a file:// URL to refer to your local WebID: <file:///home/jeff/myPod/profile/card#me>.  As with a server-based Pod, this WebID is the starting point for any app that wants to follow its nose through your local file system.

## <a name="frontends">Using Solid-Node-Client with other Libraries</a>

### Using with rdflib
To use Solid-Node-Client with rdflib, just import it and bind its fetch to rdflib's fetcher as shown below.  Do that once at the top of your script and thereafter all fetches from rdflib methods such as load, putBack, webOperations, updateManager, etc. can be used against any Solid-Node-Client backends.  If you also login, you can use it to access private resources on remote Pods.
```javascript
/* Use Solid-Node-Client and rdflib to read the contents of a local folder 
*/
import {SolidNodeClient} from '../';
import * as $rdf from 'rdflib';

const client = new SolidNodeClient();
const store = $rdf.graph();
const fetcher = $rdf.fetcher(store,{fetch:client.fetch.bind(client)});

const localFolder = $rdf.sym(`file://${process.cwd()}/`);
const contains = $rdf.sym(`http://www.w3.org/ns/ldp#contains`);

async function main(){
  await fetcher.load( localFolder );  // unauthenticated local fetch
  store.match( folder, contains ).filter( (stmt)=>{
    console.log( stmt.object.value )
  });
  let session = await client.login( myLoginProfile );
  if( session.isLoggedIn ) {
    await fetcher.load( somePrivateURL ); // authenticated fetch
  }
}
main();
```
### Using with Solid-File-Client
```javascript
/* Log in,  then copy a private file from your pod to local file system
*/
import {SolidNodeClient} from 'solid-node-client';
import SolidFileClient from 'solid-file-client';
const auth = new SolidNodeClient();
const fileClient = new SolidFileClient(auth);

// Put your own functions for retrieving credentials here
import {credentials} from '/home/jeff/.solid-identities.js';
const loginSettings = credentials.solidCommunity;

// Set paths to your files here
const remoteUrl = `https://jeff-zucker.solidcommunity.net/private/hidden.html`;
const localUrl =  `file://${process.cwd()}/test.html`;

async function main(){
  let session = await auth.login( loginSettings );
  if( session.isLoggedIn ){
     console.log(`Logged in as <${session.WdbID}>`);
     let content = await fileClient.readFile( remoteUrl );
     let res=await fileClient.createFile( localUrl, content,'text/turtle');
  }
}
main();
```
## Solid-Node-Client is based on a plugin system.

* **pluggable authentication** - To access private Pod data, you can plugin Inrupt's solid-client-authn-node, solid-auth-fetcher, or any other authentication packages with a similar API. See [authentication](#auth).

* **pluggable backends** By default the backend may be a local server-based Pod, a remote server-based Pod, or a file system treated as a serverless Pod. Serverless Pods for Dropbox, SSH, and BrowserFS are in development.

* **pluggable frontends** Solid-node-client may be used stand-alone or in conjunction with other libraries such as rdflib, solid-file-client and others. See [using alternate frontends](#frontends).
                                                                               

## Acknowledgements

Many thanks to Michiel de Jong, Alain Bourgeois, CxRes, Otto_A_A, Kriogenia for their contributions.

## Copyright and License

copyright © 2020, Jeff Zucker, may be freely distributed with the MIT license
