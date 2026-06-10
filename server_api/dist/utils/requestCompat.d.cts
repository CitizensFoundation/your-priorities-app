declare function _exports(input: any, callback: any): PassThrough | null;
declare namespace _exports {
    function defaults(overrides?: {}): {
        (input: any, callback: any): PassThrough | null;
        defaults(overrides?: {}): /*elided*/ any;
    };
}
export = _exports;
import { PassThrough } from "stream";
