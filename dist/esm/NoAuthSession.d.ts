/** UNAUTHENTICATED SESSION
 */
import { IAuthSession, ISession } from './IAuthSession';
export declare class NoAuthSession implements IAuthSession {
    session: ISession;
    fileHandler: any;
    httpFetch: any;
    createServerlessPod: any;
    constructor(options?: INoAuthOptions);
    _fetch(url: string, options: any): Promise<any>;
}
interface INoAuthOptions {
    fileHandler?: any;
    httpFetch?: any;
}
export {};
