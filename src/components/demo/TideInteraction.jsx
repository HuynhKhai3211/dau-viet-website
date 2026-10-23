import { useId, useState } from 'react';
import { Waves, ArrowDown, Flag, MoveRight, ZoomIn, ZoomOut } from 'lucide-react';
import BachDangRiverScene from './BachDangRiverScene';
import '../../styles/components/tideInteraction.css';

const phases = [
  { id: 'high', level: 85, title: 'Nhử địch theo con nước', description: 'Triều dâng che kín bãi cọc. Thuyền nhẹ dẫn chiến thuyền địch vào sâu trong sông.', status: 'Nước lớn · Trận địa còn ẩn', icon: MoveRight },
  { id: 'ebb', level: 50, title: 'Dòng sông hé lộ trận địa', description: 'Con nước bắt đầu rút. Những đầu cọc nhọn dần xuất hiện, thu hẹp đường lui.', status: 'Nước đang rút · Cọc dần lộ', icon: ArrowDown },
  { id: 'ambush', level: 18, title: 'Đổi chiều thế trận', description: 'Thuyền lớn mắc cọc, thân thuyền gãy làm đôi. Quân Ngô Quyền quay lại phản công.', status: 'Nước ròng · Thuyền địch gãy đôi', icon: Flag },
];

export default function TideInteraction() {
  const [level, setLevel] = useState(85);
  const [zoomed, setZoomed] = useState(false);
  const sliderId = useId();
  const phase = phases[level >= 68 ? 0 : level >= 36 ? 1 : 2];
  const PhaseIcon = phase.icon;

  return <section className="tide-interaction" aria-label="Mô phỏng tương tác thủy triều Bạch Đằng">
    <header className="tide-battle-heading">
      <div><span className="tide-eyebrow">BẠCH ĐẰNG GIANG · NĂM 938</span><h4>Theo con nước, đổi thế trận.</h4><p>Kéo thanh thủy triều để khám phá cách Ngô Quyền biến dòng sông thành trận địa.</p></div>
      <div className="tide-interaction__quick-toggles" role="group" aria-label="Chọn trạng thái thủy triều">
        <button type="button" className="tide-interaction__toggle-btn" aria-pressed={phase.id === 'high'} onClick={() => setLevel(85)} data-sound="water"><Waves size={15} /> Triều dâng</button>
        <button type="button" className="tide-interaction__toggle-btn" aria-pressed={phase.id === 'ambush'} onClick={() => setLevel(18)} data-sound="water"><ArrowDown size={15} /> Triều rút</button>
      </div>
    </header>
    <figure className={`tide-battle-scene tide-battle-scene--${phase.id}`}>
      <div className="tide-artwork-scroll" tabIndex={zoomed ? 0 : undefined} aria-label={zoomed ? 'Cảnh phóng to, cuộn ngang để quan sát chiến trường' : undefined}>
        <div className="tide-artwork-frame" style={{ width: zoomed ? '165%' : '100%' }}><BachDangRiverScene level={level} phase={phase.id} /></div>
      </div>
      <figcaption className="tide-scene-status"><span>TRẬN ĐỊA BẠCH ĐẰNG</span><strong role="status" aria-live="polite"><PhaseIcon size={15} />{phase.status}</strong></figcaption>
      <button type="button" className="tide-zoom" onClick={() => setZoomed(prev => !prev)} aria-pressed={zoomed} aria-label={zoomed ? 'Thu nhỏ cảnh thủy triều' : 'Phóng to cảnh thủy triều'} title={zoomed ? 'Thu nhỏ' : 'Phóng to'}>{zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}</button>
      <div className="tide-scene-legend" aria-label="Chú giải thuyền"><span>Thuyền quân Ngô Quyền</span><span>Chiến thuyền Nam Hán</span></div>
    </figure>
    <div className="tide-story" role="group" aria-label="Ba giai đoạn của thế trận thủy triều">
      {phases.map((item, index) => <button type="button" key={item.id} className="tide-story-card" aria-pressed={phase.id === item.id} onClick={() => setLevel(item.level)} data-sound="water"><span className="tide-story-card__number">0{index + 1}<span> / THẾ TRẬN</span></span><strong>{item.title}</strong><p>{item.description}</p></button>)}
    </div>
    <div className="tide-control-panel">
      <div className="tide-control-panel__heading"><label htmlFor={sliderId}><Waves size={20} /> Thủy triều sông Bạch Đằng</label><output htmlFor={sliderId}>{level}<span>%</span></output></div>
      <input id={sliderId} type="range" min="0" max="100" step="1" value={level} onChange={event => setLevel(Number(event.target.value))} className="tide-controls__slider" style={{ '--tide-level': `${level}%` }} aria-label="Điều chỉnh mực nước thủy triều" aria-valuetext={`${level}% · ${phase.status}`} />
      <div className="tide-control-limits"><span>Triều rút · Cọc lộ</span><span>Triều dâng · Cọc chìm</span></div>
      <p className="tide-observation"><strong>Quan sát thế trận:</strong> {phase.description}</p>
      <p className="tide-art-note">Minh họa nghệ thuật phục vụ học tập. Mực nước và tỉ lệ cảnh vật được mô phỏng.</p>
    </div>
  </section>;
}
