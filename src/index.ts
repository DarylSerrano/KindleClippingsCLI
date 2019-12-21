#!/usr/bin/env node
import yargs from "yargs";
import * as io from "./io";
import * as anki from "./anki";
import ora from "ora";
import { resolve } from "path";

type Organize = "all" | "authors" | "book";
const organizeTypes: ReadonlyArray<Organize> = ["all", "authors", "book"];

interface Arguments {
  [x: string]: unknown;
  inFile: string;
  outDir: string;
  orgType: Organize;
  outFile: string | undefined;
  pretty: boolean;
  anki: boolean;
}

const args: Arguments = yargs
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
  .example(
    'kindle-clippings -i "My Clippings.txt" -d "./clippings"',
    "Parse information into a file in json on the directory ./clippings"
  )
  .epilog(
    "For issue reporting and bugs: https://github.com/DarylSerrano/KindleClippingsCLI/issues"
  ).argv;

async function executeCommand(args: Arguments) {
  const spinner = ora();
  try {
    let entriesParsed = await io.getAllEntriesParsed(args.inFile);

    switch (args.orgType) {
      case "all":
        spinner.start(`Saving data into path: ${resolve(args.outDir)}`);
        if (args.anki) {
          await anki.saveAll(entriesParsed, args.outDir, args.outFile);
        } else {
          await io.saveAll(
            entriesParsed,
            args.outDir,
            args.outFile,
            args.pretty
          );
        }
        break;
      case "authors":
        spinner.start(
          `Saving data by author into path ${resolve(args.outDir)}`
        );
        if (args.anki) {
          await anki.saveByAuthor(entriesParsed, args.outDir);
        } else {
          await io.saveByAuthor(entriesParsed, args.outDir, args.pretty);
        }
        break;
      case "book":
        spinner.start(
          `Saving data by book title into path ${resolve(args.outDir)}`
        );
        if (args.anki) {
          await anki.saveByBookTitle(entriesParsed, args.outDir);
        } else {
          await io.saveByBookTitle(entriesParsed, args.outDir, args.pretty);
        }
        break;
      default:
        console.error(`No valid orgType: ${args}`);
        break;
    }

    process.exit(0);
  } catch (err) {
    console.error(`${err}`);
    // console.error(`${err.stack}`);
    process.exit(1);
  } finally {
    spinner.stop();
  }
}

executeCommand(args);

process.on("uncaughtException", function(err) {
  console.error(`${err}`);
  process.exit(1);
});
