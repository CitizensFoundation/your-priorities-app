export = FraudGetBase;
declare class FraudGetBase extends FraudBase {
    formatTime(): void;
    setBackgroundColorsFromKey(): void;
    getUserEmail(item: any): any;
    getUserName(item: any): any;
    getPostName(item: any): any;
    getPointQualityPostName(item: any): any;
    getItemName(item: any): any;
    customCompress(): void;
    processAndGetFraudItems(): Promise<any>;
}
import FraudBase = require("./FraudBase.cjs");
