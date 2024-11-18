import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingSearchFun } from "../../features/catagorie/catagorieApi";
import { useDispatch } from "react-redux";
import { setScheduleId } from "../../features/catagorie/catagorieSlice";

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const getSearchParams = (query) => {
    return new URLSearchParams(query);
  };

  const searchParams = getSearchParams(location.search);
  const fromPlace = searchParams.get("from");
  const toPlace = searchParams.get("to");
  const travelDate = searchParams.get("date");
  const adults = searchParams.get("adults");
  const childs = searchParams.get("children");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchResults", fromPlace, toPlace, travelDate],
    queryFn: () => getBookingSearchFun( fromPlace, toPlace, travelDate ),
    enabled: !!fromPlace && !!toPlace && !!travelDate,
  });

  console.log(data)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const goToPassangerInfo = (id, bus_id) => {
    dispatch(setScheduleId({id, bus_id}));
    navigate(
      `/passenger?from=${fromPlace}&to=${toPlace}&date=${travelDate}&adults=${adults}&children=${childs}`
    );
  }

  console.log(data)

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Search Results for {fromPlace} to {toPlace} on {travelDate}
      </h2>
      <div className="grid gap-4">
        {data?.length > 0 ? (
          data?.map((result, index) => (
            <div
              onClick={() => goToPassangerInfo(result._id, result.bus_id)}
              key={index}
              className="cursor-pointer flex justify-between items-center p-4 border rounded-md"
            >
              <h3 className="text-xl font-medium">{result?.from}</h3>
              <h3 className="text-xl font-medium">To</h3>
              <h3 className="text-xl font-medium">{result?.to}</h3>
              <p>{result.description}</p>
            </div>
          ))
        ) : (
          <div>No results found.</div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
