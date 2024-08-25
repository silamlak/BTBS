import toast from "react-hot-toast";

export const handleError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.error("Server Error:", error);
    throw { status: error?.response?.status, data: error?.response?.statusText };
  } else if (error.request) {
    console.error("Network Error:", error.request);
    throw { status: null, data: "Network Error" };
  } else {
    // Something happened while setting up the request
    toast.error(error?.message);
    console.error("Error:", error.message);
    throw { status: null, data: error.message };
  }
};
