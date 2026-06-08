import { useNavigate } from "react-router-dom";
import { X, Sparkles, ArrowRight } from "lucide-react";
import styles from "../../styles/CreateSubjectModal.module.css";

export default function LoginRequiredModal({
    onClose,
    title,
    subtitle,
}) {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        onClose();
        navigate("/login");
    };

    // Click ra ngoài modal thì đóng
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>

                {/* Nút đóng */}
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Illustration */}
                <div className={styles.illustration}>
                    <span className={styles.sparkle} style={{ top: "8%", left: "18%", color: "#a78bfa" }}>✦</span>
                    <span className={styles.sparkle} style={{ top: "5%", right: "22%", color: "#34c759", animationDelay: "0.4s" }}>✦</span>
                    <span className={styles.sparkle} style={{ bottom: "15%", left: "8%", color: "#ffa726", animationDelay: "0.8s" }}>✦</span>

                    {/* Box màu cam */}
                    <div style={{
                        position: "absolute", left: 16, bottom: 16,
                        width: 60, height: 55,
                        background: "linear-gradient(135deg, #ffa726, #ff8c00)",
                        borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                        boxShadow: "0 6px 16px rgba(255,140,0,0.3)"
                    }}>✦</div>

                    {/* Bot */}
                    <div style={{
                        position: "absolute", right: 20, bottom: 12,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4
                    }}>
                        <div style={{
                            width: 54, height: 54,
                            background: "linear-gradient(135deg, #fff, #e8f4fd)",
                            borderRadius: "50%",
                            border: "3px solid #34c759",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            boxShadow: "0 4px 12px rgba(52,199,89,0.2)",
                            position: "relative"
                        }}>
                            <div style={{ width: 8, height: 8, background: "#1a1a2e", borderRadius: "50%" }} />
                            <div style={{ width: 8, height: 8, background: "#1a1a2e", borderRadius: "50%" }} />
                            {/* Tai bot */}
                            <div style={{
                                position: "absolute", top: 6, right: -5,
                                width: 8, height: 20,
                                background: "#34c759", borderRadius: 4
                            }} />
                        </div>
                    </div>
                </div>

                {/* Text */}
                <h2 className={styles.title}>
                    {title}
                </h2>

                <p className={styles.subtitle}>
                    {subtitle}
                </p>

                {/* 3 feature icons */}
                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon} style={{ background: "rgba(52,199,89,0.12)" }}>
                            📋
                        </div>
                        <span className={styles.featureLabel}>Quản lý môn học<br />dễ dàng</span>
                    </div>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon} style={{ background: "rgba(120,86,255,0.12)" }}>
                            ✨
                        </div>
                        <span className={styles.featureLabel}>Học tập thông minh<br />cùng AI</span>
                    </div>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon} style={{ background: "rgba(255,159,10,0.12)" }}>
                            📊
                        </div>
                        <span className={styles.featureLabel}>Theo dõi tiến độ<br />hiệu quả</span>
                    </div>
                </div>

                {/* Nút đăng nhập */}
                <button className={styles.loginBtn} onClick={handleLoginClick}>
                    <Sparkles size={16} />
                    Đăng nhập ngay
                    <ArrowRight size={16} />
                </button>



            </div>
        </div>
    );
}