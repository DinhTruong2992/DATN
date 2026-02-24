import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div style={styles.header}>
      <h3>Admin Dashboard</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const styles = {
  header: {
    height: "64px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    borderBottom: "1px solid #eee",
  },
};

export default Header;