"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = __importStar(require("bunyan"));
const bunyan_prettystream_1 = __importDefault(require("bunyan-prettystream"));
let logger;
if (process.env.USE_BUNYAN_LOGGER && process.env.NODE_ENV !== 'production') {
    const prettyStdOut = new bunyan_prettystream_1.default();
    prettyStdOut.pipe(process.stdout);
    logger = bunyan.createLogger({
        name: 'yrpri',
        streams: [{
                level: 'debug',
                type: 'raw',
                stream: prettyStdOut
            }]
    });
}
else {
    if (process.env.USE_BUNYAN_LOGGER) {
        logger = bunyan.createLogger({ name: "your-priorities" });
    }
    else {
        // If you don't want to use any logger, you can assign 'console' to 'logger'.
        // However, you need to cast it to any as 'console' and 'bunyan' have different types.
        logger = console;
    }
}
exports.default = logger;
