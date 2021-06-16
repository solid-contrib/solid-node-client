import { Session } from "@inrupt/solid-client-authn-node";
import { IAuthSession, IEssSession } from "./IAuthSession";

export class EssAuthSession implements IAuthSession {
  
	session:IEssSession;

  async login(options:IEssLoginOptions) {
    const sess = new Session();
    await sess.login({
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      refreshToken: options.refreshToken,
      oidcIssuer: options.oidcIssuer,
    });
    this.session=sess;
    this.session.isLoggedIn = sess.info.isLoggedIn;
    this.session.webId = sess.info.webId;
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

