export = FraudDeletePointQualities;
declare class FraudDeletePointQualities extends FraudDeleteBase {
    destroyChunkItems(items: any): Promise<any>;
    getItemsById(): Promise<any>;
}
import FraudDeleteBase = require("./FraudDeleteBase.cjs");
