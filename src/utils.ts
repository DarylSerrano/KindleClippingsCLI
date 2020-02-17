/**
 * Foreach async/await version
 * @param array
 * @param callback
 */
export async function asyncForEach<K, V>(
  map: Map<K, V>,
  callback: (
    currentValue: V,
    currentKey: K,
    mapCurrent?: Map<K, V>
  ) => Promise<void>
) {
  for (const entry of map.entries()) {
    await callback(entry[1], entry[0], map);
  }
}
