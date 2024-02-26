import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import { sidebarLinks } from "../utilities/renderSidebarLinks";
import SidebarLink from "./SidebarLink";

function SidebarStyled({ visible, setVisible, theme }) {
  const handleHide = () => {
    setVisible(false);
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => handleHide()}
      content={({ closeIconRef, hide }) => (
        <div className="flex flex-column h-full">
          <div className="flex align-items-center justify-content-between px-3 pt-3 flex-shrink-0">
            <span className="inline-flex align-items-center gap-2">
              {theme === "lara-dark-green" ? (
                <img src="/assets/images/ogt-logo-light.png" width={140} />
              ) : (
                <img src="/assets/images/ogt-logo-dark.png" width={140} />
              )}
            </span>
            <span>
              <Button
                type="button"
                ref={closeIconRef}
                onClick={(e) => hide(e)}
                outlined
                icon="pi pi-chevron-right"
                className="h-3rem w-3rem"
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
