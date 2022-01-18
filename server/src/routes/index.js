"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
module.exports = (instance) => {
    fs_1.default.readdirSync(__dirname + '/api/').forEach((file) => {
        require(`./api/${file.substring(0, file.indexOf('.'))}`)(instance);
    });
};
//# sourceMappingURL=index.js.map