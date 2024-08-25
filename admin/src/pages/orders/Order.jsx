import React, { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDeleteOrdersFun, getOrderFun } from "../../features/order/orderApi";
import { addOrder, addOrderDetail, deleteFiles } from "../../features/order/orderSlice";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

createTheme("dark", {
  text: {
    primary: "#f1f5f9",
    secondary: "#f1f5f9",
  },
  background: {
    default: "#0f172a",
  },
  context: {
    background: "#1e293b",
    text: "#FFFFFF",
  },
  divider: {
    default: "#e2e8f0",
  },
  action: {
    button: "rgba(0,0,0,.54)",
    hover: "#334155",
    disabled: "rgba(0,0,0,.12)",
  },
});

const customStyles = {
  rows: {
    highlightOnHover: true,
    style: {
      cursor: "pointer",
    },
  },
};

const columns = [
  {
    name: "Service ID", // Updated to match the `serviceId`
    selector: (row) => `${row?.user?.first_name} ${row?.user?.father_name}`,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row?.deliveryAddress?.phone_no,
    sortable: true,
    hide: "md",
  },
  {
    name: "Total Price", // Updated to display total price
    selector: (row) => row?.totalPrice,
    sortable: true,
    cell: (row) => <span className="text-green-500">${row.totalPrice}</span>, // Displaying total price with `$`
  },
  {
    name: "Payment Method",
    selector: (row) => row?.category,
    sortable: true,
    hide: "sm",
  },
  // {
  //   name: "Status", // Updated to match the `status`
  //   selector: (row) => row?.status,
  //   sortable: true,
  // },
  {
    name: "Purchase Date", // Added to show purchase date
    selector: (row) => row?.purchaseDate.split("T")[0], // Formatting date to `YYYY-MM-DD`
    sortable: true,
  },
];

