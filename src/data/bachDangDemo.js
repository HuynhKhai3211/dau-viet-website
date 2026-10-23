// ================================
// Bạch Đằng 938 Interactive Demo Data
// ================================

export const DEMO_STAGES = {
  INTRO: 'INTRO',
  CLUE_EXPLORATION: 'CLUE_EXPLORATION',
  HYPOTHESIS: 'HYPOTHESIS',
  VERIFICATION: 'VERIFICATION',
  RECONSTRUCTION: 'RECONSTRUCTION',
  RESULTS: 'RESULTS',
};

export const demoIntro = {
  title: 'Bí ẩn trên sông Bạch Đằng',
  subtitle: 'Chiến thắng Bạch Đằng năm 938',
  description:
    'Năm 938, trên dòng sông Bạch Đằng, một trận chiến lịch sử đã diễn ra. Ngô Quyền, vị tướng tài ba, đã sử dụng một chiến thuật độc đáo để đánh bại quân xâm lược Nam Hán. Hãy cùng khám phá những bí ẩn đằng sau chiến thắng vĩ đại này.',
  instruction:
    'Trong hành trình này, bạn sẽ thu thập 4 Dấu Vết, suy luận về chiến thuật, và tái hiện trình tự sự kiện. Hãy quan sát kỹ và suy nghĩ logic!',
  learningObjective:
    'Hiểu được mối quan hệ giữa thủy triều, địa hình, cọc gỗ và chiến thuật của Ngô Quyền trong chiến thắng Bạch Đằng 938.',
  disclaimer:
    'Đây là bản tái hiện đơn giản hóa phục vụ mục đích giáo dục. Một số chi tiết có thể được giản lược so với sự kiện lịch sử thực tế.',
};

export const clues = [
  {
    id: 'thuy-trieu',
    number: 1,
    title: 'Thủy Triều',
    icon: 'Waves',
    shortDescription: 'Sự lên xuống của mực nước sông',
    fullDescription:
      'Sông Bạch Đằng chịu ảnh hưởng mạnh mẽ của thủy triều. Khi triều lên, mực nước dâng cao, có thể che phủ các vật cản dưới lòng sông. Khi triều xuống, mực nước hạ thấp đáng kể, để lộ đáy sông và các chướng ngại vật.',
    detail:
      'Ngô Quyền đã nghiên cứu kỹ quy luật thủy triều trên sông Bạch Đằng. Ông nhận ra rằng sự chênh lệch mực nước giữa lúc triều lên và triều xuống rất lớn — đây chính là yếu tố then chốt trong chiến thuật của ông.',
    interactionType: 'tide-slider',
    position: { x: 20, y: 40 },
  },
  {
    id: 'bai-coc',
    number: 2,
    title: 'Bãi Cọc Gỗ',
    icon: 'TreePine',
    shortDescription: 'Hàng ngàn cọc gỗ nhọn dưới lòng sông',
    fullDescription:
      'Ngô Quyền đã cho đóng hàng ngàn cọc gỗ lớn, vạt nhọn đầu và bịt sắt, xuống lòng sông Bạch Đằng. Các cọc này được bố trí thành nhiều hàng, đầu nhọn hướng về phía cửa biển — nơi quân Nam Hán sẽ tiến vào.',
    detail:
      'Khi triều lên, các cọc gỗ bị ngập hoàn toàn dưới nước, không thể nhìn thấy từ mặt sông. Khi triều xuống, các cọc nhọn lộ ra, trở thành bẫy chết người cho bất kỳ thuyền chiến nào đi qua vùng này.',
    interactionType: 'examine',
    position: { x: 50, y: 55 },
  },
  {
    id: 'dia-hinh',
    number: 3,
    title: 'Địa Hình Sông Bạch Đằng',
    icon: 'Mountain',
    shortDescription: 'Đặc điểm địa hình vùng cửa sông',
    fullDescription:
      'Sông Bạch Đằng nằm ở vùng đông bắc, đổ ra biển qua cửa sông rộng. Hai bên bờ sông có nhiều nhánh nhỏ, bãi lầy, và vùng rừng rậm — tạo điều kiện thuận lợi để mai phục.',
    detail:
      'Địa hình sông Bạch Đằng với nhiều nhánh phụ và bãi lầy ven bờ là nơi lý tưởng để bố trí quân mai phục. Quân Việt có thể ẩn nấp trong các nhánh sông nhỏ và bất ngờ tấn công khi thời cơ đến.',
    interactionType: 'map',
    position: { x: 75, y: 30 },
  },
  {
    id: 'chien-thuat',
    number: 4,
    title: 'Chiến Thuật Của Ngô Quyền',
    icon: 'Swords',
    shortDescription: 'Kế hoạch tác chiến tinh vi',
    fullDescription:
      'Ngô Quyền đã xây dựng một kế hoạch chiến thuật kết hợp nhiều yếu tố: lợi dụng thủy triều, sử dụng bãi cọc, bố trí quân mai phục, và nhử địch vào bẫy. Một đội quân nhỏ được phái ra khiêu chiến rồi giả vờ thua chạy để dụ quân Nam Hán tiến sâu vào vùng cọc.',
    detail:
      'Chiến thuật của Ngô Quyền thể hiện sự am hiểu sâu sắc về địa hình, thời tiết, và tâm lý đối phương. Ông đã biến những yếu tố tự nhiên thành vũ khí, kết hợp với sự chuẩn bị kỹ lưỡng để tạo ra một chiến thắng quyết định.',
    interactionType: 'sequence',
    position: { x: 35, y: 20 },
  },
];

