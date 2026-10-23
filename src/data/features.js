import {
  Clock, Map, Search, Brain, Puzzle, Palmtree
} from 'lucide-react';

export const features = [
  {
    id: 'timeline',
    icon: 'Clock',
    title: 'Dòng thời gian lịch sử',
    description: 'Khám phá lịch sử Việt Nam qua dòng thời gian tương tác, từ thời kỳ dựng nước đến các triều đại hào hùng.',
    color: 'var(--color-red)',
  },
  {
    id: 'map',
    icon: 'Map',
    title: 'Bản đồ khám phá',
    description: 'Tham quan các địa điểm lịch sử trên bản đồ, tìm hiểu bối cảnh không gian của từng sự kiện.',
    color: 'var(--color-green)',
  },
  {
    id: 'clues',
    icon: 'Search',
    title: 'Thu thập Dấu Vết',
    description: 'Tìm kiếm và thu thập các manh mối lịch sử – những Dấu Vết giúp bạn hiểu sâu hơn về quá khứ.',
    color: 'var(--color-gold)',
  },
  {
    id: 'reasoning',
    icon: 'Brain',
    title: 'Suy luận và kiểm chứng',
    description: 'Đặt giả thuyết dựa trên các Dấu Vết đã thu thập, sau đó kiểm chứng để rút ra kết luận lịch sử.',
    color: 'var(--color-blue)',
  },
  {
    id: 'reconstruct',
    icon: 'Puzzle',
    title: 'Tái hiện sự kiện',
    description: 'Sắp xếp lại các sự kiện theo trình tự thời gian, tái hiện bức tranh lịch sử hoàn chỉnh.',
    color: 'var(--color-red)',
  },
  {
    id: 'island',
    icon: 'Palmtree',
    title: 'Hòn đảo cá nhân',
    description: 'Xây dựng hòn đảo riêng của bạn với phần thưởng từ việc học lịch sử, trang trí và mở rộng không gian.',
    color: 'var(--color-green)',
  },
];

export const featureIconMap = {
  Clock, Map, Search, Brain, Puzzle, Palmtree,
};

export default features;