const Order = () => {
  const theme = useSelector((state) => state.theme.theme);
  const orderedData = useSelector((state) => state.order.orderData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageFromURL = parseInt(queryParams.get("page"), 10) || 1;
  const limitFromURL = parseInt(queryParams.get("limit"), 10) || 10;
  const searchFromURL = queryParams.get("search") || "";
  const categoryFromURL = queryParams.get("status");
  const dateFromURL = queryParams.get("date") || "";
  const priceFromURL = queryParams.get("p") || "";

  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [limit, setLimit] = useState(limitFromURL);
  const [searchQuery, setSearchQuery] = useState(searchFromURL);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [dateValue, setDateValue] = useState(dateFromURL || "");
  const [price, setPrice] = useState(priceFromURL || "");
  
  const [filterText, setFilterText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(categoryFromURL);
  const [filterType, setFilterType] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [toDelete, setToDelete] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", currentPage);
    queryParams.set("limit", limit);
    if (searchQuery) queryParams.set("search", searchQuery);
     queryParams.set("status", selectedCategory || 'Pending');
    if (dateValue) queryParams.set("date", dateValue);
    if (price) queryParams.set("p", price);
    navigate({ search: queryParams.toString() });
  }, [
    currentPage,
    limit,
    price,
    dateValue,
    searchQuery,
    selectedCategory,
    navigate,
  ]);

  useEffect(() => {
    const pageFromURL = parseInt(queryParams.get("page"), 10) || 1;
    const limitFromURL = parseInt(queryParams.get("limit"), 10) || 10;
    const searchFromURL = queryParams.get("search") || "";
    const categoryFromURL = queryParams.get("status") || "";
    const dateFromURL = queryParams.get("date") || "";
    const priceFromURL = queryParams.get("p") || "";

    setCurrentPage(pageFromURL);
    setLimit(limitFromURL);
    setSearchQuery(searchFromURL);
    setSelectedCategory(categoryFromURL);
    setSelectedStatus(categoryFromURL);
    setDateValue(dateFromURL);
    setPrice(priceFromURL);
  }, [location.search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "orders",
      currentPage,
      limit,
      searchQuery,
      selectedCategory,
      dateValue,
      price,
    ],
    queryFn: () =>
      getOrderFun({
        limit,
        currentPage,
        searchQuery,
        selectedCategory,
        dateValue,
        price,
      }),
    // enabled: !!filterType,
    keepPreviousData: true,
  });

  
  useEffect(() => {
    if (data) {
      dispatch(addOrder(data?.ordersWithUsers));
    }
  }, [data]);
  console.log(data);

    const handleDateChange = (e) => {
      setDateValue(e.target.value);
      setCurrentPage(1); // Reset to first page when date changes
    };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilterText("");
    handleCategoryClick(status);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCustomValue(""); // Clear custom value when filter type changes
    setDateValue("");
  };

  const handleCustomValueChange = (e) => {
    setPrice(e.target.value);
  };


  const handleRowClick = (row) => {
    dispatch(addOrderDetail(row._id));
    navigate(`/order/${row?._id}`);
  };

  const handleResetFilters = () => {
    setFilterText("");
    setFilterType("");
    setCustomValue("");
    setDateValue("");
  };

  const mutation = useMutation({
    mutationFn: () => getDeleteOrdersFun(toDelete),
    onSuccess: (data) => {
      console.log(data);
      dispatch(deleteFiles(toDelete));
      setToDelete([]);
      toast.success(data?.msg)
    },
  });

  const handleDeleteRows = (rows) => {
    setToDelete([]);
    const ids = rows.map((row) => row._id);
    setToDelete(ids)
  }

  const handleDeleteAll = () => {
    mutation.mutate(toDelete);
  }

  const filteredItems = orderedData?.filter((item) => {
    const matchesStatus =
      selectedStatus === "ordered" || item.status === selectedStatus;

    const matchesFilter = item?.serviceId?.toLowerCase()?.includes(filterText?.toLowerCase());
    return matchesStatus && matchesFilter;
  });

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md">
      <div className="flex flex-row-reverse gap-4 justify-between">
        <div className="mb-4 flex items-center space-x-2">
          {isLoading && !isError && (
            <div>
              <Loader />
            </div>
          )}
          {filterType === "min-value" && (
            <input
              type="number"
              placeholder="Enter min value..."
              value={price}
              onChange={(e) => handleCustomValueChange(e)}
              className="p-2 focus:outline dark:outline-orange-400 outline-blue-500 rounded ml-2 text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
            />
          )}
          {filterType === "date" && (
            <input
              type="date"
              value={dateValue}
              onChange={handleDateChange}
              className="p-2 rounded ml-2 focus:outline dark:outline-orange-400 outline-blue-500 text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
            />
          )}
          <select
            onChange={handleFilterTypeChange}
            value={filterType}
            className="p-2 rounded bg-slate-100 focus:outline dark:outline-orange-400 outline-blue-500 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
          >
            <option value="">Select Filter Type</option>
            <option value="min-value">Min Value</option>
            <option value="date">Date</option>
          </select>
          {filterType !== "" && (
            <button
              onClick={handleResetFilters}
              className="ml-4 p-2 text-2xl text-slate-800 dark:text-slate-100 rounded-full font-extrabold hover:bg-blue-200 hover:dark:bg-orange-100"
            >
              <AiOutlineMinusCircle />
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          className="mb-4 p-2 rounded w-fit focus:outline dark:outline-orange-400 outline-blue-500 text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
        />
      </div>
      {toDelete?.length !== 0 && (
        <div className="px-2 py-1 bg-red-400 flex items-center justify-between">
          <p className="text-white font-semibold">{toDelete?.length}</p>
          <button
            onClick={handleDeleteAll}
            className="shadow-xl bg-red-600 hover:bg-red-700 p-2 text-white rounded"
          >
            Delete All
          </button>
        </div>
      )}
      <div className="w-full grid grid-cols-3 rounded-t-lg  bg-slate-100 dark:bg-slate-800">
        <button
          onClick={() => handleStatusChange("Pending")}
          className={` py-2 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 text-slate-800 dark:text-slate-100 ${
            selectedStatus === "Pending" || selectedStatus === ""
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Ordered({data?.statusCounts?.Pending})
        </button>
        <button
          onClick={() => handleStatusChange("Completed")}
          className={`py-2 px-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 ${
            selectedStatus === "Completed"
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Delivered({data?.statusCounts?.Completed})
        </button>
        <button
          onClick={() => handleStatusChange("Canceled")}
          className={`py-2 px-4 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 ${
            selectedStatus === "Canceled"
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Canceled({data?.statusCounts?.Canceled})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        selectableRows
        onRowClicked={handleRowClick}
        onSelectedRowsChange={(row) => handleDeleteRows(row.selectedRows)}
        selectableRowsHighlight
        highlightOnHover
        theme={theme === "dark" ? "dark" : "solarized"}
        responsive
        paginationTotalRows={data?.totalCount || 0}
        persistTableHead
        clearSelectedRows={true}
        paginationServer="true"
        customStyles={customStyles}
        paginationDefaultPage={data?.currentPage}
        onChangePage={(page) => {
          setCurrentPage(page);
        }}
        onChangeRowsPerPage={(newLimit) => {
          setLimit(newLimit);
          setCurrentPage(1);
        }}
        paginationComponentOptions={{
          rowsPerPageText: "Rows per page:",
          rangeSeparatorText: "of",
        }}
        noDataComponent="No data available"
      />
    </div>
  );
};

export default Order;
