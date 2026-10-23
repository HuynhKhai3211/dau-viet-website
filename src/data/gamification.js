export const gamificationFeatures = [
  {
    id: 'dau-viet-points',
    title: 'Điểm Dấu Việt',
    description: 'Tích lũy điểm khi hoàn thành sự kiện lịch sử, trả lời đúng câu hỏi, và khám phá nội dung mới.',
    icon: 'Star',
    color: 'var(--color-gold)',
  },
  {
    id: 'xp',
    title: 'Điểm kinh nghiệm (XP)',
    description: 'Nhận XP từ mọi hoạt động học tập. XP giúp tăng cấp độ và mở khóa thành tựu mới.',
    icon: 'TrendingUp',
    color: 'var(--color-green)',
  },
  {
    id: 'achievements',
    title: 'Thành tựu',
    description: 'Hoàn thành các mục tiêu đặc biệt để mở khóa huy hiệu và danh hiệu độc đáo.',
    icon: 'Award',
    color: 'var(--color-red)',
  },
  {
    id: 'energy',
    title: 'Năng lượng',
    description: 'Mỗi ngày bạn có 30 năng lượng. Mỗi hoạt động tiêu tốn năng lượng, năng lượng hồi phục theo thời gian.',
    icon: 'Zap',
    color: 'var(--color-blue)',
  },
  {
    id: 'streak',
    title: 'Chuỗi học tập',
    description: 'Duy trì chuỗi học tập hàng ngày để nhận phần thưởng tăng dần. Đừng để chuỗi bị gián đoạn!',
    icon: 'Flame',
    color: '#FF6B35',
  },
  {
    id: 'streak-freeze',
    title: 'Đóng băng chuỗi',
    description: 'Giữ tối đa 3 lượt đóng băng chuỗi. Nếu bạn không thể học trong ngày, đóng băng sẽ bảo vệ chuỗi của bạn.',
    icon: 'Snowflake',
    color: '#5BA4CF',
  },
  {
    id: 'collectibles',
    title: 'Vật phẩm sưu tầm',
    description: 'Thu thập các vật phẩm đặc biệt liên quan đến từng thời kỳ lịch sử – dùng để trang trí đảo.',
    icon: 'Gift',
    color: 'var(--color-gold)',
  },
  {
    id: 'decorations',
    title: 'Trang trí đảo',
    description: 'Sử dụng điểm và vật phẩm để mua và đặt các công trình, cây cối, tượng trên hòn đảo cá nhân.',
    icon: 'Palette',
    color: 'var(--color-green)',
  },
];

export const energySystem = {
  dailyEnergy: 30,
  recoveryRate: '1 năng lượng mỗi 30 phút',
  activities: [
    { name: 'Khám phá Dấu Vết', cost: 3 },
    { name: 'Trả lời câu hỏi suy luận', cost: 2 },
    { name: 'Tái hiện sự kiện', cost: 5 },
    { name: 'Xem nội dung lịch sử', cost: 1 },
  ],
};

export default gamificationFeatures;
