import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleCatagorieFun } from "../../features/catagorie/catagorieApi";
import DataTable, { createTheme } from "react-data-table-component";
import { useSelector } from "react-redux";

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

const columns = [
  {
    name: "Name",
    selector: (row) => row?.name,
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => row?.price,
    sortable: true,
  },
  {
    name: "Discount",
    selector: (row) => row?.discount,
    sortable: true,
  },
  {
    name: "Image",
    selector: (row) => (
      <img
        src={row?.s_img}
        alt={row?.name}
        style={{ width: 50, height: 50 }}
      />
    ),
    sortable: false,
  },
];

const customStyles = {
  rows: {
    highlightOnHover: true,
    style: {
      cursor: "pointer",
    },
  },
};

const SingleCatagorie = () => {
  const [inp, setInp] = useState();
  const [searchText, setSearchText] = useState("");
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getSingleCatagorieFun(id),
    enabled: !!id,
  });
  console.log(data?.services);
  useEffect(() => {
    if (data) setInp(data?.catagorie?.title);
  }, [data]);

  const filteredItems =
    data?.services?.filter((item) =>
      item.name?.toLowerCase().includes(searchText?.toLowerCase())
    ) || [];

  // Debug: Log fetched and filtered items
  console.log("Fetched Data:", data);
  console.log("Filtered Items:", filteredItems);

  const handleRowClick = (row) => {
    navigate(`/product/${row._id}`);
  };

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;
  return (
    <div className="text-slate-800 dark:text-slate-100 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
      <div>
        <div className="w-full">
          <input
            type="text"
            name="inp"
            id="inp"
            className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-blue-200 dark:border-orange-200 rounded-t-lg focus:outline-blue-500 dark:focus:outline-orange-500"
            value={inp}
            onChange={(e) => setInp(e.value)}
          />
        </div>
        </div>
        <div className="mt-10">
        <input
          type="text"
          name="search"
          id="search"
          className="p-2 bg-slate-100 dark:bg-slate-700 border border-blue-200 dark:border-orange-200 rounded-tr-xl focus:outline-blue-500 dark:focus:outline-orange-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} // Use e.target.value
          placeholder="Search Products"
        />
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          selectableRows
          onRowClicked={handleRowClick}
          selectableRowsHighlight
          highlightOnHover
          theme={theme === "dark" ? "dark" : "solarized"}
          responsive
          persistTableHead
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default SingleCatagorie;
