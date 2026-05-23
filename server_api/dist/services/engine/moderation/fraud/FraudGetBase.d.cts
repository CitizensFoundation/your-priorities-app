export = FraudGetBase;
declare class FraudGetBase extends FraudBase {
    formatTime(): void;
    setBackgroundColorsFromKey(): void;
    customCompress(): void;
    processAndGetFraudItems(): Promise<any>;
}
import FraudBase = require("./FraudBase.cjs");
