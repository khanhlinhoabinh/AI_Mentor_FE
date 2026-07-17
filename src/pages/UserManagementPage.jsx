import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../components/layout/Adminlayout";
import UsersTable from "../components/admin/UsersTable/UsersTable";
import NewUsersWidget from "../components/admin/NewUsersWidget/NewUsersWidget";
import UserDetailDrawer from "../components/admin/UserDetailDrawer/UserDetailDrawer";
import {
  getUsers,
  getUserDetail,
  lockUser,
  unlockUser,
} from "../services/admin.services";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Không thể tải danh sách người dùng:", err);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleView = async (user) => {
    try {
      const detail = await getUserDetail(user.userId);
      setSelectedUser(detail);
    } catch (err) {
      console.error("Không thể tải chi tiết người dùng:", err);
      toast.error("Không thể tải chi tiết người dùng");
    }
  };

  const handleLock = async (user) => {
    setActionLoadingId(user.userId);
    try {
      await lockUser(user.userId);
      toast.success(`Đã khoá tài khoản ${user.fullName}`);
      await loadUsers();
      setSelectedUser((prev) => (prev && prev.userId === user.userId ? { ...prev, isActive: false } : prev));
    } catch (err) {
      console.error("Lock user thất bại:", err);
      toast.error("Không thể khoá tài khoản này");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUnlock = async (user) => {
    setActionLoadingId(user.userId);
    try {
      await unlockUser(user.userId);
      toast.success(`Đã mở khoá tài khoản ${user.fullName}`);
      await loadUsers();
      setSelectedUser((prev) => (prev && prev.userId === user.userId ? { ...prev, isActive: true } : prev));
    } catch (err) {
      console.error("Unlock user thất bại:", err);
      toast.error("Không thể mở khoá tài khoản này");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>
            Quản lý người dùng
          </h2>
          {loading ? (
            <p style={{ color: "#9CA3AF", fontSize: 13 }}>Đang tải danh sách người dùng...</p>
          ) : (
            <UsersTable
              users={users}
              onView={handleView}
              onLock={handleLock}
              onUnlock={handleUnlock}
              actionLoadingId={actionLoadingId}
            />
          )}
        </div>

        <div style={{ width: 300, flexShrink: 0 }}>
          <NewUsersWidget />
        </div>
      </div>

      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onLock={handleLock}
        onUnlock={handleUnlock}
        actionLoading={actionLoadingId === selectedUser?.userId}
      />
    </AdminLayout>
  );
}
