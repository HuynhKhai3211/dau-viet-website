import test from 'node:test';
import assert from 'node:assert/strict';
import { awardItem, initialIsland, placeItem, readIsland, readSaved } from '../src/data/islandDecor.js';

test('each reward is awarded once, including after replay and restore', () => {
  const awarded = awardItem(initialIsland, 'boat');
  assert.deepEqual(awarded.pending, ['boat']);
  assert.equal(awardItem(awarded, 'boat'), awarded);
  assert.equal(awardItem(JSON.parse(JSON.stringify(awarded)), 'boat').earned.filter(id => id === 'boat').length, 1);
  assert.equal(awardItem(awarded, 'unknown'), awarded);
  assert.deepEqual(initialIsland.earned, ['tree', 'house']);
});

test('placement rejects locked items, invalid cells and occupied cells', () => {
  assert.equal(placeItem(initialIsland, 'boat', 0), initialIsland);
  assert.equal(placeItem(initialIsland, 'tree', 30), initialIsland); // Water is not a valid spot for a tree.
  assert.equal(placeItem(initialIsland, 'tree', -1), initialIsland);
  const placed = placeItem(initialIsland, 'tree', 4);
  assert.equal(placeItem(placed, 'house', 4), placed);
  const moved = placeItem(placed, 'tree', 7);
  assert.deepEqual(moved.placements, [{ id: 'tree', cell: 7, rotation: 0 }]);
});

test('moving an item preserves its orientation and inventory', () => {
  const island = { ...initialIsland, placements: [{ id: 'house', cell: 3, rotation: 180 }] };
  const moved = placeItem(island, 'house', 20);
  assert.equal(moved.placements[0].rotation, 180);
  assert.deepEqual(moved.earned, initialIsland.earned);
});

test('saved island restores rewards, pending notices and placements', () => {
  const saved = placeItem(awardItem(initialIsland, 'boat'), 'boat', 30);
  globalThis.localStorage = { getItem: () => JSON.stringify(saved) };
  assert.deepEqual(readIsland(), saved);
});

test('boats and stakes use water while land decorations stay on grass', () => {
  const island = awardItem(awardItem(initialIsland, 'boat'), 'stakes');
  assert.equal(placeItem(island, 'boat', 11), island);
  assert.equal(placeItem(island, 'stakes', 12), island);
  assert.equal(placeItem(island, 'house', 32), island);
  const placed = placeItem(island, 'boat', 30);
  assert.equal(placeItem(placed, 'stakes', 30), placed);
  assert.deepEqual(placeItem(placed, 'stakes', 31).placements.map(p => p.cell), [30, 31]);
  assert.equal(placeItem(island, 'boat', 40), island);
});

test('old saved marine items move to free water spots without losing rotation', () => {
  const saved = { earned: ['tree', 'house', 'boat', 'stakes'], pending: [], placements: [
    { id: 'tree', cell: 3, rotation: 0 },
    { id: 'boat', cell: 14, rotation: 180 },
    { id: 'stakes', cell: 31, rotation: 0 },
  ] };
  globalThis.localStorage = { getItem: () => JSON.stringify(saved) };
  const restored = readIsland();
  assert.deepEqual(restored.placements.find(p => p.id === 'tree'), saved.placements[0]);
  assert.deepEqual(restored.placements.find(p => p.id === 'stakes'), saved.placements[2]);
  assert.deepEqual(restored.placements.find(p => p.id === 'boat'), { id: 'boat', cell: 30, rotation: 180 });
  assert.deepEqual(restored.earned, saved.earned);
  delete globalThis.localStorage;
});

test('corrupted or unavailable storage falls back safely', () => {
  globalThis.localStorage = { getItem: () => '{bad json' };
  assert.deepEqual(readIsland(), initialIsland);
  globalThis.localStorage = { getItem: () => { throw new Error('blocked'); } };
  assert.equal(readSaved('test', 'fallback'), 'fallback');
  globalThis.localStorage = { getItem: () => JSON.stringify({ earned: ['unknown', 'boat'], placements: [null, { id: 'boat', cell: 900, rotation: 0 }], pending: ['unknown', 'boat', 'boat'] }) };
  assert.deepEqual(readIsland(), { earned: ['tree', 'house', 'boat'], placements: [], pending: ['boat'] });
  delete globalThis.localStorage;
});
