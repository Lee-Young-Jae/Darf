import React from "react";
import AppMenu from "./AppMenu";

const AppLayout = ({ children }) => {
  return (
    <div className="AppLayout">
      <AppMenu></AppMenu>
      {/* <div>공통 Layout 부분</div> */}
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;
