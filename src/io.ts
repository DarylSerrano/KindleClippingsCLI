import { promises } from "fs";
import { resolve } from "path";
import {
  readKindleClipping,
  parseKindleEntries,
  organizeKindleEntriesByAuthors,
  organizeKindleEntriesByBookTitle,
  KindleEntryParsed
} from "@darylserrano/kindle-clippings";
import { asyncForEach } from "./utils";

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
  return await saveToFile(dataToSave, pathToSave, filename, pretty);
}

export async function saveByAuthor(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  pretty?: boolean
): Promise<string> {
  let organizedByAuthors = organizeKindleEntriesByAuthors(dataToSave);

  await asyncForEach(organizedByAuthors, async (kindleEntries, authors) => {
    let dataOut = {
      authors: authors,
      entries: kindleEntries
    };
    await saveToFile(dataOut, pathToSave, `${authors}.json`, pretty);
  });

  return pathToSave;
}

export async function saveByBookTitle(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  pretty?: boolean
) {
  let organizedByBookTitle = organizeKindleEntriesByBookTitle(dataToSave);
  await asyncForEach(organizedByBookTitle, async (kindleEntries, bookTile) => {
    let dataOut = {
      bookTile: bookTile,
      entries: kindleEntries
    };
    await saveToFile(dataOut, pathToSave, `${bookTile}.json`, pretty);
  });
  return pathToSave;
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
): Promise<string> {
  let outPath = resolve(pathToSave, filename ? filename : "out.json");

  await promises.writeFile(
    outPath,
    JSON.stringify(dataToSave, null, pretty ? 4 : null)
  );
  return pathToSave;
}
