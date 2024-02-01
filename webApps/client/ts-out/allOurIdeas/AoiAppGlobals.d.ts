import { YpAppGlobals } from '../yp-app/YpAppGlobals.js';
import { AoiServerApi } from './survey/AoiServerApi.js';
export declare class AoiAppGlobals extends YpAppGlobals {
    originalQueryParameters: any;
    originalReferrer: string;
    questionId: number;
    earlId: number;
    promptId: number;
    disableParentConstruction: boolean;
    exernalGoalParamsWhiteList: string | undefined;
    externalGoalTriggerUrl: string | undefined;
    constructor(serverApi: AoiServerApi);
    setIds: (e: CustomEvent) => void;
    parseQueryString: () => void;
    getSessionFromCookie: () => string;
    getOriginalQueryString(): string | null;
    activity: (type: string, object?: any | undefined) => void;
}
//# sourceMappingURL=AoiAppGlobals.d.ts.map