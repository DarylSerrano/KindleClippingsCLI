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
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const kindle_clippings_1 = require("@darylserrano/kindle-clippings");
function readFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileData = yield fs_1.promises.readFile(path, "UTF-8");
        return fileData;
    });
}
function getAllEntriesParsed(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let fileData = yield readFile(filePath);
        let kindleEntries = kindle_clippings_1.readKindleClipping(fileData.toString());
        let kindleEntriesParsed = kindle_clippings_1.parseKindleEntries(kindleEntries);
        return kindleEntriesParsed;
    });
}
exports.getAllEntriesParsed = getAllEntriesParsed;
function saveAll(dataToSave, pathToSave, filename, pretty) {
    return __awaiter(this, void 0, void 0, function* () {
        yield saveToFile(dataToSave, pathToSave, filename, pretty);
    });
}
exports.saveAll = saveAll;
function saveByAuthor(dataToSave, pathToSave, pretty) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByAuthors = kindle_clippings_1.organizeKindleEntriesByAuthors(dataToSave);
        organizedByAuthors.forEach((kindleEntries, authors) => __awaiter(this, void 0, void 0, function* () {
            let dataOut = {
                authors: authors,
                entries: kindleEntries
            };
            yield saveToFile(dataOut, pathToSave, `${authors}.json`, pretty);
        }));
    });
}
exports.saveByAuthor = saveByAuthor;
function saveByBookTitle(dataToSave, pathToSave, pretty) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByBookTitle = kindle_clippings_1.organizeKindleEntriesByBookTitle(dataToSave);
        organizedByBookTitle.forEach((kindleEntries, bookTile) => __awaiter(this, void 0, void 0, function* () {
            let dataOut = {
                bookTile: bookTile,
                entries: kindleEntries
            };
            yield saveToFile(dataOut, pathToSave, `${bookTile}.json`, pretty);
        }));
    });
}
exports.saveByBookTitle = saveByBookTitle;
/**
 * Saves the data into a json file
 * @param dataToSave
 * @param pathToSave
 * @param filename
 * @param pretty
 */
function saveToFile(dataToSave, pathToSave, filename, pretty) {
    return __awaiter(this, void 0, void 0, function* () {
        let outPath = path_1.resolve(pathToSave, filename ? filename : "out.json");
        // Determine os and use sync or promise write
        if (os_1.type()
            .toLowerCase()
            .includes("win") ||
            os_1.type()
                .toLowerCase()
                .includes("windows")) {
            fs_1.writeFileSync(outPath, JSON.stringify(dataToSave, null, pretty ? 4 : null));
        }
        else {
            yield fs_1.promises.writeFile(outPath, JSON.stringify(dataToSave, null, pretty ? 4 : null));
        }
    });
}
//# sourceMappingURL=io.js.map