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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const kindle_clippings_1 = require("@darylserrano/kindle-clippings");
const csv_stringify_1 = __importDefault(require("csv-stringify"));
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
        return yield saveToAnkiFile(dataToSave, pathToSave, filename);
    });
}
exports.saveAll = saveAll;
function saveByAuthor(dataToSave, pathToSave) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByAuthors = kindle_clippings_1.organizeKindleEntriesByAuthors(dataToSave);
        organizedByAuthors.forEach((kindleEntries, authors) => __awaiter(this, void 0, void 0, function* () {
            yield saveToAnkiFile(kindleEntries, pathToSave, `${authors}.tsv`);
        }));
        return pathToSave;
    });
}
exports.saveByAuthor = saveByAuthor;
function saveByBookTitle(dataToSave, pathToSave) {
    return __awaiter(this, void 0, void 0, function* () {
        let organizedByBookTitle = kindle_clippings_1.organizeKindleEntriesByBookTitle(dataToSave);
        organizedByBookTitle.forEach((kindleEntries, bookTile) => __awaiter(this, void 0, void 0, function* () {
            yield saveToAnkiFile(kindleEntries, pathToSave, `${bookTile}.tsv`);
        }));
        return pathToSave;
    });
}
exports.saveByBookTitle = saveByBookTitle;
function saveToAnkiFile(data, pathToSave, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let outPath = path_1.default.resolve(pathToSave, filename ? filename : "out.tsv");
        let ankiDeckData = data.map((kindleEntry) => {
            return kindleEntry.toJSON();
        });
        return new Promise((resolve, reject) => {
            const outStream = fs_1.default.createWriteStream(outPath, {
                flags: "w"
            });
            let dataStream = csv_stringify_1.default(ankiDeckData, {
                delimiter: "\t",
                columns: ["authors", "bookTile", "page", "location", "dateOfCreation", "content", "type"],
                header: false,
                cast: {
                    string: function (value) {
                        return value.toString().replace(/"/g, "'");
                    }
                }
            });
            outStream.on("error", function (err) {
                reject(err);
            });
            outStream.on("finish", function () {
                resolve(outPath);
            });
            dataStream.on("error", function (err) {
                reject(err);
            });
            dataStream.pipe(outStream);
        });
    });
}
//# sourceMappingURL=anki.js.map