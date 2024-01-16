import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import { sidebarLinks } from "../utilities/renderSidebarLinks";
import SidebarLink from "./SidebarLink";

function SidebarStyled({ visible, setVisible }) {
  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => handleHide()}
      content={({ closeIconRef, hide }) => (
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
            <span className="inline-flex align-items-center gap-2">
              <img src="/assets/images/ogtLogo.png" width={140} />
            </span>
            <span>
              <Button
                type="button"
                ref={closeIconRef}
                onClick={(e) => hide(e)}
                icon="pi pi-times"
                rounded
                outlined
                className="h-2rem w-2rem"
              ></Button>
            </span>
          </div>
          <div className="overflow-y-auto">
            <ul className="list-none p-3 m-0">
              {sidebarLinks.map((link, index) => {
                return (
                  <SidebarLink
                    key={index}
                    link={link}
                    handleHide={handleHide}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      )}
    ></Sidebar>
  );
}

export default SidebarStyled;
