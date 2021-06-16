import { NoAuthSession } from './NoAuthSession';
import { IAuthSession, ISession } from './IAuthSession';
export declare class SolidNodeClient {
    debug?: any;
    handlers?: any;
    parser?: any;
    constructor(options?: IClientOptions);
    fetch(url: string, options: any): Promise<any>;
    login(credentials?: any, protocol?: string): Promise<IAuthSession>;
    getSession(protocol?: string): Promise<ISession>;
    logout(protocol?: string): Promise<void>;
    createServerlessPod(base: string): Promise<any>;
}
export interface ILoginOptions {
    idp?: string;
    username?: string;
    password?: string;
    debug?: boolean;
}
interface IClientOptions {
    handlers?: {
        http?: any;
        file?: NoAuthSession | any;
    };
}
export {};
