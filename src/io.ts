import { promises, writeFileSync } from "fs";
import { resolve } from "path";
import { type } from "os";
import {
  readKindleClipping,
  parseKindleEntries,
  organizeKindleEntriesByAuthors,
  organizeKindleEntriesByBookTitle,
  KindleEntryParsed
} from "@darylserrano/kindle-clippings";

async function readFile(path: string): Promise<string | Buffer> {
  let fileData = await promises.readFile(path, "UTF-8");
  return fileData;
}

export async function getAllEntriesParsed(
  filePath: string
): Promise<Array<KindleEntryParsed>> {
  let fileData = await readFile(filePath);
  let kindleEntries = readKindleClipping(fileData.toString());
  let kindleEntriesParsed = parseKindleEntries(kindleEntries);
  return kindleEntriesParsed;
}

export async function saveAll(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  filename?: string,
  pretty?: boolean
) {
  await saveToFile(dataToSave, pathToSave, filename, pretty);
}

export async function saveByAuthor(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  pretty?: boolean
) {
  let organizedByAuthors = organizeKindleEntriesByAuthors(dataToSave);
  organizedByAuthors.forEach(async (kindleEntries, authors) => {
    let dataOut = {
      authors: authors,
      entries: kindleEntries
    };
    await saveToFile(dataOut, pathToSave, `${authors}.json`, pretty);
  });
}

export async function saveByBookTitle(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  pretty?: boolean
) {
  let organizedByBookTitle = organizeKindleEntriesByBookTitle(dataToSave);
  organizedByBookTitle.forEach(async (kindleEntries, bookTile) => {
    let dataOut = {
      bookTile: bookTile,
      entries: kindleEntries
    };
    await saveToFile(dataOut, pathToSave, `${bookTile}.json`, pretty);
  });
}

/**
 * Saves the data into a json file
 * @param dataToSave
 * @param pathToSave
 * @param filename
 * @param pretty
 */
async function saveToFile(
  dataToSave: object,
  pathToSave: string,
  filename?: string,
  pretty?: boolean
): Promise<any> {
  let outPath = resolve(pathToSave, filename ? filename : "out.json");

  // Determine os and use sync or promise write
  if (
    type()
      .toLowerCase()
      .includes("win") ||
    type()
      .toLowerCase()
      .includes("windows")
  ) {
    writeFileSync(outPath, JSON.stringify(dataToSave, null, pretty ? 4 : null));
  } else {
    await promises.writeFile(
      outPath,
      JSON.stringify(dataToSave, null, pretty ? 4 : null)
    );
  }
}
