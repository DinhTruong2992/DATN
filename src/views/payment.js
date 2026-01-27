import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentMethodScreen({ navigation }) {
  const [selected, setSelected] = useState("cod"); // mặc định COD

  const PaymentOption = ({ id, title, subtitle, icon }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => setSelected(id)}
    >
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={22} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionSub}>{subtitle}</Text>
        </View>
      </View>

      <Ionicons
        name={
          selected === id
            ? "radio-button-on"
            : "radio-button-off"
        }
        size={22}
      />
    </TouchableOpacity>
  );

  const handleContinue = () => {
    if (selected === "cod") {
      Alert.alert(
        "Thanh toán khi nhận hàng",
        "Bạn sẽ thanh toán tiền mặt khi nhận hàng."
      );
    } else if (selected === "card") {
      Alert.alert("Thanh toán thẻ", "Chuyển sang màn nhập thẻ");
    } else {
      Alert.alert("PayPal", "Thanh toán qua PayPal");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Card */}
      <PaymentOption
        id="card"
        title="Credit / Debit Card"
        subtitle="Visa, MasterCard"
        icon="card-outline"
      />

      {/* PayPal */}
      <PaymentOption
        id="paypal"
        title="PayPal"
        subtitle="Thanh toán qua PayPal"
        icon="logo-paypal"
      />

      {/* COD */}
      <PaymentOption
        id="cod"
        title="Cash on Delivery"
        subtitle="Thanh toán khi nhận hàng"
        icon="cash-outline"
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
  },

  optionSub: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
