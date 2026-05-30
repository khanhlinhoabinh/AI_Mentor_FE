
const AdminStatCard = ({
  icon,
  title,
  value,
  growth,
  color
}) => {
  return (
    <div className="admin-stat-card">

      <div
        className="admin-stat-icon"
        style={{
          background: color
        }}
      >
        {icon}
      </div>

      <div>

        <p>{title}</p>

        <h2>{value}</h2>

        <span>
          ↑ {growth}
        </span>

      </div>

    </div>
  );
};

export default AdminStatCard;