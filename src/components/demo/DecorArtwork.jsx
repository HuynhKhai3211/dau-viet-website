// Shared vector miniatures keep the inventory and the island visually consistent.
export default function DecorArtwork({ kind, className = '', surface = 'land' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="85" rx="32" ry="8" fill={surface === 'water' ? '#075d72' : '#243e2a'} opacity=".17" />
      {kind === 'tree' && <>
        <path d="M45 85L47 39H55L58 85Z" fill="#805234" />
        <path d="M50 64L32 46M52 57L68 37" stroke="#805234" strokeWidth="6" />
        <path d="M18 47Q10 29 31 25Q33 6 52 16Q74 6 79 29Q98 46 78 58Q61 67 49 56Q28 69 18 47" fill="#42784f" />
        <path d="M25 34Q33 18 47 26Q64 15 75 33Q58 28 49 40Q34 31 25 43" fill="#83a962" />
      </>}
      {kind === 'house' && <>
        <path d="M23 48L53 32L80 48V79L51 90L23 76Z" fill="#b27b45" />
        <path d="M51 53L80 48V79L51 90Z" fill="#805336" />
        <path d="M13 49L46 16L88 43L54 60Z" fill="#a85136" />
        <path d="M13 49L46 16L54 60Z" fill="#d68c50" />
        <path d="M32 83V60L44 64V87M61 63L72 59V71L61 76Z" fill="#483629" />
        <path d="M24 45L48 22M30 49L51 29M59 39L80 44" stroke="#efb77b" strokeWidth="2" opacity=".6" />
      </>}
      {kind === 'boat' && <>
        <path d="M11 68Q50 82 91 61L77 82Q45 96 23 80Z" fill="#805234" />
        <path d="M11 68Q50 78 91 61" fill="none" stroke="#d6ac71" strokeWidth="5" />
        <path d="M49 69V13" stroke="#60422c" strokeWidth="4" />
        <path d="M45 18L19 59L45 56Z" fill="#f8e6bb" />
        <path d="M54 17Q79 35 81 54L54 59Z" fill="#b65137" />
        <path d="M58 30L72 43M58 45L77 51" stroke="#e8a56e" strokeWidth="2" />
      </>}
      {kind === 'flag' && <>
        <path d="M29 88L48 78L69 86L49 95Z" fill="#b6a083" />
        <path d="M48 84V12" stroke="#785438" strokeWidth="5" />
        <circle cx="48" cy="11" r="4" fill="#d7b061" />
        <path d="M51 17Q68 7 88 19L80 34L88 47Q69 36 51 47Z" fill="#aa4430" />
        <path d="M67 23L70 29L77 30L72 35L73 41L67 38L61 41L62 34L57 30L64 29Z" fill="#edc274" />
      </>}
      {kind === 'stakes' && <>
        {surface !== 'water' && <path d="M12 79L65 61L91 78L40 96Z" fill="#9b865b" />}
        {[{ x: 26, y: 24 }, { x: 48, y: 16 }, { x: 68, y: 28 }, { x: 46, y: 40 }].map(({ x, y }) => <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(-12)`}>
          <path d="M0 12L9 10L9 57L0 60Z" fill="#8c603b" />
          <path d="M0 12L6 0L9 10Z" fill="#55635e" />
          <path d="M3 16V52" stroke="#d1a26a" strokeWidth="2" />
        </g>)}
      </>}
      {kind === 'tower' && <>
        <path d="M28 87L32 37M70 87L67 37M31 77L68 47M32 48L69 78" stroke="#805234" strokeWidth="5" />
        <path d="M23 45L51 31L77 43L51 58Z" fill="#bf8c55" />
        <path d="M27 43V27M72 42V26M51 52V32" stroke="#805234" strokeWidth="4" />
        <path d="M16 29L48 7L84 27L51 39Z" fill="#b25f39" />
        <path d="M16 29L48 7L51 39Z" fill="#dbac66" />
        <path d="M40 86V58M48 85V56M40 64H48M40 72H48M40 80H48" stroke="#d1ac74" strokeWidth="3" />
      </>}
      {surface === 'water' && <>
        <path d="M10 87Q26 95 43 91M62 92Q79 94 92 85M23 96Q48 101 72 96" fill="none" stroke="#d2fbf6" strokeWidth="2" opacity=".8" strokeLinecap="round" />
      </>}
    </svg>
  );
}
