import { useState } from 'react';
import { ArrowUpRight, Smartphone } from 'lucide-react';

const signupEmail = 'contact@historydauviet.id.vn';

export default function EarlyAccessSignup() {
  const [prepared, setPrepared] = useState(false);

  const register = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      'Xin chào Dấu Việt, mình muốn đăng ký trải nghiệm app sớm.',
      '',
      `Họ tên: ${data.get('name').trim() || 'Chưa cung cấp'}`,
      `Email nhận thông tin: ${data.get('email').trim()}`,
      `Thiết bị: ${data.get('platform')}`,
      '',
      'Hãy thông báo cho mình khi có đợt trải nghiệm app. Cảm ơn nhóm!',
    ].join('\n');
    window.location.href = `mailto:${signupEmail}?subject=${encodeURIComponent('Đăng ký trải nghiệm app Dấu Việt sớm')}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  };

  return <article className="early-access" aria-labelledby="early-access-title">
    <div className="early-access__intro">
      <span className="early-access__eyebrow"><Smartphone size={17} aria-hidden="true" /> HẸN GẶP BẠN TRÊN APP</span>
      <h3 id="early-access-title">Đăng ký trải nghiệm app sớm</h3>
      <p>Cùng Dấu Việt mở chương tiếp theo. Để lại email để nhận thông tin khi đợt trải nghiệm ứng dụng bắt đầu.</p>
      <span className="early-access__signature">Chạm vào quá khứ.<br />Hiểu Việt Nam hôm nay.</span>
    </div>
    <form className="early-access__form" onSubmit={register}>
      <div className="early-access__fields">
        <label htmlFor="early-access-name">Họ và tên <span>(không bắt buộc)</span><input id="early-access-name" name="name" autoComplete="name" maxLength={100} placeholder="Tên của bạn" /></label>
        <label htmlFor="early-access-email">Email của bạn <span aria-hidden="true">*</span><input id="early-access-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="ban@example.com" /></label>
      </div>
      <label htmlFor="early-access-platform">Bạn muốn trải nghiệm trên thiết bị nào?<select id="early-access-platform" name="platform" defaultValue="Chưa xác định"><option value="Chưa xác định">Chưa xác định</option><option value="Android">Android</option><option value="iOS">iPhone / iPad (iOS)</option></select></label>
      <button type="submit" className="heritage-ticket heritage-ticket--compact">Đăng ký trải nghiệm sớm <ArrowUpRight size={17} aria-hidden="true" /></button>
      <p className="early-access__note" id="early-access-help">Nút đăng ký mở ứng dụng email với thông tin đã điền. Nhấn Gửi trong email để hoàn tất đăng ký.</p>
      {prepared && <p className="early-access__status" role="status">Email đăng ký đã được soạn sẵn. Bạn hãy nhấn Gửi để hoàn tất. Nếu ứng dụng email chưa mở, gửi thông tin đến <a href={`mailto:${signupEmail}`}>{signupEmail}</a>.</p>}
    </form>
  </article>;
}
