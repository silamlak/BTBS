import React from 'react'
import { useSelector } from 'react-redux';
import SyncLoader from "react-spinners/ClipLoader";

const Loader = ({s}) => {
  const theme = useSelector((state) => state.theme.theme)
  const loaderColor = theme === "dark" ? "#ffffff" : "#000000";
  return (
    <div>
      <div>
        <SyncLoader
          size={s || 15}
          color={loaderColor}
          loading={true}
          speedMultiplier={1}
        />
      </div>
    </div>
  );
}

export default Loader
