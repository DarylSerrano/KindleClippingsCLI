"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Foreach async/await version
 * @param array
 * @param callback
 */
function asyncForEach(map, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const entry of map.entries()) {
            yield callback(entry[1], entry[0], map);
        }
    });
}
exports.asyncForEach = asyncForEach;
//# sourceMappingURL=utils.js.map