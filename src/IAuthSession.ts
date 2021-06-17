import { Session } from "@inrupt/solid-client-authn-node";

export interface IAuthSession {
	session: ISession | Session
}

export interface ISession {
	isLoggedIn: boolean,
	info : { 
		isLoggedIn?: boolean,
		webId?: string
	},
	fetch : (url: RequestInfo, init?: RequestInit) => Promise<Response>,
	logout : () => void | Promise<void>,
}

export interface IEssSession extends Session {
	isLoggedIn?: boolean,
	webId?: string,
	WebID?: string
}

export interface INssSession extends ISession {
	loggedIn?: boolean,
	webId?: string,
	WebID?: string
}