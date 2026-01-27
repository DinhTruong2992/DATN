import React from "react";
import { images } from "../../../assets/images";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function OrderDetailScreen({ navigation }) {
  const order = {
    id: "ORD001",
    status: "ĐÃ GIAO HÀNG",
    address: "123 Tân Kỳ Tân Quý, Tân Quý, Tân Phú",
    items: [
      {
        id: "SKU 6072462",
        name: "Đồ Chơi Trứng Khủng Long Tự Nở Bạo Chúa T-Rex PRIMAL HATCH 6072462",
        price: "720.999 Đ",
        quantity: 1,
        image: require("../../assets/images/khunglong01.png"),
      },
      {
        id: "SKU R59400",
        name: "Xe điều khiển 1:18 Porsche 911 GT3 CUP RASTAR R59400",
        price: "623.200 Đ",
        quantity: 1,
        image: require("../../assets/images/xe01.png"),  
      },
    ],
    subtotal: "1.344.199 Đ",
    shipping: "MIỄN PHÍ ",
    total: "1.344.199 Đ",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHI TIẾT ĐƠN HÀNG</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.orderId}>MÃ ĐƠN HÀNG {order.id}</Text>
          <Text style={[styles.status, styles.delivered]}>
            {order.status}
          </Text>
        </View>

        {/* Product List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANH MỤC</Text>

          {order.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <Text style={styles.itemQty}>
                  Số lượng : {item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ĐỊA CHỈ </Text>
          <Text style={styles.address}>{order.address}</Text>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THANH TOÁN</Text>

          <View style={styles.rowBetween}>
            <Text>GÍA SẢN PHẨM :</Text>
            <Text>{order.subtotal}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text>PHÍ GIAO HÀNG :</Text>
            <Text>{order.shipping}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.totalText}>TỔNG CỘNG :</Text>
            <Text style={styles.totalText}>{order.total}</Text>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  section: {
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },

  orderId: {
    fontSize: 14,
    fontWeight: "500",
  },

  status: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  delivered: {
    color: "green",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  itemCard: {
    flexDirection: "row",
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#eee",
  },

  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
  },

  itemPrice: {
    fontSize: 13,
    marginTop: 4,
  },

  itemQty: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  address: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  totalText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
