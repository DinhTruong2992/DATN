import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = [
  {
    id: "SKU 6072462",
    productName:
      "Đồ Chơi Trứng Khủng Long Tự Nở Bạo Chúa T-Rex PRIMAL HATCH 6072462",
   image: require("../../assets/images/khunglong01.png"),
    date: "12 May 2024",
    status: "Delivered",
    total: "720.999 Đ",
  },
  {
    id: "SKU R59400",
    productName: "Xe điều khiển 1:18 Porsche 911 GT3 CUP RASTAR R59400",
    image: require("../../assets/images/xe01.png"),

    date: "15 May 2024",
    status: "Processing",
    total: "623.200 Đ",
  },
  {
    id: "SKU R71400N-YEL",
    productName:
      "Xe điều khiển tỷ lệ 1:24 Porsche 918 Spyder màu Vàng RASTAR R71400N",
   image: require("../../assets/images/xe02.png"),

    date: "18 May 2024",
    status: "Cancelled",
    total: "424.150 Đ",
  },
];


export default function OrderListScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.rowBetween}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text
            style={[
              styles.status,
              item.status === "Delivered" && styles.delivered,
              item.status === "Processing" && styles.processing,
              item.status === "Cancelled" && styles.cancelled,
            ]}
          >
            {item.status}
          </Text>
        </View>

        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.date}>Date: {item.date}</Text>
        <Text style={styles.total}>Total: {item.total}</Text>

        <TouchableOpacity style={styles.detailBtn}>
          <Text style={styles.detailText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.header}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },

  orderId: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  total: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  status: {
    fontSize: 12,
    fontWeight: "600",
  },

  delivered: {
    color: "green",
  },

  processing: {
    color: "#f39c12",
  },

  cancelled: {
    color: "red",
  },

  detailBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
    width: 120,
  },

  detailText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
