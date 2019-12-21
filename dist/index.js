#!/usr/bin/env node
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const io = __importStar(require("./io"));
const anki = __importStar(require("./anki"));
const ora_1 = __importDefault(require("ora"));
const path_1 = require("path");
const organizeTypes = ["all", "authors", "book"];
const args = yargs_1.default
    .options({
    inFile: {
        type: "string",
        demandOption: true,
        alias: "i",
        describe: "'My Clippings.txt' file from a Kindle"
    },
    outDir: { type: "string", alias: "d", default: "./" },
    outFile: {
        type: "string",
        alias: "f",
        describe: "Out filename, only works if using organize type 'all'"
    },
    orgType: {
        choices: organizeTypes,
        alias: "org",
        default: organizeTypes[0]
    },
    pretty: {
        type: "boolean",
        alias: "p",
        default: false,
        describe: "Prints the output json in a readable format"
    },
    anki: {
        type: "boolean",
        alias: "a",
        default: false,
        describe: "Export data into anki deck"
    }
})
    .usage("Usage: $0  [options]")
    .example('kindle-clippings -i "My Clippings.txt" -d "./clippings"', "Parse information into a file in json on the directory ./clippings")
    .epilog("For issue reporting and bugs: https://github.com/DarylSerrano/KindleClippingsCLI/issues").argv;
function executeCommand(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = ora_1.default();
        try {
            let entriesParsed = yield io.getAllEntriesParsed(args.inFile);
            switch (args.orgType) {
                case "all":
                    spinner.start(`Saving data into path: ${path_1.resolve(args.outDir)}`);
                    if (args.anki) {
                        yield anki.saveAll(entriesParsed, args.outDir, args.outFile);
                    }
                    else {
                        yield io.saveAll(entriesParsed, args.outDir, args.outFile, args.pretty);
                    }
                    break;
                case "authors":
                    spinner.start(`Saving data by author into path ${path_1.resolve(args.outDir)}`);
                    if (args.anki) {
                        yield anki.saveByAuthor(entriesParsed, args.outDir);
                    }
                    else {
                        yield io.saveByAuthor(entriesParsed, args.outDir, args.pretty);
                    }
                    break;
                case "book":
                    spinner.start(`Saving data by book title into path ${path_1.resolve(args.outDir)}`);
                    if (args.anki) {
                        yield anki.saveByBookTitle(entriesParsed, args.outDir);
                    }
                    else {
                        yield io.saveByBookTitle(entriesParsed, args.outDir, args.pretty);
                    }
                    break;
                default:
                    console.error(`No valid orgType: ${args}`);
                    break;
            }
            process.exit(0);
        }
        catch (err) {
            console.error(`${err}`);
            // console.error(`${err.stack}`);
            process.exit(1);
        }
        finally {
            spinner.stop();
        }
    });
}
executeCommand(args);
process.on("uncaughtException", function (err) {
    console.error(`${err}`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map