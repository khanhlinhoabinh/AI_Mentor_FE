import bannerImage from "../../assets/banner.png";

export default function WelcomeBanner() {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div>
        <h2>Chào mừng trở lại 👋</h2>

        <p>Hôm nay bạn muốn học gì nào?</p>

        <div className="quote-box">
          "Bạn không cần phải giỏi ngay từ đầu,
          nhưng bạn phải bắt đầu để trở nên giỏi hơn mỗi ngày."
        </div>
      </div>
    </div>
  );
}