import { ILoginOptions } from ".";
import { IAuthSession, INssSession } from "./IAuthSession";
export declare class NssAuthSession implements IAuthSession {
    session: INssSession;
    authFetcher: any;
    login(options: ILoginOptions, appUrl: string): Promise<unknown>;
    _getAuthFetcher(options: ILoginOptions, appUrl: string, callback: Function): Promise<any>;
}
