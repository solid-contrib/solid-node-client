import { IAuthSession, IEssSession } from "./IAuthSession";
export declare class EssAuthSession implements IAuthSession {
    session: IEssSession;
    login(options: IEssLoginOptions): Promise<IEssSession>;
}
interface IEssLoginOptions {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    oidcIssuer?: string;
}
export {};
