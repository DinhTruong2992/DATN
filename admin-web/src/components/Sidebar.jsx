import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>ADMIN</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/products">Products</Link>
        <Link style={styles.link} to="/categories">Categories</Link>
        <Link style={styles.link} to="/orders">Orders</Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    background: "#001529",
    color: "#fff",
    padding: "20px",
  },

  logo: {
    marginBottom: "30px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "6px",
  },
};

export default Sidebar;