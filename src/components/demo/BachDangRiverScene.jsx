import { useId } from 'react';
import background from '../../assets/bach-dang/team-background.png';
import riverbed from '../../assets/bach-dang/team-riverbed.png';
import water from '../../assets/bach-dang/team-water.png';
import scoutBoat from '../../assets/bach-dang/team-scout-boat.png';
import warship from '../../assets/bach-dang/team-warship.png';
import brokenFront from '../../assets/bach-dang/team-warship-broken-front.png';
import brokenBack from '../../assets/bach-dang/team-warship-broken-back.png';
import stakes from '../../assets/bach-dang/team-stakes.png';

// Fixed riverbed positions: only the waterline moves, revealing the stakes.
const stakePositions = [
  { x: 44, y: 414, size: 155 },
  { x: 208, y: 429, size: 145 },
  { x: 382, y: 408, size: 160 },
  { x: 552, y: 430, size: 145 },
  { x: 720, y: 415, size: 160 },
  { x: 902, y: 426, size: 150 },
  { x: 1060, y: 410, size: 155 },
];

function Warship({ id, phase }) {
  const trapped = phase === 'ambush';
  return <g className={`river-warship${trapped ? ' river-warship--trapped' : phase === 'ebb' ? ' river-warship--grounding' : ''}`}>
    <ellipse cx="0" cy="15" rx="156" ry="15" fill="#123f49" opacity=".2" />
    <path d="M-171 13Q-20 50 166 10" fill="none" stroke="#e6f4dc" strokeWidth="3" opacity={trapped ? '.25' : '.7'} />
    <image className="river-warship__intact" href={warship} x="-190" y="-260" width="380" height="284" />
    <g className="river-warship__wreck">
      <g className="river-warship__half river-warship__half--back">
        <svg x="-25" y="-200" width="270" height="202.5" viewBox="0 0 1448 1086">
          <use href={`#${id}-broken-back`} clipPath={`url(#${id}-stern-cutout)`} />
        </svg>
      </g>
      <g className="river-warship__half river-warship__half--front">
        <image href={brokenFront} x="-210" y="-200" width="270" height="202.5" />
      </g>
    </g>
    {trapped && <g className="river-impact" fill="none" stroke="#fff0cd" strokeWidth="3" strokeLinecap="round">
      <path d="M-128 0q-27 -2-37 -22M-137 8q-26 7-46 -2M73 13q22 18 48 1M130 2q25-4 36-22" />
    </g>}
  </g>;
}

function ScoutBoat({ returning }) {
  return <g className="river-scout">
    <ellipse cx="0" cy="12" rx="101" ry="10" fill="#164851" opacity=".18" />
    <path d="M-111 15Q-5 39 111 12" fill="none" stroke="#e0f3dc" strokeWidth="2.5" opacity=".8" />
    <g transform={returning ? undefined : 'scale(-1 1)'}>
      <image href={scoutBoat} x="-123" y="-159" width="246" height="184" />
    </g>
  </g>;
}

