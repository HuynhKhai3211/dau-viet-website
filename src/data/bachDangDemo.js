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
    id: 'ngo-quyen',
    number: 2,
    title: 'Ngô Quyền',
    icon: 'UserRound',
    shortDescription: 'Người lãnh đạo trận Bạch Đằng năm 938',
    fullDescription:
      'Ngô Quyền là người lãnh đạo quân ta đánh bại quân Nam Hán trên sông Bạch Đằng năm 938. Ông chủ động chọn chiến trường và chuẩn bị kế hoạch đón đánh quân xâm lược.',
    detail:
      'Hãy tìm hiểu vai trò của người chỉ huy, rồi liên hệ với điều bạn đã quan sát được trong tương tác thủy triều.',
    explorationFacts: [
      { name: 'Người chỉ huy', tag: 'Nhân vật lịch sử', desc: 'Ngô Quyền trực tiếp tổ chức cuộc kháng chiến chống quân Nam Hán năm 938.' },
      { name: 'Cách tổ chức trận đánh', tag: 'Chủ động chuẩn bị', desc: 'Ông kết hợp việc chọn địa điểm, nắm quy luật con nước và bố trí lực lượng để tạo lợi thế.' },
      { name: 'Ý nghĩa chiến thắng', tag: 'Bước ngoặt lịch sử', desc: 'Chiến thắng Bạch Đằng góp phần kết thúc thời kỳ Bắc thuộc, mở ra thời kỳ độc lập tự chủ lâu dài.' },
    ],
    interactionType: 'facts',
    position: { x: 50, y: 55 },
  },
  {
    id: 'dia-hinh',
    number: 3,
    title: 'Sông Bạch Đằng',
    icon: 'MapPin',
    shortDescription: 'Địa điểm diễn ra trận thủy chiến năm 938',
    fullDescription:
      'Sông Bạch Đằng là cửa ngõ đường biển ở vùng đông bắc nước ta. Năm 938, Ngô Quyền chọn nơi đây làm chiến trường đón đánh thủy quân Nam Hán.',
    detail:
      'Quan sát mối liên hệ giữa cửa biển, các nhánh sông và hai bờ để hiểu vì sao địa điểm này có lợi cho quân ta.',
    explorationFacts: [
      { name: 'Cửa ngõ đường biển', tag: 'Đường tiến quân', desc: 'Thủy quân Nam Hán từ biển tiến vào sông Bạch Đằng.' },
      { name: 'Các nhánh sông', tag: 'Địa hình sông nước', desc: 'Nhiều nhánh sông và cây cối ven bờ tạo điều kiện bố trí lực lượng mai phục.' },
      { name: 'Vùng chịu thủy triều', tag: 'Liên hệ Dấu 1', desc: 'Sự thay đổi mực nước là yếu tố tự nhiên quan trọng của chiến trường. Hãy quay lại Dấu 1 để quan sát.' },
    ],
    interactionType: 'facts',
    position: { x: 75, y: 30 },
  },
  {
    id: 'nam-han',
    number: 4,
    title: 'Quân Nam Hán',
    icon: 'Swords',
    shortDescription: 'Đối thủ của quân ta trong trận Bạch Đằng năm 938',
    fullDescription:
      'Năm 938, quân Nam Hán đưa thủy quân sang xâm lược nước ta. Đạo quân do Lưu Hoằng Tháo chỉ huy tiến vào sông Bạch Đằng và đối đầu với lực lượng của Ngô Quyền.',
    detail:
      'Tìm hiểu đường tiến quân và cách phản ứng của đối thủ để suy luận vì sao kế nghi binh của Ngô Quyền có hiệu quả.',
    explorationFacts: [
      { name: 'Lực lượng xâm lược', tag: 'Nhận diện đối thủ', desc: 'Quân Nam Hán sử dụng chiến thuyền vượt biển tiến vào nước ta.' },
      { name: 'Lưu Hoằng Tháo', tag: 'Chỉ huy thủy quân', desc: 'Lưu Hoằng Tháo, con vua Nam Hán, được giao chỉ huy đạo quân thủy.' },
      { name: 'Đuổi theo thuyền nhẹ', tag: 'Phản ứng của đối thủ', desc: 'Khi quân ta khiêu chiến rồi rút lui, quân Nam Hán đuổi theo và tiến sâu vào trận địa đã được chuẩn bị.' },
    ],
    interactionType: 'facts',
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
    relatedClues: ['thuy-trieu', 'ngo-quyen'],
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
    relatedClues: ['thuy-trieu', 'ngo-quyen', 'dia-hinh', 'nam-han'],
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
