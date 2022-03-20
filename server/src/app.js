"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const pg_1 = __importDefault(require("pg"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
if (!process.env.DB_USER)
    throw new Error('DB_USER environment variable is not set');
if (!process.env.DB_NAME)
    throw new Error('DB_NAME environment variable is not set');
if (!process.env.DB_PASSWORD)
    throw new Error('DB_PASSWORD environment variable is not set');
if (!process.env.DB_HOST)
    throw new Error('DB_PASSWORD environment variable is not set');
if (!process.env.DB_PORT)
    throw new Error('DB_PORT environment variable is not set');
if (!process.env.WS_PORT)
    throw new Error('WS_PORT environment variable is not set');
if (!process.env.EMAIL)
    throw new Error('EMAIL environment variable is not set');
if (!process.env.EMAIL_PASSWORD)
    throw new Error('EMAIL environment variable is not set');
if (!process.env.EMAIL_DESTINATION)
    throw new Error('EMAIL_DESTINATION environment variable is not set');
if (!process.env.AUTH_WAIT_TIME)
    throw new Error('AUTH_WAIT_TIME environment variable is not set');
if (!process.env.AUTH_VALID_TIME)
    throw new Error('AUTH_VALID_TIME environment variable is not set');
const pool = new pg_1.default.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT)
});
try {
    require('./helpers/backup').initBackup();
}
catch (err) {
    console.log(err);
}
require('./routes')({ app, pool });
app.listen(process.env.WS_PORT, () => {
    console.log("Server started on port " + process.env.WS_PORT);
});
//# sourceMappingURL=app.js.map