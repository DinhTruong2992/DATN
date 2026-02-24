import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Header />

        <div style={styles.content}>
          <h2 style={styles.title}>Dashboard</h2>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3>Total Products</h3>
              <p style={styles.number}>120</p>
            </div>

            <div style={styles.card}>
              <h3>Total Orders</h3>
              <p style={styles.number}>45</p>
            </div>

            <div style={styles.card}>
              <h3>Total Users</h3>
              <p style={styles.number}>300</p>
            </div>

            <div style={styles.card}>
              <h3>Revenue</h3>
              <p style={styles.number}>15,000,000₫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f9",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  content: {
    padding: "24px",
  },

  title: {
    marginBottom: "20px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  number: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#1677ff",
  },
};

export default Dashboard;