import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../app/themeSlice";

export default function useDarkSide() {
  const the = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(the);
  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);

    dispatch(changeTheme(theme));
  }, [theme, colorTheme]);

  return [colorTheme, setTheme];
}
