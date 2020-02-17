import { KindleEntryParsed } from "@darylserrano/kindle-clippings";
export declare function getAllEntriesParsed(filePath: string): Promise<Array<KindleEntryParsed>>;
export declare function saveAll(dataToSave: Array<KindleEntryParsed>, pathToSave: string, filename?: string, pretty?: boolean): Promise<string>;
export declare function saveByAuthor(dataToSave: Array<KindleEntryParsed>, pathToSave: string, pretty?: boolean): Promise<string>;
export declare function saveByBookTitle(dataToSave: Array<KindleEntryParsed>, pathToSave: string, pretty?: boolean): Promise<string>;
//# sourceMappingURL=io.d.ts.map