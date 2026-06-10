export = FraudDeleteBase;
declare class FraudDeleteBase extends FraudBase {
    postsToRecount: any[];
    pointsToRecount: any[];
    deletedItemIds: any[];
    job: any;
    sliceIntoChunks(arr: any, chunkSize: any): any[];
    getItemsById(): Promise<null>;
    destroyChunkItems(chunks: any): Promise<void>;
    getUserEmail(item: any): any;
    getAllItemsExceptOne(items: any): any;
    createAuditLog(transaction: any): Promise<any>;
    getAllowedSingleDelete(): boolean;
    getMomentInYourPriorities(): number;
    getTopItems(items: any, type: any): any[];
    destroyAllItems(chunks: any, transaction: any): Promise<any>;
    deleteData(transaction: any): Promise<any>;
    recountPosts(transaction: any): Promise<any>;
    recountPoints(transaction: any): Promise<any>;
    recountCommunity(transaction: any): Promise<any>;
    deleteItems(): Promise<any>;
}
import FraudBase = require("./FraudBase.cjs");
