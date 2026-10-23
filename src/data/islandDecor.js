export const ISLAND_STORAGE_KEY = 'dau-viet-island-v1';
export const JOURNEY_STORAGE_KEY = 'dau-viet-journey-v1';

export const decorItems = [
  { id: 'tree', name: 'Cây xanh', kind: 'tree', source: 'Quà chào mừng', description: 'Một góc xanh cho hòn đảo của bạn.' },
  { id: 'house', name: 'Nhà gỗ', kind: 'house', source: 'Quà chào mừng', description: 'Mái nhà nhỏ giữa hành trình khám phá.' },
  { id: 'stakes', name: 'Trận địa cọc', kind: 'stakes', source: 'Khám phá đủ 4 dấu vết', description: 'Mô hình gợi nhớ chiến thuật trên sông Bạch Đằng.' },
  { id: 'boat', name: 'Thuyền gỗ', kind: 'boat', source: 'Hoàn thành câu hỏi 1', description: 'Cánh buồm mang tri thức đến hòn đảo.' },
  { id: 'flag', name: 'Cờ chiến thắng', kind: 'flag', source: 'Hoàn thành câu hỏi 2', description: 'Lá cờ đánh dấu một bước tiến mới.' },
  { id: 'tower', name: 'Chòi canh', kind: 'tower', source: 'Tái hiện đúng trận chiến', description: 'Trông ra mặt biển từ chòi canh bằng gỗ.' },
].map(item => ({ ...item, surface: ['boat', 'stakes'].includes(item.id) ? 'water' : 'land' }));

export const initialIsland = { earned: ['tree', 'house'], placements: [], pending: [] };

// Anchors measured on island-medium.jpg, expressed as percentages of the full
// image. Keeping the original cell IDs preserves previously saved layouts.
export const islandDecorSpots = [
  [39, 33], [44.5, 33], [50, 33], [55.5, 33], [61, 33], [66.5, 33],
  [33, 39], [39.5, 39], [46, 39], [52.5, 39], [59, 39], [65.5, 39],
  [32, 45], [39, 45], [46, 45], [53, 45], [60, 45], [67, 45],
  [33, 51], [40, 51], [47, 51], [54, 51], [61, 51], [68, 51],
  [36, 57], [42.5, 57], [49, 57], [55.5, 57], [62, 57], [68.5, 57],
].map(([x, y], cell) => ({ cell, x, y, surface: 'land', label: `Bãi cỏ ${['phía bắc', 'trung tâm phía bắc', 'trung tâm', 'trung tâm phía nam', 'phía nam'][Math.floor(cell / 6)]}, vị trí ${cell % 6 + 1}` })).concat([
  [24, 84], [38, 84], [50, 84], [58, 84],
  [22, 93], [34, 93], [46, 93], [58, 93], [70, 93], [82, 93],
].map(([x, y], index) => ({ cell: 30 + index, x, y, surface: 'water', label: `Mặt nước phía trước đảo, vị trí ${index + 1}` })));

export function canPlaceItemAtSpot(id, cell) {
  const item = decorItems.find(item => item.id === id);
  const spot = islandDecorSpots.find(spot => spot.cell === cell);
  return !!item && !!spot && item.surface === spot.surface;
}

export function readSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export function readIsland() {
  const saved = readSaved(ISLAND_STORAGE_KEY, initialIsland);
  const known = new Set(decorItems.map(item => item.id));
  if (!saved || !Array.isArray(saved.earned) || !Array.isArray(saved.placements)) return initialIsland;
  const earned = [...new Set(['tree', 'house', ...saved.earned.filter(id => known.has(id))])];
  const valid = saved.placements.filter((p, i, all) => p && earned.includes(p.id)
    && Number.isInteger(p.cell) && islandDecorSpots.some(spot => spot.cell === p.cell)
    && Number.isFinite(p.rotation) && all.findIndex(q => q?.id === p.id) === i
    && all.findIndex(q => q?.cell === p.cell) === i);
  // Keep existing legal placements; relocate old boats/stakes from grass to
  // the water without losing ownership, orientation or another item's slot.
  const placements = valid.filter(p => canPlaceItemAtSpot(p.id, p.cell));
  for (const placement of valid.filter(p => !canPlaceItemAtSpot(p.id, p.cell))) {
    const spot = islandDecorSpots.find(spot => canPlaceItemAtSpot(placement.id, spot.cell)
      && !placements.some(p => p.cell === spot.cell));
    if (spot) placements.push({ ...placement, cell: spot.cell });
  }
  return { earned, placements, pending: Array.isArray(saved.pending) ? [...new Set(saved.pending.filter(id => earned.includes(id)))] : [] };
}

export function awardItem(island, id) {
  if (!decorItems.some(item => item.id === id) || island.earned.includes(id)) return island;
  return { ...island, earned: [...island.earned, id], pending: [...island.pending, id] };
}

export function placeItem(island, id, cell) {
  if (!island.earned.includes(id) || !Number.isInteger(cell) || !canPlaceItemAtSpot(id, cell)
    || island.placements.some(p => p.cell === cell && p.id !== id)) return island;
  const old = island.placements.find(p => p.id === id);
  return { ...island, placements: [...island.placements.filter(p => p.id !== id), { id, cell, rotation: old?.rotation || 0 }] };
}
