
import {
  FaUsers,
  FaBook,
  FaQuestionCircle,
  FaComments
} from "react-icons/fa";

import AdminStatCard from "./AdminStatCard";

const AdminHeroSection = () => {
  return (
    <>
      <div className="admin-hero-row">

        <div className="admin-hero-card">

          <div className="admin-ai-center">

            <div className="admin-ai-circle">
              🌱
            </div>

          </div>

        </div>

        <AdminStatCard
          title="Người dùng mới"
          value="156"
          growth="12.5%"
          icon={<FaUsers />}
          color="#e8fff1"
        />

        <AdminStatCard
          title="Tài liệu mới"
          value="342"
          growth="8.2%"
          icon={<FaBook />}
          color="#edf5ff"
        />

        <AdminStatCard
          title="Quiz được tạo"
          value="278"
          growth="15.3%"
          icon={<FaQuestionCircle />}
          color="#f4efff"
        />

        <AdminStatCard
          title="Tin nhắn AI"
          value="1,256"
          growth="23.8%"
          icon={<FaComments />}
          color="#fff3ea"
        />

      </div>
    </>
  );
};

export default AdminHeroSection;