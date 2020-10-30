import { customAuthFetcher } from "solid-auth-fetcher";

/**
 *  this is a very slightly modified version of Michiel de Jong's
 *  obtain-auth-headers.ts from solid-crud-tests
 */

let DEBUG = false;

export interface IloginOptions {
  idp? : string,
  username? : string,
  password? : string,
  debug? : boolean,
  rest? : any,
}

export async function getAuthFetcher(options:IloginOptions) {
  const SERVER_ROOT = options.idp;
  const USERNAME = options.username;
  const PASSWORD = options.password;
  DEBUG = options.debug;
  const authFetcher = await customAuthFetcher();
  dlog('POSTing '+ `${SERVER_ROOT}/login/password `+`username=${USERNAME}&password=${PASSWORD}`);
  const serverLoginResult = await authFetcher.fetch(`${SERVER_ROOT}/login/password`, {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: `username=${USERNAME}&password=${PASSWORD}`,
    method: "POST",
    redirect: "manual"
  });
  const cookie = serverLoginResult.headers.get('set-cookie');
  dlog({ cookie });
  const session = await authFetcher.login({
    oidcIssuer: SERVER_ROOT,
    redirect: "https://solid-node-client/redirect"
  });
  dlog('got session');
  let redirectedTo = (session.neededAction as any).redirectUrl;
  do {
    dlog({ redirectedTo });
    const result = await authFetcher.fetch(redirectedTo, {
      headers: { cookie },
      redirect: "manual"
    });
    redirectedTo = result.headers.get("location");
    if (redirectedTo === null) {
      throw new Error('Please add https://solid-node-client as a trusted app!');
    }
  } while(!redirectedTo?.startsWith("https://solid-node-client"));
  dlog('handling '+ redirectedTo);
  await authFetcher.handleRedirect(redirectedTo);
  return authFetcher;
}

// Michiel de Jong comment
// FIXME: This is a total hack, obviously, second-guessing the
// DI architecture of solid-auth-fetcher:
export async function getAuthHeaders(urlStr: string, method: string, authFetcher) {
  return {
    Authorization: JSON.parse(authFetcher.authenticatedFetcher.tokenRefresher.storageUtility.storage.map['solidAuthFetcherUser:global']).accessToken,
    DPop: await authFetcher.authenticatedFetcher.tokenRefresher.tokenRequester.dpopHeaderCreator.createHeaderToken(new URL(urlStr), method)
  };
}

function dlog(...args){
   if( DEBUG ) console.log(args)
}
