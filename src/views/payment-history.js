import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const payments = [
  {
    id: "PAY001",
    orderId: "ORD001",
    date: "20 May 2024",
    method: "Cash on Delivery",
    status: "Success",
    amount: "$120.00",
  },
  {
    id: "PAY002",
    orderId: "ORD002",
    date: "22 May 2024",
    method: "Credit Card",
    status: "Pending",
    amount: "$89.50",
  },
  {
    id: "PAY003",
    orderId: "ORD003",
    date: "25 May 2024",
    method: "PayPal",
    status: "Failed",
    amount: "$45.00",
  },
];

export default function PaymentHistoryScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderId}>Order {item.orderId}</Text>
        <Text style={styles.amount}>{item.amount}</Text>
      </View>

      <Text style={styles.date}>{item.date}</Text>

      <View style={styles.rowBetween}>
        <View style={styles.method}>
          <Ionicons
            name={
              item.method === "Cash on Delivery"
                ? "cash-outline"
                : item.method === "PayPal"
                ? "logo-paypal"
                : "card-outline"
            }
            size={18}
          />
          <Text style={styles.methodText}>{item.method}</Text>
        </View>

        <View style={styles.statusRow}>
          <Ionicons
            name={
              item.status === "Success"
                ? "checkmark-circle"
                : item.status === "Pending"
                ? "time-outline"
                : "close-circle"
            }
            size={18}
            color={
              item.status === "Success"
                ? "green"
                : item.status === "Pending"
                ? "#f39c12"
                : "red"
            }
          />
          <Text
            style={[
              styles.status,
              item.status === "Success" && styles.success,
              item.status === "Pending" && styles.pending,
              item.status === "Failed" && styles.failed,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Text style={styles.header}>Payment History</Text>

      {/* List */}
      <FlatList
        data={payments}
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
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: {
    fontSize: 15,
    fontWeight: "600",
  },

  amount: {
    fontSize: 16,
    fontWeight: "600",
  },

  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  method: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  methodText: {
    marginLeft: 6,
    fontSize: 13,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  status: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
  },

  success: {
    color: "green",
  },

  pending: {
    color: "#f39c12",
  },

  failed: {
    color: "red",
  },
});
