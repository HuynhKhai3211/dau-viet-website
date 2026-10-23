import islandSmall from '../assets/islands/island-small.jpg';
import islandMedium from '../assets/islands/island-medium.jpg';
import islandLarge from '../assets/islands/island-large.png';

/**
 * Danh sách 3 hòn đảo cá nhân chính thức của Dấu Việt
 * Đại diện cho 3 cấp độ mở rộng trong ứng dụng di động:
 * - Đảo Nhỏ (island-small.jpg): Có sẵn từ đầu
 * - Đảo Vừa (island-medium.jpg): Mở khóa khi hoàn thành các sự kiện lịch sử theo yêu cầu
 * - Đảo Lớn (island-large.png): Mở khóa khi hoàn thành thêm các sự kiện lịch sử tiếp theo
 */
export const personalIslands = [
  {
    id: 'small',
    title: 'Đảo Nhỏ',
    subtitle: 'Không gian khởi đầu',
    image: islandSmall,
    alt: 'Hòn đảo cá nhân - Đảo Nhỏ trong Dấu Việt',
    requirement: 'Có sẵn từ ban đầu',
    progression: 'Khởi đầu hành trình',
    description: 'Hòn đảo khởi đầu ấm cúng và vừa vặn dành cho mọi người học. Đây là không gian cá nhân đầu tiên của bạn, nơi bạn có thể bắt đầu trang trí bằng các vật phẩm và kỷ vật thu thập được từ các bài học ban đầu.',
    features: [
      'Không gian cá nhân có sẵn ngay khi bắt đầu',
      'Tự do trang trí bằng các vật phẩm thu thập và sở hữu',
      'Khu vực đặt các cổ vật kỷ niệm ban đầu',
      'Cảnh quan thiên nhiên khởi sắc thanh bình',
    ],
    highlight: 'Nơi đặt những viên gạch đầu tiên cho vương quốc tri thức của bạn.',
  },
  {
    id: 'medium',
    title: 'Đảo Vừa',
    subtitle: 'Không gian mở rộng',
    image: islandMedium,
    alt: 'Hòn đảo cá nhân - Đảo Vừa trong Dấu Việt',
    requirement: 'Mở khóa khi hoàn thành các sự kiện lịch sử theo yêu cầu',
    progression: 'Giai đoạn tiến bộ',
    description: 'Không gian được mở rộng rõ rệt khi bạn vượt qua các thử thách lịch sử. Cung cấp diện tích trang trí rộng rãi hơn với nhiều tiểu cảnh sinh động, đánh dấu bước tiến bộ trên hành trình học tập và tích lũy tri thức.',
    features: [
      'Mở rộng diện tích và không gian bài trí',
      'Đánh dấu sự tiến bộ trên hành trình khám phá lịch sử',
      'Thêm nhiều vị trí sắp đặt hiện vật và công trình',
      'Hệ sinh thái, cây cỏ và cảnh quan phong phú hơn',
    ],
    highlight: 'Minh chứng sống động cho sự trưởng thành và tri thức ngày càng sâu rộng.',
  },
  {
    id: 'large',
    title: 'Đảo Lớn',
    subtitle: 'Không gian hoàn chỉnh',
    image: islandLarge,
    alt: 'Hòn đảo cá nhân - Đảo Lớn trong Dấu Việt',
    requirement: 'Mở khóa khi hoàn thành thêm các sự kiện lịch sử tiếp theo',
    progression: 'Đỉnh cao thành tựu',
    description: 'Hòn đảo hoàn chỉnh với diện tích trang trí lớn nhất, biểu tượng cho hành trình khám phá bền bỉ và những thành tựu lịch sử đáng tự hào. Bạn có thể tự do kiến tạo nên một vương quốc tri thức hào hùng của riêng mình.',
    features: [
      'Không gian trang trí rộng lớn nhất trong hệ thống',
      'Biểu tượng cho hành trình khám phá và thành tựu lâu dài',
      'Thỏa sức kiến tạo đại bản doanh tri thức cá nhân',
      'Trưng bày trọn vẹn các đại bảo vật và di sản lịch sử',
    ],
    highlight: 'Đỉnh cao vinh danh tinh thần kiên trì và niềm say mê khám phá lịch sử dân tộc.',
  },
];

export const islandLevels = personalIslands;
export default personalIslands;
