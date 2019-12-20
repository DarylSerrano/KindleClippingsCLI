import { createWriteStream, writeFileSync } from "fs";
import { Buffer } from "buffer";
import * as stream from "stream";
import { resolve } from "path";
import { promisify } from "util";
import { once } from "events";
import { type } from "os";
import {
  organizeKindleEntriesByAuthors,
  organizeKindleEntriesByBookTitle,
  KindleEntryParsed
} from "@darylserrano/kindle-clippings";

const finished = promisify(stream.finished);

function convertKindleEntryToWritableData(
  entry: KindleEntryParsed
): Array<string> {
  /*Author\tBookTitle\tContent\tDateofCreation\tlocation\tpage\ttype\tReading\tMeaning*/
  let writableData: Array<string> = [];
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

export async function saveAll(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string,
  filename?: string
) {
  let data: Array<string> = [];
  for (const entry of dataToSave) {
    let kindleEntryData = convertKindleEntryToWritableData(entry);
    data = data.concat(kindleEntryData);
  }

  await saveToAnkiFile(data, pathToSave, filename);
}

export async function saveByAuthor(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string
) {
  let organizedByAuthors = organizeKindleEntriesByAuthors(dataToSave);
  organizedByAuthors.forEach(async (kindleEntries, authors) => {
    let data: Array<string> = [];
    for (const entry of kindleEntries) {
      let kindleEntryData = convertKindleEntryToWritableData(entry);
      data = data.concat(kindleEntryData);
    }
    await saveToAnkiFile(data, pathToSave, `${authors}.tsv`);
  });
}

export async function saveByBookTitle(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string
) {
  let organizedByBookTitle = organizeKindleEntriesByBookTitle(dataToSave);
  organizedByBookTitle.forEach(async (kindleEntries, bookTile) => {
    let data: Array<string> = [];
    for (const entry of kindleEntries) {
      let kindleEntryData = convertKindleEntryToWritableData(entry);
      data = data.concat(kindleEntryData);
    }
    await saveToAnkiFile(data, pathToSave, `${bookTile}.tsv`);
  });
}

async function saveToAnkiFile(
  data: Array<string>,
  pathToSave: string,
  filename?: string
) {
  let outPath = resolve(pathToSave, filename ? filename : "out.tsv");
  if (
    type()
      .toLowerCase()
      .includes("win") ||
    type()
      .toLowerCase()
      .includes("windows")
  ) {
    let dataString = "".concat(...data);
    writeFileSync(outPath, dataString);
  } else {
    const outWrittable = createWriteStream(outPath);
    data.push("\r\n"); // CRLF
    for (const chunk of data) {
      if (!outWrittable.write(chunk)) {
        await once(outWrittable, "drain");
      }
    }

    outWrittable.end();
    await finished(outWrittable);
  }
}