export default function BachDangRiverScene({ level, phase }) {
  const id = `river-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const waterY = 520 - level * 1.6;
  const trapped = phase === 'ambush';
  const enemyY = Math.min(waterY + 2, 474);

  return <svg className="river-artwork" viewBox="0 0 1200 700" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>Trận địa Bạch Đằng năm 938 · {trapped ? 'Triều rút, thuyền Nam Hán gãy làm đôi trên bãi cọc' : phase === 'ebb' ? 'Nước đang rút, những đầu cọc dần xuất hiện' : 'Triều dâng che kín trận địa cọc'}</title>
    <desc id={`${id}-description`}>Cảnh núi rừng ven sông, thuyền quân Ngô Quyền, chiến thuyền Nam Hán và bãi cọc được ghép từ bộ ảnh của nhóm. Mặt nước thay đổi theo thanh thủy triều, để lộ cọc nhọn và lòng sông khi nước rút.</desc>
    <defs>
      <image id={`${id}-broken-back`} href={brokenBack} width="1448" height="1086" />
      {/* Keep the stern's cabin and broken hull; its supplied artwork repeats the main sail. */}
      <clipPath id={`${id}-stern-cutout`}>
        <path d="M0 1086V740L340 570L430 610L500 690L620 735L840 735L915 450L1100 390L1250 455V230H1448V1086Z" />
      </clipPath>
      <clipPath id={`${id}-water-clip`}><rect x="0" y={waterY} width="1200" height={700 - waterY} /></clipPath>
      <clipPath id={`${id}-air-clip`}><rect width="1200" height={waterY} /></clipPath>
      <linearGradient id={`${id}-bank-fade`} x1="0" y1="0" x2="0" y2="1">
        <stop offset=".48" stopColor="white" stopOpacity="0" />
        <stop offset=".55" stopColor="white" />
      </linearGradient>
      <mask id={`${id}-riverbed-mask`}><rect width="1200" height="700" fill={`url(#${id}-bank-fade)`} /></mask>
      <linearGradient id={`${id}-water-shade`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#97d7ba" stopOpacity=".1" />
        <stop offset="1" stopColor="#063f59" stopOpacity=".32" />
      </linearGradient>
      <g id={`${id}-stakes`}>
        {stakePositions.map(({ x, y, size }) => <image key={x} href={stakes} x={x} y={y} width={size} height={size} />)}
      </g>
    </defs>

    <image href={background} width="1200" height="700" preserveAspectRatio="xMidYMid slice" />
    <image href={riverbed} width="1200" height="700" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}-riverbed-mask)`} />

    <g clipPath={`url(#${id}-water-clip)`}>
      <image href={water} x="0" y="343" width="1200" height="357" preserveAspectRatio="none" />
      <rect className="river-water-body" y={waterY} width="1200" height={700 - waterY} fill={`url(#${id}-water-shade)`} />
      <use href={`#${id}-stakes`} opacity={phase === 'high' ? '.035' : '.22'} />
    </g>
    <g className="river-exposed-stakes" clipPath={`url(#${id}-air-clip)`}><use href={`#${id}-stakes`} /></g>

    <path d={`M0 ${waterY + 1}Q150 ${waterY - 4} 300 ${waterY + 2}T600 ${waterY + 1}T900 ${waterY + 2}T1200 ${waterY}`} fill="none" stroke="#e7f3ce" strokeWidth="3" opacity=".75" />
    <g clipPath={`url(#${id}-water-clip)`}>
      <g className="river-current" fill="none" stroke="#e0f4dd" strokeLinecap="round">
        {Array.from({ length: 16 }, (_, i) => {
          const x = (i * 173) % 1180 - 20;
          const y = waterY + 20 + (i * 37 % Math.max(40, 650 - waterY));
          return <path key={i} d={`M${x} ${y}q30 ${i % 2 ? 5 : -5} 76 0`} strokeWidth="1.5" opacity=".3" />;
        })}
      </g>
    </g>

    <g className="river-scout-position" style={{ transform: `translate(${300 + level * .9}px, ${waterY + 9}px)` }}><ScoutBoat returning={trapped} /></g>
    <g className="river-enemy-position" style={{ transform: `translate(${830 + (85 - level) * .6}px, ${enemyY}px) rotate(${trapped ? 0 : -1}deg)` }}><Warship id={id} phase={phase} /></g>
    {trapped && <g className="river-reveal-rings" fill="none" stroke="#fff2d1" strokeWidth="2" opacity=".65">
      {[128, 470, 628, 1110].map(x => <path key={x} d={`M${x - 18} ${waterY + 5}q18 -8 36 0m-41 4q24 -10 48 0`} />)}
    </g>}
    <rect x="11" y="11" width="1178" height="678" rx="5" fill="none" stroke="#f3e1b4" strokeWidth="1" opacity=".3" />
  </svg>;
}
