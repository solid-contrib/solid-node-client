import { ILoginOptions } from ".";
import { IAuthSession, INssSession } from "./IAuthSession";
export declare class NssAuthSession implements IAuthSession {
    session: INssSession;
    authFetcher: any;
    login(options?: ILoginOptions): Promise<unknown>;
    _getAuthFetcher(options: ILoginOptions, callback: Function): Promise<any>;
}
