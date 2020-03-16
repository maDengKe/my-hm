"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Exception extends Error {
    constructor(statusCode, message) {
        super(message);
        this._statusCode = statusCode;
    }
    get statusCode() {
        return this._statusCode;
    }
    toObject() {
        return {
            statusCode: this._statusCode,
            message: this.message
        };
    }
}
exports.default = Exception;
//# sourceMappingURL=exception.js.map