/**
 * Foreach async/await version
 * @param array
 * @param callback
 */
export declare function asyncForEach<K, V>(map: Map<K, V>, callback: (currentValue: V, currentKey: K, mapCurrent?: Map<K, V>) => Promise<void>): Promise<void>;
//# sourceMappingURL=utils.d.ts.map