export const hypothesisQuestions = [
  {
    id: 'q1',
    question:
      'Vì sao sự thay đổi của thủy triều có vai trò quan trọng trong chiến thắng Bạch Đằng năm 938?',
    options: [
      {
        id: 'q1a',
        text: 'Thủy triều tạo ra sóng lớn đánh chìm thuyền địch',
        isCorrect: false,
      },
      {
        id: 'q1b',
        text: 'Khi triều lên, cọc gỗ bị che giấu; khi triều xuống, cọc lộ ra và phá hủy thuyền địch đang rút lui',
        isCorrect: true,
      },
      {
        id: 'q1c',
        text: 'Thủy triều ngăn không cho quân Nam Hán tiến vào sông',
        isCorrect: false,
      },
      {
        id: 'q1d',
        text: 'Thủy triều giúp thuyền của Ngô Quyền di chuyển nhanh hơn',
        isCorrect: false,
      },
    ],
    correctId: 'q1b',
    explanation:
      'Ngô Quyền lợi dụng quy luật thủy triều: khi triều lên, nước dâng cao che khuất bãi cọc, giúp nhử quân Nam Hán tiến sâu vào sông. Khi triều xuống, mực nước hạ, các cọc nhọn lộ ra, chặn đường rút lui và phá hủy thuyền chiến của địch.',
    relatedClues: ['thuy-trieu', 'bai-coc'],
  },
  {
    id: 'q2',
    question:
      'Ngô Quyền đã kết hợp những yếu tố nào để tạo lợi thế trước quân Nam Hán?',
    options: [
      {
        id: 'q2a',
        text: 'Quân số đông hơn và vũ khí hiện đại hơn',
        isCorrect: false,
      },
      {
        id: 'q2b',
        text: 'Liên minh với các nước láng giềng để bao vây',
        isCorrect: false,
      },
      {
        id: 'q2c',
        text: 'Bãi cọc gỗ, quy luật thủy triều, địa hình sông, và chiến thuật nhử địch',
        isCorrect: true,
      },
      {
        id: 'q2d',
        text: 'Tấn công bất ngờ vào ban đêm khi địch ngủ say',
        isCorrect: false,
      },
    ],
    correctId: 'q2c',
    explanation:
      'Chiến thắng Bạch Đằng là kết quả của sự kết hợp tài tình giữa nhiều yếu tố: bãi cọc gỗ đã chuẩn bị sẵn, quy luật lên xuống của thủy triều, địa hình sông phức tạp với nhiều nhánh phụ thuận lợi cho mai phục, và chiến thuật khiêu chiến-giả thua để nhử quân địch vào vùng cọc.',
    relatedClues: ['bai-coc', 'thuy-trieu', 'dia-hinh', 'chien-thuat'],
  },
];

