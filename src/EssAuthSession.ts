import { Session } from "@inrupt/solid-client-authn-node";

export class EssAuthSession {
  session:any
  async login(options:any) {
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
// ENDS

