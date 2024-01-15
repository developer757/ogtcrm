import { useState } from "react";
import { Outlet } from "react-router-dom";

import { Button } from "primereact/button";
import SidebarStyled from "../components/SidebarStyled";

function RootLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <header>
        <Button icon="pi pi-bars" onClick={() => setSidebarVisible(true)} />
        <SidebarStyled visible={sidebarVisible} setVisible={setSidebarVisible}/>
      </header>

      <section>
        <Outlet />
      </section>
    </>
  );
}

export default RootLayout;