export const reconstructionEvents = [
  {
    id: 'event-1',
    order: 1,
    title: 'Chuẩn bị trận địa',
    description:
      'Ngô Quyền cho đóng cọc gỗ nhọn bịt sắt xuống lòng sông Bạch Đằng và bố trí quân mai phục ở hai bên bờ.',
    icon: 'Hammer',
  },
  {
    id: 'event-2',
    order: 2,
    title: 'Nhử địch vào trận',
    description:
      'Khi triều lên, một đội quân nhỏ được phái ra khiêu chiến với quân Nam Hán rồi giả vờ thua, rút lui vào sông để dụ địch đuổi theo.',
    icon: 'Flag',
  },
  {
    id: 'event-3',
    order: 3,
    title: 'Triều rút, cọc lộ',
    description:
      'Quân Nam Hán đuổi sâu vào sông. Khi thủy triều bắt đầu rút, các cọc gỗ nhọn dần lộ ra, chặn đường rút lui và đâm thủng thuyền chiến.',
    icon: 'ArrowDown',
  },
  {
    id: 'event-4',
    order: 4,
    title: 'Phản công và chiến thắng',
    description:
      'Quân Việt từ các vị trí mai phục đồng loạt tấn công. Thuyền địch bị cọc phá hủy, quân Nam Hán đại bại. Chiến thắng này chấm dứt hơn 1000 năm Bắc thuộc.',
    icon: 'Trophy',
  },
];

export const scoring = {
  cluePoints: 10, // per clue, 4 clues = 40 points
  questionPoints: 15, // per question, 2 questions = 30 points
  reconstructionPoints: 30, // correct order on first attempt
  maxScore: 100,
  messages: {
    perfect: {
      title: 'Xuất sắc!',
      message: 'Bạn đã thể hiện khả năng suy luận lịch sử tuyệt vời! Ngô Quyền cũng sẽ tự hào về bạn.',
    },
    great: {
      title: 'Rất giỏi!',
      message: 'Bạn đã nắm vững các yếu tố quan trọng của chiến thắng Bạch Đằng. Hãy tiếp tục khám phá lịch sử!',
    },
    good: {
      title: 'Tốt lắm!',
      message: 'Bạn đã hiểu được cơ bản về trận Bạch Đằng. Hãy thử lại để tìm hiểu sâu hơn nhé!',
    },
    tryAgain: {
      title: 'Đừng bỏ cuộc!',
      message: 'Lịch sử luôn có nhiều điều thú vị chờ bạn khám phá. Hãy thử lại và chú ý kỹ hơn các Dấu Vết nhé!',
    },
  },
  getScoreMessage(score) {
    if (score >= 90) return this.messages.perfect;
    if (score >= 70) return this.messages.great;
    if (score >= 50) return this.messages.good;
    return this.messages.tryAgain;
  },
};

export const tideData = {
  high: {
    label: 'Triều lên',
    waterLevel: 85,
    description: 'Khi triều lên, mực nước dâng cao. Các cọc gỗ bị ngập hoàn toàn, không thể nhìn thấy từ mặt sông. Thuyền chiến có thể đi qua bình thường mà không phát hiện nguy hiểm.',
    stakesVisible: false,
  },
  low: {
    label: 'Triều xuống',
    waterLevel: 25,
    description: 'Khi triều xuống, mực nước hạ thấp đáng kể. Các cọc gỗ nhọn bịt sắt lộ ra khỏi mặt nước, trở thành bẫy chết người cho thuyền chiến. Thuyền bị mắc kẹt và đâm vào cọc nhọn.',
    stakesVisible: true,
  },
};

export default {
  DEMO_STAGES,
  demoIntro,
  clues,
  hypothesisQuestions,
  reconstructionEvents,
  scoring,
  tideData,
};
