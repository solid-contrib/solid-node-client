import { Session } from "@inrupt/solid-client-authn-node";
export interface IAuthSession {
    session: ISession | Session;
}
export interface ISession {
    isLoggedIn: boolean;
    info: {
        isLoggedIn?: boolean;
        isNss?: boolean;
        webId?: string;
    };
    fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    logout: () => void | Promise<void>;
}
export interface IEssSession extends Session {
    isLoggedIn?: boolean;
    webId?: string;
}
export interface INssSession extends ISession {
    loggedIn?: boolean;
    webId?: string;
}
