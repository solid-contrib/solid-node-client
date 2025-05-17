# Solid-Node-Client                                                            
                                                                               
-- **Solid access to Pods, local file systems, and other backends via nodejs**

## Overview

This library provides access to [Solid](https://solidproject.org/) resources from the command line and from local scripts and apps which either run in the console or in a local browser-based context like electron. It can move resources back and forth between a local commputer and one or more Pods, carry out remote operations on Pods, and can also treat your local file system, and other backends as a serverless Pod. Currently it works with CSS, Pivot, NSS, and file-systems.

The library provides methods to login and perform simple Solid rest methods (get,put,patch,etc.).  It is more powerful when used with the file manager and rdflib methods shown below.  In addition to using this library in your own app, [Solid-shell](https://github.com/jeff-zucker/solid-shell) is a stand-alone app which provides interfaces for using the library's functions from the command-line, from batch scripts, or from an interactive shell.

## Working with Local files

This library treats local files as if they were being served from a Pod.  A client.get() call on a local folder returns a turtle representation of its contents. A client.put call creates intermediate folders if they don't exist.  Copying and deleting transparently handle auxilliary files: if you delete foo.tll, then foo.ttl.meta and foo.ttl.acl will also be deleted if they exist.  Local files return headers such as link, wac-allow, and content-type the same as any Solid server.  WAC headers are returned based on local file system permissions.  For example, if the user operating the script does not have unix permissions to a given resource, the WAC will show that the user does not have read or write permissions.  This all means that Solid-Node-Client can be used as the auth/fetcher for almost any Solid app which supports a plugin fetch method, supporting use of the apps without a serverl and even without internet.

A convience method `localURI()` is provided to handle relative local file paths. This method accepts a local relative URI and makes it a full file URI suitable for use with linked data. For example, if you are running a script on your local computer in `/home/foo/`, then `localUri('./bar.ttl')` will be equal to `file:///home/foo/bar.ttl`.

## Using the FileManager

Solid-node-client makes available a file manager that provides Solid protocol access to the local file system and to remote private Pod resources.  It includes simple methods such as `readFile` as well as methods to copy and delete entire container trees, to zip files, to move files between Pods or between a Pod and the local file system. The file manager is an instance of [Solid-File-Client](https://github.com/jeff-zucker/solid-file-client). See its documentation for details of available file management methods.  

```javascript
/* Log in,  then copy a private file from your Pod to local file system
*/
import {SolidNodeClient,localUri} from 'solid-node-client';
const client = new SolidNodeClient();
const fileManager = client.getFileManager();

let remotePrivateThing = 'https://jeff-zucker.solidcommunity.net/settings/privateTypeIndex.ttl';
let localLocation = localUri('./test.ttl');

async function test(){
  await client.login();
  let response = await fileManager.copy( remotePrivateThing, localLocation );
  console.log(response.status,response.statusText);
}
test();
```

### Using with rdflib

Solid-node-client provides the following methods which augment rdflib with a fetch that can access private Pod resources and the local file system.

* `client.fetcher` - an instance of rdflib's fetcher with the augmented fetch
* `client.store` - an instance of rdflib's store used with the augmented fetcher
* `client.updateManager` - an instance of rdflib's updateManager with the augmented fetcher
* `sym` - an instance of rdflib's sym method

Note: rdflib, by itself, will fail for local file system fetches. You must use the provided fetcher and store to access local files. Here's an example:

```javascript
/* Use Solid-Node-Client and rdflib to read the contents of a local folder 
*/
import {SolidNodeClient,sym,localUri} from 'solid-node-client';
const client = new SolidNodeClient();

const localFolder = sym( localUri('./') );
const contains = sym(`http://www.w3.org/ns/ldp#contains`);

(async()=>{
  await client.fetcher.load( localFolder );
  client.store.each( localFolder, contains ).filter( (resource)=>{
    console.log( resource.uri )
  });
})();
```

All methods for rdflib's store, fetcher, and updateManager are supported, see [rdflib](https://github.com/linkeddata/rdflib.js) for details

## Using the simple REST methods

Solid-node-client has a number of methods supporting REST access to Solid resources. 

* `client.put(uri,content,content-type)`  // create a resource
* `client.get(uri,options)`               // read a resource
* `client.patch(uri,content,patchtype)`   // update a resource using either text/n3 or application/SPARQL
* `client.delete(uri)`                    // delete a resource

Additionally, there are methods for head, postFile, postFolder.  All of these should work identically on local serverless files as well as server-based resources. See [CRUD test](./tests/snc-crud.js) for examples.

## Installing
```                                                                            
  npm install solid-node-client
```

## <a id="auth">Logging In</a>

If you only want to access your local files or remote public files, you do not need to login. To access private files protected by Solid's access system, you need to login before fetching.

Login can explicitly state your credentials :

```javascript
await client.login({
       idp: your identity provider,
  username: your username,           // see below
  password: your password,
     webid: your WebID
});
```
Or, you may put your credentials in environment variables and call login() with no parameters.

Use these environment variables
```
       SOLID_IDP = your identity provider
  SOLID_USERNAME = your username
  SOLID_PASSWORD = your password
     SOLID_WEBID = your WebID
```

If the environment variables are set, you can login without parameters.
```javascript
  await client.login();
```

**Note** : On Pivot servers such as solidcommunity.net, your username is actually an email address, usually something similar to you@users.css.pod.  If you don't know which email, login to the server with a browser and choose "Edit Account" on the first login screen and your email/username will be listed.

### Getting session information

The following variables are potentially avalable:

* `client.isLoggedIn` - boolean value showing login state
* `client.webid` - the current WebID (only available once logged in)
* `client.idp` - the current identity provider (only available once logged in)

For example :
```javascript
  await client.login();
  if(client.isLoggedIn){
    console.log('logged in as ' + client.webid)
    ...
  }
```

## New in 3.0.0
The authenticated fetch is now provided by https://github.com/mrkvon/css-authn.  The session object is now subsumed into the client object (e.g. session.isLoggedIn is now client.isLoggedIn)

## Acknowledgements

Many thanks to Michiel de Jong, Alain Bourgeois, CxRes, Otto_A_A, Michal S, Kriogenia for their contributions.

## Copyright and License

copyright © 2020, 2025, Jeff Zucker, may be freely distributed with the MIT license
