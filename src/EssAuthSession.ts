import { Session } from "@inrupt/solid-client-authn-node";
import { IAuthSession, IEssSession } from "./IAuthSession";

export class EssAuthSession implements IAuthSession {
  
	session:IEssSession;

  async login(options:IEssLoginOptions) {
    const sess = new Session();
    await sess.login({
      clientId: options.clientId || process.env.SOLID_CLIENT_ID,
      clientSecret: options.clientSecret || process.env.SOLID_CLIENT_SECRET,
      refreshToken: options.refreshToken || process.env.SOLID_REFRESH_TOKEN,
      oidcIssuer: options.oidcIssuer || process.env.SOLID_OIDC_ISSUER,
    });
    this.session=sess;
    this.session.isLoggedIn = sess.info.isLoggedIn;
    this.session.webId = this.session.WebID = sess.info.webId;
    return this.session;
  }
}

/* INTERFACES */

interface IEssLoginOptions {
	clientId?:string;
	clientSecret?:string;
	refreshToken?:string;
	oidcIssuer?:string;
}

