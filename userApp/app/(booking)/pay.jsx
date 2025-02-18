import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Pay = ({ fname, lname, email, amount, tx_ref, publik_key }) => {
  const handlePayment = () => {
    const formData = new FormData();
    formData.append("public_key", publik_key);
    formData.append("tx_ref", tx_ref);
    formData.append("amount", amount);
    formData.append("currency", "ETB");
    formData.append("email", email);
    formData.append("first_name", fname);
    formData.append("last_name", lname);
    formData.append("title", "Let us do this");
    formData.append("description", "Paying with Confidence with cha");
    formData.append("logo", "https://chapa.link/asset/images/chapa_swirl.svg");
    formData.append("callback_url", "https://example.com/callbackurl");
    formData.append("return_url", "https://example.com/returnurl");
    formData.append("meta[title]", "test");

    fetch("https://api.chapa.co/v1/hosted/pay", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response, navigate to success page or display success message
        console.log("Payment Success:", data);
      })
      .catch((error) => {
        // Handle error, display error message
        console.error("Payment Error:", error);
      });
  };

  return (
    <View className="p-4">
      <TouchableOpacity
        onPress={handlePayment}
        className="bg-blue-500 text-white rounded-lg p-4"
      >
        <Text className="text-center text-white font-medium">Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pay;
