import { Question, QuestionCategory } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  // --- ĐỊA LÝ TỰ NHIÊN VIỆT NAM ---
  {
    id: 'geo-vn-01',
    question: 'Đỉnh núi nào được mệnh danh là "Nóc nhà của Đông Dương"?',
    options: ['Fansipan', 'Pu Si Lung', 'Bạch Mộc Lương Tử', 'Tây Côn Lĩnh'],
    correctIndex: 0,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Đỉnh Fansipan cao 3.143m thuộc dãy Hoàng Liên Sơn, là đỉnh núi cao nhất Việt Nam và cả 3 nước Đông Dương.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-02',
    question: 'Đường bờ biển của Việt Nam có chiều dài khoảng bao nhiêu km?',
    options: ['2.360 km', '3.260 km', '3.444 km', '4.200 km'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Đường bờ biển Việt Nam dài khoảng 3.260 km, trải dài từ Móng Cái (Quảng Ninh) đến Hà Tiên (Kiên Giang).',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-03',
    question: 'Điểm cực Đông trên đất liền của nước ta thuộc tỉnh nào?',
    options: ['Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Điểm cực Đông trên đất liền nằm tại Mũi Đôi, bán đảo Hòn Gốm, huyện Vạn Ninh, tỉnh Khánh Hòa (kinh độ 109°24\'Đ).',
    difficulty: 'medium'
  },
  {
    id: 'geo-vn-04',
    question: 'Điểm cực Bắc trên đất liền của Việt Nam nằm ở xã Lũng Cú thuộc tỉnh nào?',
    options: ['Cao Bằng', 'Hà Giang', 'Lào Cai', 'Lạng Sơn'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang (vĩ độ 23°23\'B) là điểm cực Bắc trên đất liền của Tổ quốc.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-05',
    question: 'Đảo có diện tích lớn nhất Việt Nam là đảo nào?',
    options: ['Cát Bà', 'Côn Đảo', 'Phú Quốc', 'Lý Sơn'],
    correctIndex: 2,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Đảo Phú Quốc (tỉnh Kiên Giang) có diện tích khoảng 589 km², là hòn đảo lớn nhất nước ta.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-06',
    question: 'Đặc trưng cơ bản của khí hậu Việt Nam là gì?',
    options: [
      'Nhiệt đới khô hạn',
      'Ôn đới lục địa gió mùa',
      'Nhiệt đới ẩm gió mùa',
      'Cận xích đạo khô nóng'
    ],
    correctIndex: 2,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Khí hậu Việt Nam mang tính chất nhiệt đới ẩm gió mùa do nằm hoàn toàn trong vùng nội chí tuyến và chịu ảnh hưởng sâu sắc của Biển Đông.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-07',
    question: 'Gió mùa Đông Bắc hoạt động chủ yếu ở miền nào của nước ta?',
    options: ['Miền Nam', 'Miền Bắc và Bắc Trung Bộ', 'Tây Nguyên', 'Duyên hải Nam Trung Bộ'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Gió mùa Đông Bắc (bắt nguồn từ cao áp Xibia) hoạt động từ tháng 11 đến tháng 4 năm sau ở miền Bắc và Bắc Trung Bộ tạo nên mùa đông lạnh.',
    difficulty: 'medium'
  },
  {
    id: 'geo-vn-08',
    question: 'Dãy núi nào đóng vai trò là ranh giới tự nhiên giữa miền Bắc và miền Nam về mặt khí hậu?',
    options: ['Dãy Hoàng Liên Sơn', 'Dãy Trường Sơn Bắc', 'Dãy Bạch Mã', 'Dãy Hoành Sơn'],
    correctIndex: 2,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Dãy Bạch Mã (khoảng vĩ tuyến 16°B) ngăn gió mùa Đông Bắc tràn sâu xuống phía Nam, tạo ra ranh giới khí hậu rõ rệt.',
    difficulty: 'medium'
  },
  {
    id: 'geo-vn-09',
    question: 'Sông Mê Kông khi chảy vào lãnh thổ Việt Nam chia thành hai nhánh chính là gì?',
    options: [
      'Sông Tiền và Sông Hậu',
      'Sông Hồng và Sông Đáy',
      'Sông Đồng Nai và Sông Sài Gòn',
      'Sông Ba và Sông Thu Bồn'
    ],
    correctIndex: 0,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Khi vào Việt Nam, sông Mê Kông tách làm hai dòng lớn là sông Tiền và sông Hậu bồi đắp nên đồng bằng sông Cửu Long trù phú.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-10',
    question: 'Hồ nước ngọt tự nhiên lớn nhất Việt Nam là hồ nào?',
    options: ['Hồ Ba Bể', 'Hồ Tây', 'Hồ Dầu Tiếng', 'Hồ Thác Bà'],
    correctIndex: 0,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Hồ Ba Bể (tỉnh Bắc Kạn) là hồ nước ngọt tự nhiên trên núi đá vôi lớn nhất Việt Nam.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-11',
    question: 'Địa hình nước ta chủ yếu là dạng địa hình nào chiếm tới 3/4 diện tích lãnh thổ?',
    options: ['Đồng bằng châu thổ', 'Đồi núi', 'Bán bình nguyên', 'Núi lửa cổ'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Đồi núi chiếm tới 3/4 diện tích lãnh thổ Việt Nam, nhưng chủ yếu là đồi núi thấp dưới 1.000m (chiếm 85%).',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-12',
    question: 'Vịnh biển nào của Việt Nam hai lần được UNESCO công nhận là Di sản thiên nhiên thế giới?',
    options: ['Vịnh Nha Trang', 'Vịnh Hạ Long', 'Vịnh Lăng Cô', 'Vịnh Cam Ranh'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Vịnh Hạ Long (Quảng Ninh) được UNESCO công nhận Di sản thiên nhiên thế giới năm 1994 (về cảnh quan) và năm 2000 (về địa chất, địa mạo).',
    difficulty: 'easy'
  },

  // --- ĐỊA LÝ KINH TẾ - XÃ HỘI VIỆT NAM ---
  {
    id: 'geo-vne-01',
    question: 'Vùng nào là vựa lúa và vùng sản xuất thủy sản lớn nhất nước ta?',
    options: ['Đồng bằng sông Hồng', 'Bắc Trung Bộ', 'Đồng bằng sông Cửu Long', 'Duyên hải Nam Trung Bộ'],
    correctIndex: 2,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Đồng bằng sông Cửu Long đóng góp trên 50% sản lượng lúa và trên 60% sản lượng thủy sản xuất khẩu của cả nước.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vne-02',
    question: 'Cây cà phê được trồng nhiều nhất ở vùng kinh tế nào của nước ta?',
    options: ['Tây Nguyên', 'Trung du và miền núi Bắc Bộ', 'Bắc Trung Bộ', 'Đông Nam Bộ'],
    correctIndex: 0,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Tây Nguyên với đất đỏ bazan màu mỡ và khí hậu cận xích đạo là vùng chuyên canh cà phê lớn nhất Việt Nam (đặc biệt là Đắk Lắk).',
    difficulty: 'easy'
  },
  {
    id: 'geo-vne-03',
    question: 'Việt Nam hiện có bao nhiêu dân tộc cùng sinh sống?',
    options: ['52 dân tộc', '54 dân tộc', '56 dân tộc', '64 dân tộc'],
    correctIndex: 1,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Việt Nam là quốc gia đa dân tộc với 54 dân tộc anh em cùng sinh sống đoàn kết, trong đó dân tộc Kinh chiếm đa số (khoảng 85%).',
    difficulty: 'easy'
  },
  {
    id: 'geo-vne-04',
    question: 'Bể than đá lớn nhất và chất lượng tốt nhất nước ta phân bố ở tỉnh nào?',
    options: ['Thái Nguyên', 'Quảng Ninh', 'Lạng Sơn', 'Nghệ An'],
    correctIndex: 1,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Quảng Ninh là trung tâm khai thác than đá (than antraxít) lớn nhất Việt Nam, trữ lượng hàng tỉ tấn.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vne-05',
    question: 'Loại đất chiếm diện tích lớn nhất và có giá trị kinh tế cao ở vùng Tây Nguyên là gì?',
    options: ['Đất phù sa ngọt', 'Đất đỏ bazan', 'Đất phèn mặn', 'Đất xám bạc màu'],
    correctIndex: 1,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Đất feralit phát triển trên đá bazan tầng dày, tơi xốp rất thích hợp phát triển cây công nghiệp lâu năm như cà phê, cao su, hồ tiêu.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vne-06',
    question: 'Nhà máy thủy điện Sơn La - công trình thủy điện lớn nhất Đông Nam Á - được xây dựng trên con sông nào?',
    options: ['Sông Hồng', 'Sông Đà', 'Sông Lô', 'Sông Chảy'],
    correctIndex: 1,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Thủy điện Sơn La có công suất 2.400 MW, được xây dựng trên dòng sông Đà hùng vĩ.',
    difficulty: 'medium'
  },
  {
    id: 'geo-vne-07',
    question: 'Vùng kinh tế dẫn đầu cả nước về giá trị sản xuất công nghiệp và thu hút vốn đầu tư nước ngoài (FDI) là gì?',
    options: ['Đồng bằng sông Hồng', 'Đông Nam Bộ', 'Đồng bằng sông Cửu Long', 'Bắc Trung Bộ'],
    correctIndex: 1,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Đông Nam Bộ (với hạt nhân TP. Hồ Chí Minh, Bình Dương, Đồng Nai...) là vùng kinh tế năng động nhất cả nước.',
    difficulty: 'medium'
  },
  {
    id: 'geo-vne-08',
    question: 'Tỉnh nào ở nước ta có đường bờ biển dài nhất (khoảng 385 km)?',
    options: ['Khánh Hòa', 'Quảng Ninh', 'Bình Thuận', 'Cà Mau'],
    correctIndex: 0,
    category: 'vietnam_economy',
    categoryName: 'Kinh tế - Xã hội VN',
    explanation: 'Khánh Hòa có đường bờ biển dài khoảng 385 km với nhiều vũng, vịnh kín gió nước sâu như vịnh Cam Ranh, vịnh Vân Phong.',
    difficulty: 'hard'
  },

  // --- ĐỊA LÝ THẾ GIỚI & CHÂU LỤC ---
  {
    id: 'geo-wld-01',
    question: 'Châu lục nào có diện tích và dân số lớn nhất thế giới?',
    options: ['Châu Phi', 'Châu Mỹ', 'Châu Á', 'Châu Âu'],
    correctIndex: 2,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Châu Á có diện tích khoảng 44,58 triệu km² và dân số hơn 4,7 tỷ người, lớn nhất trong các châu lục.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-02',
    question: 'Đại dương nào có diện tích lớn nhất và sâu nhất trên Trái Đất?',
    options: ['Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương', 'Thái Bình Dương'],
    correctIndex: 3,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Thái Bình Dương chiếm hơn 30% bề mặt Trái Đất, nơi có rãnh vực Mariana sâu nhất (khoảng 11.034m).',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-03',
    question: 'Sa mạc cát nóng nhiệt đới lớn nhất thế giới là sa mạc nào?',
    options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Sa mạc Sahara nằm ở Bắc Phi với diện tích hơn 9 triệu km², là hoang mạc cát nhiệt đới lớn nhất hành tinh.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-04',
    question: 'Con sông nào có lưu lượng nước lớn nhất thế giới và sở hữu lưu vực rộng lớn nhất?',
    options: ['Sông Nile', 'Sông Amazon', 'Sông Dương Tử', 'Sông Mississippi'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Sông Amazon ở Nam Mỹ cung cấp khoảng 20% tổng lượng nước ngọt chảy ra đại dương trên toàn thế giới.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-05',
    question: 'Sông dài nhất thế giới theo thống kê truyền thống thuộc về con sông nào?',
    options: ['Sông Amazon', 'Sông Nile', 'Sông Mê Kông', 'Sông Volga'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Sông Nile ở châu Phi dài khoảng 6.650 km, chảy qua 11 quốc gia và đổ ra Địa Trung Hải.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-06',
    question: 'Kênh đào nhân tạo nào nối liền Địa Trung Hải với Biển Đỏ, rút ngắn hải trình giữa châu Âu và châu Á?',
    options: ['Kênh đào Panama', 'Kênh đào Suez', 'Kênh đào Kiel', 'Kênh đào Corinth'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Kênh đào Suez (thuộc Ai Cập) mở năm 1869 là tuyến hàng hải huyết mạch giữa Đại Tây Dương và Ấn Độ Dương.',
    difficulty: 'medium'
  },
  {
    id: 'geo-wld-07',
    question: 'Dãy núi trẻ nào dài nhất trên cạn chạy dọc bờ tây lục địa Nam Mỹ?',
    options: ['Dãy Rocky', 'Dãy Andes', 'Dãy Himalaya', 'Dãy Alps'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Dãy núi Andes dài hơn 7.000 km trải dài qua 7 quốc gia Nam Mỹ.',
    difficulty: 'medium'
  },
  {
    id: 'geo-wld-08',
    question: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?',
    options: ['Canada', 'Hoa Kỳ', 'Trung Quốc', 'Liên bang Nga'],
    correctIndex: 3,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Liên bang Nga trải dài trên cả 2 châu lục Á - Âu với diện tích hơn 17,1 triệu km².',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-09',
    question: 'Quốc gia nào được gọi là "Đất nước vạn đảo" với hơn 17.000 hòn đảo lớn nhỏ?',
    options: ['Philippines', 'Indonesia', 'Nhật Bản', 'Hy Lạp'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Indonesia là quốc gia quần đảo lớn nhất thế giới với hơn 17.500 hòn đảo.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-10',
    question: 'Hồ nước ngọt sâu nhất và có thể tích nước ngọt lớn nhất thế giới là hồ nào?',
    options: ['Hồ Superior (Hồ Thượng)', 'Hồ Baikal', 'Hồ Victoria', 'Hồ Michigan'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Hồ Baikal ở Nga sâu đến 1.642m và chứa khoảng 20% lượng nước ngọt không bị đóng băng trên bề mặt thế giới.',
    difficulty: 'medium'
  },

  // --- TRÁI ĐẤT, KHÍ HẬU & BẢN ĐỒ ---
  {
    id: 'geo-clm-01',
    question: 'Kinh tuyến gốc (0°) quy ước quốc tế đi qua đài thiên văn nào?',
    options: ['Paris (Pháp)', 'Greenwich (Vương quốc Anh)', 'Washington (Mỹ)', 'Berlin (Đức)'],
    correctIndex: 1,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Kinh tuyến 0° đi qua Đài thiên văn Hoàng gia Greenwich ở Luân Đôn, Anh, làm mốc chia Trái Đất thành bán cầu Đông và bán cầu Tây.',
    difficulty: 'easy'
  },
  {
    id: 'geo-clm-02',
    question: 'Việt Nam nằm trong múi giờ số mấy tính theo giờ chuẩn GMT (UTC)?',
    options: ['GMT+6', 'GMT+7', 'GMT+8', 'GMT+9'],
    correctIndex: 1,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Việt Nam, Lào, Campuchia và Thái Lan nằm trọn trong múi giờ thứ 7 (GMT+7).',
    difficulty: 'easy'
  },
  {
    id: 'geo-clm-03',
    question: 'Hiện tượng ngày và đêm luân phiên trên Trái Đất là hệ quả của chuyển động nào?',
    options: [
      'Trái Đất quay quanh Mặt Trời',
      'Mặt Trăng quay quanh Trái Đất',
      'Trái Đất tự quay quanh trục của nó',
      'Mặt Trời di chuyển quanh dải Ngân Hà'
    ],
    correctIndex: 2,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Do Trái Đất có dạng hình cầu và tự quay quanh trục từ Tây sang Đông theo chu kỳ 24 giờ nên tạo ra hiện tượng ngày và đêm luân phiên.',
    difficulty: 'easy'
  },
  {
    id: 'geo-clm-04',
    question: 'Các mùa trong năm (Xuân, Hạ, Thu, Đông) sinh ra chủ yếu do nguyên nhân nào?',
    options: [
      'Khoảng cách giữa Trái Đất và Mặt Trời thay đổi',
      'Trục Trái Đất nghiêng và không đổi phương khi chuyển động quanh Mặt Trời',
      'Hoạt động của các vết đen trên bề mặt Mặt Trời',
      'Sự thay đổi của dòng hải lưu nóng và lạnh'
    ],
    correctIndex: 1,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Khi Trái Đất chuyển động quanh Mặt Trời, trục Trái Đất luôn nghiêng 66°33\' so với mặt phẳng quỹ đạo và không đổi phương, làm hai bán cầu luân phiên chúc về phía Mặt Trời.',
    difficulty: 'medium'
  },
  {
    id: 'geo-clm-05',
    question: 'Vĩ tuyến lớn nhất chia Trái Đất thành hai bán cầu Bắc và Nam là đường nào?',
    options: ['Chí tuyến Bắc', 'Chí tuyến Nam', 'Xích đạo (Vĩ tuyến 0°)', 'Vòng cực Bắc'],
    correctIndex: 2,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Đường Xích đạo là vĩ tuyến 0°, có chu vi khoảng 40.075 km, là ranh giới chia nửa bán cầu Bắc và bán cầu Nam.',
    difficulty: 'easy'
  },
  {
    id: 'geo-clm-06',
    question: 'Trên bản đồ có tỉ lệ 1 : 1.000.000, khoảng cách 2 cm trên bản đồ tương ứng ngoài thực địa là bao nhiêu?',
    options: ['2 km', '20 km', '200 km', '2.000 km'],
    correctIndex: 1,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: '2 cm × 1.000.000 = 2.000.000 cm = 20.000 m = 20 km trên thực địa.',
    difficulty: 'medium'
  },
  {
    id: 'geo-clm-07',
    question: 'Lớp vỏ khí bao quanh Trái Đất bao gồm tầng nào sát mặt đất nhất - nơi diễn ra hầu hết các hiện tượng thời tiết như mây, mưa, sấm sét?',
    options: ['Tầng đối lưu', 'Tầng bình lưu', 'Tầng trung lưu', 'Tầng nhiệt'],
    correctIndex: 0,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Tầng đối lưu có độ dày từ 0 đến khoảng 16 km, chứa 80% khối lượng khí quyển và hầu hết hơi nước, sinh ra mọi hiện tượng thời tiết.',
    difficulty: 'medium'
  },

  // --- THỦ ĐÔ & QUỐC GIA ---
  {
    id: 'geo-cap-01',
    question: 'Thủ đô của nước Cộng hòa Dân chủ Nhân dân Lào là thành phố nào?',
    options: ['Luông Pha-bang', 'Viêng Chăn', 'Pắc-xế', 'Savannakhet'],
    correctIndex: 1,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Viêng Chăn (Vientiane) là thủ đô và thành phố lớn nhất của đất nước láng giềng Lào.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-02',
    question: 'Thủ đô của Vương quốc Campuchia là thành phố nào?',
    options: ['Xiêm Riệp', 'Battambang', 'Phnôm Pênh', 'Sihanoukville'],
    correctIndex: 2,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Phnôm Pênh (Phnom Penh) nằm tại ngã ba sông Mê Kông và Tonle Sap, là thủ đô của Campuchia.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-03',
    question: 'Thủ đô của nước Úc (Australia) là thành phố nào?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correctIndex: 2,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Canberra được chọn làm thủ đô của Úc vào năm 1908 như một thỏa hiệp giữa hai thành phố lớn nhất là Sydney và Melbourne.',
    difficulty: 'medium'
  },
  {
    id: 'geo-cap-04',
    question: 'Thủ đô của Canada là thành phố nào?',
    options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    correctIndex: 3,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Ottawa thuộc tỉnh Ontario là thủ đô liên bang của Canada.',
    difficulty: 'medium'
  },
  {
    id: 'geo-cap-05',
    question: 'Đất nước nào ở châu Á có thủ đô là Tokyo?',
    options: ['Hàn Quốc', 'Nhật Bản', 'Triều Tiên', 'Mông Cổ'],
    correctIndex: 1,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Tokyo là thủ đô và trung tâm kinh tế, văn hóa sầm uất bậc nhất của Nhật Bản.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-06',
    question: 'Thủ đô của Vương quốc Thái Lan là gì?',
    options: ['Chiang Mai', 'Pattaya', 'Phuket', 'Bangkok (Krung Thep Maha Nakhon)'],
    correctIndex: 3,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Bangkok là thủ đô của Thái Lan, nổi tiếng với tên địa phương là Krung Thep.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-07',
    question: 'Quốc gia nào sau đây KHÔNG giáp biển ở khu vực Đông Nam Á?',
    options: ['Campuchia', 'Lào', 'Myanmar', 'Brunei'],
    correctIndex: 1,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Lào là quốc gia duy nhất trong 11 nước Đông Nam Á không có đường bờ biển.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-08',
    question: 'Thủ đô của Hợp chủng quốc Hoa Kỳ (Mỹ) là thành phố nào?',
    options: ['New York', 'Los Angeles', 'Washington, D.C.', 'Chicago'],
    correctIndex: 2,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Washington, D.C. là đặc khu liên bang và thủ đô của Hoa Kỳ, đặt theo tên Tổng thống George Washington.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-09',
    question: 'Thủ đô của nước Nga là thành phố nào?',
    options: ['Saint Petersburg', 'Kazan', 'Novosibirsk', 'Moskva (Moscow)'],
    correctIndex: 3,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Moskva là thủ đô lịch sử và trung tâm chính trị của nước Nga với Quảng trường Đỏ và Điện Kremlin.',
    difficulty: 'easy'
  },
  {
    id: 'geo-cap-10',
    question: 'Thủ đô của Myanmar là thành phố nào?',
    options: ['Yangon', 'Mandalay', 'Naypyidaw', 'Bagan'],
    correctIndex: 2,
    category: 'capitals_flags',
    categoryName: 'Thủ đô & Quốc gia',
    explanation: 'Naypyidaw được chọn làm thủ đô hành chính của Myanmar từ năm 2005 thay thế cho thành phố Yangon.',
    difficulty: 'medium'
  },

  // --- BỔ SUNG CÂU HỎI HẤP DẪN ---
  {
    id: 'geo-vn-13',
    question: 'Tỉnh nào của Việt Nam vừa có đường biên giới giáp Lào, vừa giáp Campuchia?',
    options: ['Gia Lai', 'Kon Tum', 'Đắk Nông', 'Quảng Nam'],
    correctIndex: 1,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Ngã ba Đông Dương nằm tại cửa khẩu Bờ Y, huyện Ngọc Hồi, tỉnh Kon Tum - nơi một tiếng gà gáy cả 3 nước cùng nghe.',
    difficulty: 'medium'
  },
  {
    id: 'geo-vn-14',
    question: 'Hang động tự nhiên lớn nhất thế giới nằm tại vườn quốc gia Phong Nha - Kẻ Bàng (Quảng Bình) là hang nào?',
    options: ['Hang Én', 'Động Thiên Đường', 'Hang Sơn Đoòng', 'Động Phong Nha'],
    correctIndex: 2,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Hang Sơn Đoòng được phát hiện năm 2009, có thể tích ước tính 38,5 triệu m³, là hang động tự nhiên lớn nhất thế giới.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-11',
    question: 'Châu Nam Cực nổi tiếng với đặc điểm khí hậu nào nổi bật nhất?',
    options: ['Châu lục nóng nhất', 'Châu lục ẩm ướt nhất', 'Châu lục lạnh nhất và nhiều gió bão nhất', 'Châu lục có nhiều rừng rậm nhất'],
    correctIndex: 2,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Châu Nam Cực gần như bị băng tuyết bao phủ vĩnh viễn, nhiệt độ có nơi xuống dưới -89°C, là châu lục lạnh nhất thế giới.',
    difficulty: 'easy'
  },
  {
    id: 'geo-wld-12',
    question: 'Rừng mưa nhiệt đới Amazon nằm chủ yếu trên lãnh thổ quốc gia nào ở Nam Mỹ?',
    options: ['Argentina', 'Brazil', 'Chile', 'Colombia'],
    correctIndex: 1,
    category: 'world_geo',
    categoryName: 'Địa lý Thế giới',
    explanation: 'Khoảng 60% diện tích rừng Amazon nằm trong lãnh thổ của Brazil, được coi là "lá phổi xanh" của hành tinh.',
    difficulty: 'easy'
  },
  {
    id: 'geo-vn-15',
    question: 'Huyện đảo Hoàng Sa và Huyện đảo Trường Sa lần lượt thuộc quyền quản lý hành chính của thành phố/tỉnh nào?',
    options: [
      'Đà Nẵng và Khánh Hòa',
      'Quảng Ngãi và Kiên Giang',
      'Bình Thuận và Bà Rịa - Vũng Tàu',
      'Thừa Thiên Huế và Bình Định'
    ],
    correctIndex: 0,
    category: 'vietnam_nature',
    categoryName: 'Địa lý Tự nhiên VN',
    explanation: 'Huyện đảo Hoàng Sa trực thuộc thành phố Đà Nẵng, và Huyện đảo Trường Sa trực thuộc tỉnh Khánh Hòa.',
    difficulty: 'easy'
  },
  {
    id: 'geo-clm-08',
    question: 'Vòng đai núi lửa và động đất lớn nhất thế giới bao quanh đại dương nào?',
    options: ['Đại Tây Dương', 'Thái Bình Dương (Vành đai lửa Thái Bình Dương)', 'Ấn Độ Dương', 'Bắc Băng Dương'],
    correctIndex: 1,
    category: 'climate_earth',
    categoryName: 'Trái Đất & Bản đồ',
    explanation: 'Vành đai lửa Thái Bình Dương có hình móng ngựa dài 40.000 km, tập trung hơn 75% núi lửa đang hoạt động và 90% trận động đất của thế giới.',
    difficulty: 'easy'
  }
];

const FULL_STORAGE_KEY = 'keo_co_geo_questions_db_v1';

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(FULL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Also check legacy storage key if present
    const legacyRaw = localStorage.getItem('keo_co_geo_custom_questions');
    if (legacyRaw) {
      const legacyCustom = JSON.parse(legacyRaw);
      if (Array.isArray(legacyCustom) && legacyCustom.length > 0) {
        const merged = [...DEFAULT_QUESTIONS, ...legacyCustom];
        localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.error('Error reading stored questions', e);
  }
  // Initialize with DEFAULT_QUESTIONS
  try {
    localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(DEFAULT_QUESTIONS));
  } catch (e) {
    console.error('Error saving initial default questions', e);
  }
  return DEFAULT_QUESTIONS;
}

export function saveCustomQuestion(q: Omit<Question, 'id'>): Question {
  const newQ: Question = {
    ...q,
    id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
  };
  try {
    const current = getStoredQuestions();
    const updated = [newQ, ...current];
    localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom question', e);
  }
  return newQ;
}

export function updateStoredQuestion(id: string, updatedFields: Partial<Question>): Question | null {
  try {
    const current = getStoredQuestions();
    const idx = current.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    const updatedQ: Question = { ...current[idx], ...updatedFields };
    current[idx] = updatedQ;
    localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(current));
    return updatedQ;
  } catch (e) {
    console.error('Error updating stored question', e);
    return null;
  }
}

export function deleteStoredQuestion(id: string): boolean {
  try {
    const current = getStoredQuestions();
    const filtered = current.filter((q) => q.id !== id);
    localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Error deleting stored question', e);
    return false;
  }
}

export function resetQuestionsToDefault(): Question[] {
  try {
    localStorage.setItem(FULL_STORAGE_KEY, JSON.stringify(DEFAULT_QUESTIONS));
    localStorage.removeItem('keo_co_geo_custom_questions');
  } catch (e) {
    console.error('Error resetting questions to default', e);
  }
  return DEFAULT_QUESTIONS;
}
