import AdminLayout from "../components/layout/Adminlayout";
import EmptyState from "../components/admin/EmptyState/EmptyState";
import { MdInsertDriveFile } from "react-icons/md";

/**
 * Quản lý nội dung — backend hiện chưa có API cho chức năng này.
 * Theo yêu cầu PO: vẫn tạo page, hiển thị Empty State, không dùng
 * dữ liệu giả, thiết kế đồng bộ với Dashboard.
 */
export default function ContentManagementPage() {
  return (
    <AdminLayout>
      <EmptyState
        icon={<MdInsertDriveFile size={32} />}
        title="Content Management — Coming Soon"
        subtitle="Backend chưa cung cấp API cho quản lý nội dung. Trang này sẽ được kết nối dữ liệu thật ngay khi API sẵn sàng."
      />
    </AdminLayout>
  );
}
