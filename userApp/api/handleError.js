import Toast from "react-native-toast-message";

export const handleError = (error) => {
  if (error?.response) {
    // Server responded with an error
    const errorMessage =
      error.response.statusText || "An error occurred on the server.";
    console.error("Server Error:", errorMessage);

    Toast.show({
      type: "error",
      text1: "Server Error",
      text2: errorMessage,
    });

    throw new Error(errorMessage);
  } else if (error?.request) {
    // Request was made but no response received
    console.error("Network Error:", error.request);

    Toast.show({
      type: "error",
      text1: "Network Error",
      text2: "Unable to connect to the server. Please check your connection.",
    });

    throw new Error("Network Error");
  } else {
    // Something else happened while setting up the request
    const errorMessage = error?.message || "An unknown error occurred.";
    console.error("Error:", errorMessage);

    Toast.show({
      type: "error",
      text1: "Error",
      text2: errorMessage,
    });

    throw new Error(errorMessage);
  }
};
