import React, { useState } from "react";
import useDarkSide from "../utils/theme";
import Switch from "react-switch";

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  return (
    <>
      <div className="flex gap-2  text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white items-center">
        {/* <p className="mb-1">Mode</p> */}
        <Switch
          onChange={toggleDarkMode}
          checked={darkSide}
          offColor="#888"
          onColor="#333"
          height={16}
          width={32}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>
    </>
  );
}
