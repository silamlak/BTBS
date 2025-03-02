import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import DataTable, { createTheme } from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AiOutlineMinusCircle } from "react-icons/ai";
import {
  addBus,
  deleteBusFiles,
} from "../../features/buses/busSlice";
import { IoMdAdd } from "react-icons/io";
import { getBusesFun } from "../../features/buses/busApi";

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
    name: "Bus ID",
    selector: (row) => `${row?.bus_id}`,
    sortable: true,
  },
  {
    name: "License Plate",
    selector: (row) => row?.license_plate,
    sortable: true,
    hide: "md",
  },
  {
    name: "Status",
    selector: (row) => row?.status,
    sortable: true,
    cell: (row) => <span className="text-green-500">{row?.status}</span>,
  },
  {
    name: "Hired Date",
    selector: (row) => row?.createdAt,
    sortable: true,
    hide: "sm",
    cell: (row) => (
      <span className="">{new Date(row?.createdAt).toLocaleDateString()}</span>
    ),
  },
];

const Buses = () => {
  const theme = useSelector((state) => state.theme.theme);
  const orderedData = useSelector((state) => state.bus.orderData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageFromURL = parseInt(queryParams.get("page"), 10) || 1;
  const limitFromURL = parseInt(queryParams.get("limit"), 10) || 10;
  const searchFromURL = queryParams.get("search") || "";
  const dateFromURL = queryParams.get("date") || "";

  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const [limit, setLimit] = useState(limitFromURL);
  const [searchQuery, setSearchQuery] = useState(searchFromURL);
  const [dateValue, setDateValue] = useState(dateFromURL || "");
  const [toDelete, setToDelete] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.set("page", currentPage);
    queryParams.set("limit", limit);
    if (searchQuery) queryParams.set("search", searchQuery);
    if (dateValue) queryParams.set("date", dateValue);
    navigate({ search: queryParams.toString() });
  }, [currentPage, limit, dateValue, searchQuery, navigate]);

  useEffect(() => {
    const pageFromURL = parseInt(queryParams.get("page"), 10) || 1;
    const limitFromURL = parseInt(queryParams.get("limit"), 10) || 10;
    const searchFromURL = queryParams.get("search") || "";
    const dateFromURL = queryParams.get("date") || "";

    setCurrentPage(pageFromURL);
    setLimit(limitFromURL);
    setSearchQuery(searchFromURL);
    setDateValue(dateFromURL);
  }, [location.search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["buses", currentPage, limit, searchQuery, dateValue],
    queryFn: () =>
      getBusesFun({
        limit,
        currentPage,
        searchQuery,
        dateValue,
      }),
    // enabled: !!filterType,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      dispatch(addBus(data.buses));
    }
  }, [data]);
  console.log(data);

  const handleDateChange = (e) => {
    setDateValue(e.target.value);
    setCurrentPage(1);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCustomValue("");
    setDateValue("");
  };

  const handleResetFilters = () => {
    setFilterText("");
    setFilterType("");
    setCustomValue("");
    setDateValue("");
  };

  const mutation = useMutation({
    mutationFn: () => getDeleteCustomerFun(toDelete),
    onSuccess: (data) => {
      console.log(data);
      dispatch(deleteBusFiles(toDelete));
      setToDelete([]);
      toast.success(data?.msg);
    },
  });

  const handleDeleteRows = (rows) => {
    setToDelete([]);
    const ids = rows.map((row) => row._id);
    setToDelete(ids);
  };

  const handleDeleteAll = () => {
    mutation.mutate(toDelete);
  };

  const handleRowClick = (row) => {
    //   dispatch(addOrderDetail(row._id));
    navigate(`/bus/${row?._id}`);
  };

  const handleAddBo = (row) => {
    navigate(`/add-bus`);
  };

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-md">
      <div className="flex flex-row-reverse gap-4 justify-between">
        <div className="mb-4 flex items-center space-x-2">
          <button onClick={handleAddBo}>
            <IoMdAdd className="text-slate-800 dark:text-slate-100" />
          </button>
          {isLoading && !isError && (
            <div>
              <Loader />
            </div>
          )}
          {/* {filterType === "date" && (
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
            <option value="date">Date</option>
          </select>
          {filterType !== "" && (
            <button
              onClick={handleResetFilters}
              className="ml-4 p-2 text-2xl text-slate-800 dark:text-slate-100 rounded-full font-extrabold hover:bg-blue-200 hover:dark:bg-orange-100"
            >
              <AiOutlineMinusCircle />
            </button>
          )} */}
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

      <DataTable
        columns={columns}
        data={orderedData}
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

export default Buses;
