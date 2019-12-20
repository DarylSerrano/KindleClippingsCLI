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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const stream = __importStar(require("stream"));
const path_1 = require("path");
const util_1 = require("util");
const events_1 = require("events");
const os_1 = require("os");
const kindle_clippings_1 = require("@darylserrano/kindle-clippings");
const finished = util_1.promisify(stream.finished);
function convertKindleEntryToWritableData(entry) {
    /*Author\tBookTitle\tContent\tDateofCreation\tlocation\tpage\ttype\tReading\tMeaning*/
    let writableData = [];
    writableData.push(entry.authors);
    writableData.push("\t");
    writableData.push(entry.bookTile);
    writableData.push("\t");
    writableData.push(entry.content);
    writableData.push("\t");
    writableData.push(entry.dateOfCreation);
    writableData.push("\t");
    writableData.push(entry.location);
    writableData.push("\t");
    writableData.push(entry.page.toString());
    writableData.push("\t");
    writableData.push(entry.type);
    writableData.push("\n");
    return writableData;
}
// function convertTagsToWritableData(entry: KindleEntryParsed): Array<string> {
//   let writableData: Array<string>;
//   writableData.push("tags:");
//   writableData.push(
//     `${entry.authors}\t${entry.bookTile}`
//   );
//   writableData.push("\n");
//   return writableData;
// }
function saveAll(dataToSave, pathToSave, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        for (const entry of dataToSave) {
            let kindleEntryData = convertKindleEntryToWritableData(entry);
            data = data.concat(kindleEntryData);
        }
        yield saveToAnkiFile(data, pathToSave, filename);
    });
}
exports.saveAll = saveAll;
function saveByAuthor(dataToSave, pathToSave) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByAuthors = kindle_clippings_1.organizeKindleEntriesByAuthors(dataToSave);
        organizedByAuthors.forEach((kindleEntries, authors) => __awaiter(this, void 0, void 0, function* () {
            let data = [];
            for (const entry of kindleEntries) {
                let kindleEntryData = convertKindleEntryToWritableData(entry);
                data = data.concat(kindleEntryData);
            }
            yield saveToAnkiFile(data, pathToSave, `${authors}.tsv`);
        }));
    });
}
exports.saveByAuthor = saveByAuthor;
function saveByBookTitle(dataToSave, pathToSave) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByBookTitle = kindle_clippings_1.organizeKindleEntriesByBookTitle(dataToSave);
        organizedByBookTitle.forEach((kindleEntries, bookTile) => __awaiter(this, void 0, void 0, function* () {
            let data = [];
            for (const entry of kindleEntries) {
                let kindleEntryData = convertKindleEntryToWritableData(entry);
                data = data.concat(kindleEntryData);
            }
            yield saveToAnkiFile(data, pathToSave, `${bookTile}.tsv`);
        }));
    });
}
exports.saveByBookTitle = saveByBookTitle;
function saveToAnkiFile(data, pathToSave, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let outPath = path_1.resolve(pathToSave, filename ? filename : "out.tsv");
        if (os_1.type()
            .toLowerCase()
            .includes("win") ||
            os_1.type()
                .toLowerCase()
                .includes("windows")) {
            let dataString = "".concat(...data);
            fs_1.writeFileSync(outPath, dataString);
        }
        else {
            const outWrittable = fs_1.createWriteStream(outPath);
            data.push("\r\n"); // CRLF
            for (const chunk of data) {
                if (!outWrittable.write(chunk)) {
                    yield events_1.once(outWrittable, "drain");
                }
            }
            outWrittable.end();
            yield finished(outWrittable);
        }
    });
}
//# sourceMappingURL=anki.js.map