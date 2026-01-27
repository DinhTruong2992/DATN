import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
  

export default function BagScreen() {
    const navigation = useNavigation();
  return (


    <SafeAreaView style={styles.container}>
        
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Text style={styles.header}>Bag</Text>

      {/* Notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Not in a Hurry?</Text>
        <Text style={styles.noticeText}>
          Select No Rush Shipping at checkout.
        </Text>
      </View>

      {/* Delivery Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivery</Text>
        <Ionicons name="remove" size={24} />
      </View>

      {/* Free Delivery */}
      <TouchableOpacity style={styles.option}>
        <View style={styles.optionLeft}>
          <Ionicons name="checkmark-circle" size={22} color="black" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.optionTitle}>Free Delivery</Text>
            <Text style={styles.optionDesc}>
              Arrives Wed, 11 May to Fri, 13 May
            </Text>
          </View>
        </View>
        <Text style={styles.more}>More Options</Text>
      </TouchableOpacity>

      {/* Pick Up */}
      <TouchableOpacity style={styles.option}>
        <View style={styles.optionLeft}>
          <Ionicons
            name="ellipse-outline"
            size={22}
            color="gray"
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.optionTitle}>Pick-Up</Text>
            <Text style={styles.optionDesc}>Find a Location</Text>
          </View>
        </View>
        <Text style={styles.more}>More Options</Text>
      </TouchableOpacity>

      {/* Delivery Details */}
      <View style={styles.details}>
        <Text style={styles.sectionTitle}>Delivery Details</Text>

        <View style={styles.warning}>
          <Ionicons name="alert-circle" size={18} color="red" />
          <Text style={styles.warningText}> Enter Delivery Address</Text>
          <Text style={styles.edit}>Edit</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.continueBtn}
        onPress={() => navigation.navigate("paymentresult")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

<TouchableOpacity
  style={styles.addBtn}
  onPress={() => navigation.navigate("screen3")}
>
  <Text style={styles.addText}>Add Address</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },

  notice: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  noticeTitle: {
    fontWeight: "600",
  },

  noticeText: {
    color: "#555",
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
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

  optionDesc: {
    fontSize: 13,
    color: "#666",
  },

  more: {
    fontSize: 13,
    color: "#000",
  },

  details: {
    marginTop: 20,
  },

  warning: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  warningText: {
    color: "red",
    flex: 1,
  },

  edit: {
    color: "#000",
    fontWeight: "500",
  },

  continueBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  addBtn: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },

  addText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
