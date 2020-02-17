import { KindleEntryParsed } from "@darylserrano/kindle-clippings";
export declare function saveAll(dataToSave: Array<KindleEntryParsed>, pathToSave: string, filename?: string): Promise<string>;
export declare function saveByAuthor(dataToSave: Array<KindleEntryParsed>, pathToSave: string): Promise<string>;
export declare function saveByBookTitle(dataToSave: Array<KindleEntryParsed>, pathToSave: string): Promise<string>;
//# sourceMappingURL=anki.d.ts.map