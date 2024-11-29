import axios from "axios";

export const getBookingSearch = async (query) => {
  try {
    // console.log(query);
    const res = await axios.get(
      `http://localhost:8000/api/tso/search?${query}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error)
  }
};
