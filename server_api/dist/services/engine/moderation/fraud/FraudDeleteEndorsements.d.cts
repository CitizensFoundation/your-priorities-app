export = FraudDeleteEndorsements;
declare class FraudDeleteEndorsements extends FraudDeleteBase {
    destroyChunkItemsByModel(model: any, items: any, transaction: any): Promise<any>;
    destroyChunkItems(items: any, transaction: any): Promise<any>;
    getModelItemsById(model: any, getGroup: any): Promise<any>;
    getItemsById(): Promise<any>;
}
import FraudDeleteBase = require("./FraudDeleteBase.cjs");
