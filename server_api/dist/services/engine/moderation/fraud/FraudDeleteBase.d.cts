export = FraudDeleteBase;
declare class FraudDeleteBase extends FraudBase {
    postsToRecount: any[];
    pointsToRecount: any[];
    job: any;
    sliceIntoChunks(arr: any, chunkSize: any): any[];
    getItemsById(): Promise<null>;
    destroyChunkItems(chunks: any): Promise<void>;
    getAllItemsExceptOne(items: any): any;
    createAuditLog(): Promise<any>;
    getAllowedSingleDelete(): boolean;
    getMomentInYourPriorities(): number;
    getTopItems(items: any, type: any): any[];
    destroyAllItems(chunks: any): Promise<any>;
    deleteData(): Promise<any>;
    recountPosts(): Promise<any>;
    recountPoints(): Promise<any>;
    recountCommunity(): Promise<any>;
    deleteItems(): Promise<any>;
}
import FraudBase = require("./FraudBase.cjs");
