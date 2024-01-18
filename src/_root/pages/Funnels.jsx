import { useState, useEffect, useRef } from "react";

import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../dummyData/ProductService";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

function Funnels() {
  const [products, setProducts] = useState([]);
  const [popupCreateVisible, setPopupCreateVisible] = useState(false);
  const [funnelName, setFunnelName] = useState("");

  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: "success",
      // summary: "Confirmed",
      detail: "Воронка удалена",
      life: 3000,
    });
  };

  const reject = () => {
    // toast.current.show({
    //   severity: "warn",
    //   summary: "Rejected",
    //   detail: "You have rejected",
    //   life: 3000,
    // });
  };

  const confirm = (event) => {
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить воронку?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  useEffect(() => {
    // ProductService.getProducts().then((data) => setProducts(data));

    axios({
      method: "get",
      url: "http://25.18.88.64:8000/api/funnels",
      mode: "no-cors",
    }).then(function (response) {
      console.log(response.data);
      setProducts(response.data);
    });
  }, []);

  const actionBodyTemplate = () => {
    return (
      <Button
        onClick={confirm}
        icon="pi pi-trash"
        className="p-button-danger"
        style={{ maxWidth: "48px", margin: "0 auto" }}
      />
    );
  };
  
  return (
    <div className="" style={{ maxWidth: "80%", margin: "0 auto" }}>
      <Toast ref={toast} />
      <ConfirmPopup
        group="headless"
        content={({ message, acceptBtnRef, rejectBtnRef, hide }) => (
          <div className="border-round p-3">
            <span>{message}</span>
            <div className="flex align-items-center gap-2 mt-3">
              <Button
                ref={acceptBtnRef}
                label="Да"
                onClick={() => {
                  accept();
                  hide();
                }}
                className="p-button-sm p-button-outlined p-button-danger"
              ></Button>
              <Button
                ref={rejectBtnRef}
                label="Отменить"
                outlined
                onClick={() => {
                  reject();
                  hide();
                }}
                className="p-button-sm p-button-text"
              ></Button>
            </div>
          </div>
        )}
      />
      <div className="flex justify-content-between items-center mb-6">
        <h2 className="m-0">Воронки</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setPopupCreateVisible}
        />
        <Dialog
          visible={popupCreateVisible}
          modal
          onHide={() => setPopupCreateVisible(false)}
          content={({ closeIconRef, hide }) => (
            <div
              className="flex flex-column gap-5 p-3"
              style={{
                background: "#1f2937",
              }}
            >
              <div className="flex justify-content-between items-center">
                <h3 className="m-0">Создать воронку</h3>
                <Button
                  type="button"
                  ref={closeIconRef}
                  onClick={(e) => hide(e)}
                  icon="pi pi-times"
                  rounded
                  outlined
                  className="h-2rem w-2rem"
                ></Button>
              </div>
              <InputText
                value={funnelName}
                onChange={(e) => setFunnelName(e.target.value)}
              />
              <Button label="Создать" onClick={(e) => hide(e)} />
            </div>
          )}
        ></Dialog>
      </div>

      <DataTable
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100]}
        value={products}
        stripedRows
        showGridlines
        tableStyle={{ minWidth: "50rem" }}
        paginatorPosition="both"
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="funnel_name" header="Funnel"></Column>
        <Column
          field="category"
          header="Действие"
          body={actionBodyTemplate}
          style={{ width: "1%" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default Funnels;
