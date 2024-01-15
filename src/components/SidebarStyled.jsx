import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Ripple } from "primereact/Ripple";
import { Link } from "react-router-dom";

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
                  <img src="/assets/images/ogtLogoWhite.png" width={140} />
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
                  <li>
                    <ul className="list-none p-0 m-0 overflow-hidden">
                      <li>
                        <Link to="/dashboard" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-home mr-2"></i>
                          <span className="font-medium">Dashboard</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/statistics" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-chart-line mr-2"></i>
                          <span className="font-medium">Статистика</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/leads" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-stop mr-2"></i>
                          <span className="font-medium">Лиды</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/doubles" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-clone mr-2"></i>
                          <span className="font-medium">Дубли</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/users" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Пользователи</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/domains" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-link mr-2"></i>
                          <span className="font-medium">Домены</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/funnels" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-list mr-2"></i>
                          <span className="font-medium">Воронки</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/partners" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-share-alt mr-2"></i>
                          <span className="font-medium">Партнеры</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/offers" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-sitemap mr-2"></i>
                          <span className="font-medium">Оффера</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/spends" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-dollar mr-2"></i>
                          <span className="font-medium">Расходы</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-cog mr-2"></i>
                          <span className="font-medium">Настройки</span>
                          <Ripple />
                        </Link>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-sign-out mr-2"></i>
                          <span className="font-medium">Выход</span>
                          <Ripple />
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
      )}
    ></Sidebar>
  );
}

export default SidebarStyled;
