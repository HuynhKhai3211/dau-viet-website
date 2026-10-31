export const mainSections = [
  { id: 'about', label: 'Giới thiệu' },
  { id: 'how-it-works', label: 'Cách hoạt động' },
  { id: 'periods', label: '4 thời kỳ' },
  { id: 'investigation', label: 'Khám phá' },
  { id: 'islands', label: 'Đảo di sản' },
  { id: 'gamification', label: 'Tính năng' },
  { id: 'team', label: 'Đội ngũ' },
  { id: 'contact', label: 'Liên hệ' },
];

const aliases = {
  'gioi-thieu': 'about', 'home-about': 'about',
  'kham-pha': 'investigation', 'cach-hoat-dong': 'how-it-works',
  'learning-flow': 'how-it-works', 'historical-timeline': 'periods',
  'home-periods': 'periods', 'bon-thoi-ky': 'periods',
  'personal-island': 'islands', 'home-island': 'islands', 'dao-di-san': 'islands',
  'tinh-nang': 'gamification', 'home-features': 'gamification',
  'doi-ngu': 'team', 'lien-he': 'contact', 'home-demo': 'investigation',
};

export function resolveSectionId(id) {
  return aliases[id] || id.replace(/^learning-flow-step-/, 'how-it-works-step-');
}
