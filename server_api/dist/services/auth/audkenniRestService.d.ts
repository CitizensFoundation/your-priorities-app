export interface AudkenniAuthResponse {
    authId?: string;
    callbacks?: any[];
    tokenId?: string;
    [key: string]: any;
}
export default class AudkenniRestService {
    private endpoint;
    private client;
    start(): Promise<AudkenniAuthResponse>;
    authenticate(phone: string, authenticator: 'sim' | 'app'): Promise<AudkenniAuthResponse>;
    continue(authId: string, callbacks: any[]): Promise<AudkenniAuthResponse>;
    poll(authId: string, callbacks?: any[], interval?: number, maxAttempts?: number): Promise<AudkenniAuthResponse>;
}
