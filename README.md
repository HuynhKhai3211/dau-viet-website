# Dấu Việt – Trang Web Giới Thiệu & Trải Nghiệm Tương Tác

Website chính thức giới thiệu dự án **Dấu Việt** – Nền tảng học lịch sử Việt Nam tương tác thông qua khám phá di sản, thu thập Dấu Vết, suy luận giả thuyết và tái hiện sự kiện lịch sử hào hùng.

---

## 1. Cài đặt và Chạy Thử Nghiệm Cục Bộ (Local)

### Yêu cầu hệ thống:
- **Node.js**: >= 18.0.0 (Khuyến nghị Node.js 20 hoặc 24)
- **npm**: >= 9.0.0

### Các bước khởi chạy:
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển (Development Server)
npm run dev

# 3. Mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là http://localhost:5173/)
```

### Đóng gói ứng dụng cho môi trường Production:
```bash
# Tạo thư mục dist sẵn sàng cho Cloudflare Pages
npm run build

# Xem thử nghiệm bản build trước khi upload
npm run preview
```

---

## 2. Cấu Trúc Thư Mục `dist/` & Hướng Dẫn Triển Khai Cloudflare Pages

Thư mục `dist/` sau khi chạy `npm run build` đã được tối ưu hóa toàn diện cho việc tải trực tiếp (Direct Upload) lên Cloudflare Pages mà không cần kết nối GitHub:

- **`dist/index.html`**: File HTML gốc chứa đầy đủ thẻ SEO, OpenGraph và chuẩn chữ tiếng Việt có dấu.
- **`dist/_redirects`**: File cấu hình SPA (Single Page Application) định tuyến `/* -> /index.html 200`, giúp người dùng truy cập trực tiếp các route (`/demo`, `/explore`, `/about`, `/team`, `/contact`) hoặc F5 làm mới trang mà không gặp lỗi 404.
- **`dist/assets/`**: Chứa bundle JavaScript và CSS đã được minify và nén gzip tối ưu hiệu suất.
- **`dist/images/`**: Chứa toàn bộ hình ảnh minh họa tĩnh (sa bàn lịch sử diorama 2.5D, hòn đảo cá nhân).
- **`dist/favicon.svg`**: Biểu tượng Dấu Việt phong cách chim hạc / la bàn cổ.

---

## 3. Quản Lý Nội Dung & Thay Thế Dữ Liệu (Content Management)

Dự án được kiến trúc tách biệt giữa giao diện hiển thị và dữ liệu tĩnh trong thư mục `src/data/`:

| Tệp dữ liệu | Nội dung quản lý |
|---|---|
| `src/data/historicalPeriods.js` | 4 thời kỳ lịch sử (Âu Lạc, Hai Bà Trưng, Lý Bí, Ngô Quyền), 10 bước Learning Journey, 3 cấp độ Đảo cá nhân |
| `src/data/features.js` | 6 tính năng cốt lõi của ứng dụng Dấu Việt |
| `src/data/gamification.js` | Hệ thống điểm, XP, chuỗi học tập (Streak), đóng băng chuỗi và hệ thống năng lượng 30 điểm/ngày |
| `src/data/bachDangDemo.js` | Kịch bản trận đánh Bạch Đằng 938: 4 Dấu Vết, các câu hỏi trắc nghiệm suy luận, 4 thẻ tái hiện sự kiện |
| `src/data/team.js` | Thông tin thành viên đội ngũ phát triển (họ tên, vai trò, tiểu sử, email) |

### Hướng dẫn thay thế hình ảnh:
- **Ảnh đại diện thành viên**: Thêm ảnh vào `public/images/team/` và cập nhật đường dẫn trong `src/data/team.js`.
- **Ảnh di tích & nhân vật lịch sử**: Thêm vào `public/images/historical/` và cập nhật trong `src/data/historicalPeriods.js`.
- **Ảnh hòn đảo**: Thay thế tại `public/images/islands/personal-island.png`.

---

## 4. Các Phần Nội Dung Dạng Placeholder (Cần Cập Nhật Sau)

1. **Thông tin thành viên đội ngũ (`src/data/team.js`)**: Các nhân sự hiện đang dùng thông tin minh họa đại diện (Nguyễn Văn A, Trần Thị B,...). Cần thay bằng tên thật, ảnh thật và email chính thức.
2. **Form gửi phản hồi (`/contact`)**: Hiện hoạt động ở chế độ Demo an toàn (có validation kiểm tra hợp lệ và thông báo rõ ràng cho người dùng gửi mail trực tiếp đến `contact@historydauviet.id.vn`). Khi triển khai backend hoặc form handler (ví dụ Formspree, Resend), chỉ cần tích hợp API tại `src/pages/ContactPage.jsx`.
3. **Ứng dụng di động (Android / iOS)**: Thể hiện trạng thái "Sắp ra mắt" và form nhận thông báo. Chưa có link tải kho ứng dụng.
4. **Các thời kỳ chưa có bản thử nghiệm**: Chỉ có trận Bạch Đằng 938 có bản Playable Demo hoàn chỉnh. 3 thời kỳ còn lại (Âu Lạc, Hai Bà Trưng, Lý Bí) đang hiển thị tóm lược thông tin và sự kiện lịch sử trọng tâm.

---

## 5. Danh Mục Công Nghệ

- **React 19** + **Vite 6**
- **React Router 7**
- **Lucide React** (Bộ icon giao diện)
- **CSS thuần tổ chức quy chuẩn** (CSS Variables, Responsive Breakpoints, Custom Animations, Scroll Reveal IntersectionObserver)
- **Không dùng backend hay database** (Hoàn toàn tĩnh, bảo mật tuyệt đối)
