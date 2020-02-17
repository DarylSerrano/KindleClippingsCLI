import fs from "fs";
import path from "path";
import {
  organizeKindleEntriesByAuthors,
  organizeKindleEntriesByBookTitle,
  KindleEntryParsed
} from "@darylserrano/kindle-clippings";
import stringify from "csv-stringify";

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
  return await saveToAnkiFile(dataToSave, pathToSave, filename);
}

export async function saveByAuthor(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string
) {
  let organizedByAuthors = organizeKindleEntriesByAuthors(dataToSave);
  organizedByAuthors.forEach(async (kindleEntries, authors) => {
    await saveToAnkiFile(kindleEntries, pathToSave, `${authors}.tsv`);
  });

  return pathToSave;
}

export async function saveByBookTitle(
  dataToSave: Array<KindleEntryParsed>,
  pathToSave: string
) {
  let organizedByBookTitle = organizeKindleEntriesByBookTitle(dataToSave);
  organizedByBookTitle.forEach(async (kindleEntries, bookTile) => {
    await saveToAnkiFile(kindleEntries, pathToSave, `${bookTile}.tsv`);
  });

  return pathToSave;
}

async function saveToAnkiFile(
  data: Array<KindleEntryParsed>,
  pathToSave: string,
  filename?: string
): Promise<string> {

  let outPath = path.resolve(pathToSave, filename ? filename : "out.tsv");
  let ankiDeckData = data.map((kindleEntry) => {
    return kindleEntry.toJSON();
  });

  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(outPath, {
      flags: "w"
    });
    
    let dataStream = stringify(ankiDeckData, {
      delimiter: "\t",
      columns: ["authors", "bookTile", "page", "location", "dateOfCreation", "content", "type"],
      header: false,
      cast: {
        string: function(value) {
          return value.toString().replace(/"/g, "'");
        }
      }
    });

    outStream.on("error", function(err) {
      reject(err);
    });

    outStream.on("finish", function() {
      resolve(outPath);
    });

    dataStream.on("error", function(err) {
      reject(err);
    });

    dataStream.pipe(outStream);
  });
}
