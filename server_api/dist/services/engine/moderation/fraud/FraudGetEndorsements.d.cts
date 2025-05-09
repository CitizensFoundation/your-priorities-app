export = FraudGetEndorsements;
declare class FraudGetEndorsements extends FraudGetBase {
    getAllModelItems(model: any, getGroup: any): Promise<any>;
    getAllItems(): Promise<any>;
    getTopItems(items: any, type: any): any[];
}
import FraudGetBase = require("./FraudGetBase.cjs");
