import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Gift, Move, Package, RotateCw, Trees, ZoomIn, ZoomOut } from 'lucide-react';
import { decorItems, islandDecorSpots, placeItem, canPlaceItemAtSpot } from '../../data/islandDecor';
import islandMedium from '../../assets/islands/island-medium.jpg';
import DecorArtwork from './DecorArtwork';
import AnimatedMascot from '../common/AnimatedMascot';
import { playSound } from '../../utils/interactionSounds';
import '../../styles/components/islandDecor.css';

export default function IslandDecor({ island, setIsland, initialSelected, onContinue, saveError }) {
  const [selected, setSelected] = useState(initialSelected || null);
  const [notice, setNotice] = useState('');
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => { setSelected(initialSelected || null); }, [initialSelected]);
  const item = decorItems.find(i => i.id === selected);
  const placed = island.placements.find(p => p.id === selected);

  const handlePlace = (cell) => {
    if (!selected) { setNotice('Chọn một vật phẩm trong kho trước nhé.'); return; }
    if (!canPlaceItemAtSpot(selected, cell)) { void playSound('error'); setNotice(item.surface === 'water' ? 'Hãy chọn điểm sáng trên mặt nước để đặt thuyền hoặc cọc.' : 'Vật phẩm này cần được đặt trên bãi cỏ.'); return; }
    const occupied = island.placements.find(p => p.cell === cell && p.id !== selected);
    if (occupied) { setNotice('Ô này đã có vật phẩm. Hãy chọn một ô trống khác.'); return; }
    setIsland(prev => placeItem(prev, selected, cell));
    void playSound(item.surface === 'water' ? 'water' : 'place');
    setNotice(`Đã đặt ${item.name.toLowerCase()}. Bạn có thể chọn ô khác để di chuyển.`);
  };

  return (
    <section className="island-workshop" aria-labelledby="island-heading">
      <div className="island-workshop__heading">
        <div><span className="island-eyebrow">GÓC NHỎ CỦA NHÀ THÁM HIỂM</span><h1 id="island-heading">Đảo của tôi</h1><p>Mỗi điều học được, một dấu ấn trên đảo.</p></div>
        <button className="btn btn--secondary" onClick={onContinue}><ArrowLeft size={17} /> Tiếp tục hành trình</button>
      </div>
      <div className="island-workspace">
        <div className="island-scene-panel">
          <div className="island-scene-toolbar">
            <span><Trees size={18} /> Đảo tri thức · Bạch Đằng</span>
            <div className="island-scene-toolbar__actions"><span>{island.placements.length} vật phẩm đã đặt</span>
              <button type="button" className="island-zoom-btn" aria-pressed={zoomed} onClick={() => setZoomed(prev => !prev)}>
                {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoomed ? 'Thu nhỏ' : 'Phóng to'}
              </button>
            </div>
          </div>
          <div className="island-scene-scroll" tabIndex={zoomed ? 0 : undefined} aria-label={zoomed ? 'Đảo phóng to. Cuộn ngang để xem các vị trí.' : undefined}>
          <div className={`island-scene ${selected ? 'island-scene--editing' : ''}`} style={{ width: zoomed ? '175%' : '100%' }}>
            <img className="island-scene__image" src={islandMedium} alt="Đảo medium với bãi cỏ trung tâm, vách đá, hàng dừa và cầu cảng giữa biển xanh" draggable={false} />
            <div className="island-grid" role="group" aria-label="Các điểm đặt vật phẩm trên bãi cỏ và mặt nước phía trước đảo">
              {islandDecorSpots.map(({ cell, x, y, label, surface }) => {
                const placement = island.placements.find(p => p.cell === cell);
                const decor = decorItems.find(i => i.id === placement?.id);
                const available = !!selected && canPlaceItemAtSpot(selected, cell);
                return <button key={cell} type="button"
                  className={`island-cell island-cell--${surface} ${available ? 'island-cell--available' : ''} ${placement ? 'island-cell--occupied' : ''} ${placement?.id === selected ? 'island-cell--selected' : ''}`}
                  disabled={!placement && !available}
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: Math.round(y) }}
                  tabIndex={available || placement ? 0 : -1}
                  aria-label={`${label}${decor ? `: ${decor.name}. Chọn để chỉnh sửa` : ': điểm trống. Đặt vật phẩm'}`}
                  title={`${label}${decor ? ` · ${decor.name}` : ''}`}
                  onClick={() => {
                    if (placement && placement.id !== selected) { setSelected(placement.id); setNotice(`Đã chọn ${decor.name.toLowerCase()}. Chọn ô trống để di chuyển.`); }
                    else handlePlace(cell);
                  }}>
                  {decor ? <span className="island-placed-art" style={{ transform: `rotateY(${placement.rotation}deg)` }}><DecorArtwork kind={decor.kind} surface={surface} /></span> : <span className="island-cell__dot">+</span>}
                </button>;
              })}
            </div>
          </div>
          </div>
          <div className="island-edit-bar">
            <span><Move size={16} /> {item ? `Đang chọn: ${item.name}` : 'Chọn vật phẩm để bắt đầu trang trí'}</span>
            <div>
              <button className="btn btn--secondary btn--small" data-sound="place" disabled={!placed} onClick={() => {
                setIsland(prev => ({ ...prev, placements: prev.placements.map(p => p.id === selected ? { ...p, rotation: p.rotation === 0 ? 180 : 0 } : p) }));
                setNotice('Đã xoay hướng vật phẩm.');
              }}><RotateCw size={16} /> Xoay hướng</button>
              <button className="btn btn--secondary btn--small" data-sound="place" disabled={!placed} onClick={() => {
                setIsland(prev => ({ ...prev, placements: prev.placements.filter(p => p.id !== selected) }));
                setNotice('Đã cất vật phẩm vào kho.');
              }}><Package size={16} /> Cất vào kho</button>
            </div>
          </div>
          <p className="island-status" role="status">{saveError || notice || 'Thuyền và bãi cọc đặt trên mặt nước phía trước đảo. Nhà, cây, cờ và chòi canh đặt trên bãi cỏ.'}</p>
        </div>
        <aside className="island-inventory" aria-labelledby="inventory-heading">
          <div className="island-inventory__heading"><div><span className="island-eyebrow">BỘ SƯU TẬP BẠCH ĐẰNG</span><h2 id="inventory-heading">Kho vật phẩm</h2></div><span>{island.earned.length}/{decorItems.length}</span></div>
          <p>Phần thưởng từ những bước khám phá của bạn.</p>
          <div className="island-inventory__grid">
            {decorItems.map(decor => {
              const owned = island.earned.includes(decor.id);
              const onIsland = island.placements.some(p => p.id === decor.id);
              return <button key={decor.id} className={`decor-card ${selected === decor.id ? 'decor-card--selected' : ''} ${owned ? '' : 'decor-card--locked'}`}
                data-sound="select"
                disabled={!owned} aria-pressed={selected === decor.id} onClick={() => { setSelected(decor.id); setNotice(`Chọn điểm sáng ${decor.surface === 'water' ? 'trên mặt nước phía trước đảo' : 'trên bãi cỏ'} để đặt ${decor.name.toLowerCase()}.`); }}>
                <DecorArtwork kind={decor.kind} /><strong>{decor.name}</strong><small>{owned ? onIsland ? 'Đã đặt trên đảo' : 'Có thể đặt · 1 vật phẩm' : decor.source}</small>
                {selected === decor.id && <Check className="decor-card__check" size={17} />}
              </button>;
            })}
          </div>
          <div className="island-inventory__note"><Gift size={20} /><span>Hoàn thành mỗi câu hỏi để mở khóa quà mới. Mỗi phần thưởng chỉ nhận một lần.</span></div>
          <p className="island-save-note">{saveError || 'Tự động lưu trên trình duyệt này.'}</p>
        </aside>
      </div>
    </section>
  );
}

export function IslandRewardDialog({ itemId, onContinue, onDecorate }) {
  const ref = useRef(null);
  const item = decorItems.find(i => i.id === itemId);
  useEffect(() => {
    const dialog = ref.current;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);
  return <dialog ref={ref} className="island-reward" aria-labelledby="reward-heading" onCancel={event => { event.preventDefault(); onContinue(); }}>
    {item && <>
      <span className="island-eyebrow">MỘT DẤU ẤN MỚI TRÊN ĐẢO</span>
      <div className="island-reward__art"><DecorArtwork kind={item.kind} /></div>
      <h2 id="reward-heading">Bạn nhận được {item.name.toLowerCase()}!</h2>
      <p>{item.description}</p>
      <div className="island-reward__mascot"><AnimatedMascot size="small" interactive={false} /><span><strong>Bé Sử</strong><br />Mình đã cất quà vào kho rồi. Cùng làm đẹp hòn đảo nhé!</span></div>
      <div className="island-reward__actions"><button autoFocus className="btn btn--secondary" onClick={onContinue}>Tiếp tục</button><button className="btn btn--primary" onClick={() => onDecorate(item.id)}>Đặt lên đảo</button></div>
    </>}
  </dialog>;
}
