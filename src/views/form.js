import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function BagScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <Text style={styles.title}>Bag</Text>

        {/* Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>Not in a Hurry?</Text>
          <Text style={styles.noticeText}>
            Select No Rush Shipping at checkout.
          </Text>
        </View>

        {/* Product */}
        <View style={styles.productRow}>
          <Image
            source={require("../../../assets/images/xe03.png")}
            style={styles.productImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>
              Đồ Chơi Xe Cứu Hỏa Jeep Wrangler Unlimited Rubicon Kèm Lính Cứu
              Hỏa BRUDER BRU02528
            </Text>
            <Text style={styles.productSub}>Thương hiệu : BRUDER</Text>
            <Text style={styles.productSub}>SKU BRU02528</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>
          Đồ Chơi Xe Cứu Hỏa Jeep Wrangler Unlimited Rubicon Kèm Lính Cứu Hỏa
          BRUDER BRU02528
        </Text>

        {/* Delivery */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Delivery</Text>
          <View style={styles.rowRight}>
            <Text style={styles.selectText}>Select Delivery</Text>
            <Ionicons name="add" size={18} color="#e63946" />
          </View>
        </TouchableOpacity>

        {/* Payment */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Payment</Text>
          <View style={styles.rowRight}>
            <Text style={styles.selectText}>Select Payment</Text>
            <Ionicons name="add" size={18} color="#e63946" />
          </View>
        </TouchableOpacity>

        {/* Summary */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Purchase Summary</Text>
          <View style={styles.rowRight}>
            <Text style={styles.priceText}>1.189.300vnd</Text>
            <Ionicons name="add" size={18} color="#000" />
          </View>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By tapping 'Submit Payment', I agree to the Terms of Sale.
        </Text>

        <TouchableOpacity style={styles.submitBtn} disabled>
          <Text style={styles.submitText}>Submit Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    margin: 16,
  },

  noticeBox: {
    backgroundColor: "#eaeaea",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },

  noticeTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },

  noticeText: {
    color: "#555",
  },

  productRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },

  productImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },

  productName: {
    fontWeight: "600",
  },

  productSub: {
    fontSize: 12,
    color: "#666",
  },

  /* Bottom Sheet */
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },

  sheetTitle: {
    fontWeight: "600",
    fontSize: 16,
  },

  sheetSub: {
    color: "#666",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  rowLabel: {
    fontWeight: "500",
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  selectText: {
    color: "#e63946",
  },

  priceText: {
    fontWeight: "600",
  },

  terms: {
    fontSize: 12,
    color: "#888",
    marginVertical: 12,
  },

  submitBtn: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },

  submitText: {
    color: "#aaa",
    fontWeight: "600",
  },
});
