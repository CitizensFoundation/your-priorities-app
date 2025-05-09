export = FraudGetPointQualities;
declare class FraudGetPointQualities extends FraudGetBase {
    getAllItems(): Promise<any>;
    getTopItems(items: any, type: any): any[];
}
import FraudGetBase = require("./FraudGetBase.cjs");
