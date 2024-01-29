import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { getFunnels, deleteFunnel, addFunnel } from "../../utilities/api";

function Funnels() {
  const [funnels, setFunnels] = useState([]);
  const [popupCreateVisible, setPopupCreateVisible] = useState(false);
  const [funnelName, setFunnelName] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const toast = useRef(null);

  useEffect(() => {
    getFunnels()
      .then((response) => {
        setFunnels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setToastMessage("Ошибка при загрузке воронок");
      });
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const showToast = (severity) => {
    toast.current.show({
      severity: severity,
      detail: toastMessage,
      life: 3000,
    });
  };

  const acceptDeletion = () => {
    deleteSelectedFunnel();
  };

  const rejectDeletion = () => {
    setToastMessage("Удаление воронки отменено");
  };

  const confirmDeleteFunnel = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить воронку?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      acceptDeletion: deleteFunnel,
      rejectDeletion,
    });
  };

  const deleteSelectedFunnel = () => {
    if (currentRowData) {
      deleteFunnel(currentRowData.id)
        .then(function (response) {
          setToastMessage(response.data.message);
          getFunnels()
            .then((response) => {
              setFunnels(response.data);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setToastMessage("Ошибка при загрузке воронок");
            });
        })
        .catch(function (error) {
          console.log(error);
          setToastMessage("Ошибка удаления воронки");
        });
    }
  };

  const confirmAddFunnel = () => {
    addNewFunnel();
    setPopupCreateVisible(false);
  };

  const addNewFunnel = () => {
    addFunnel(funnelName)
      .then(function (response) {
        setToastMessage(response.data.message);
        setFunnelName("");
        getFunnels()
          .then((response) => {
            setFunnels(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setToastMessage("Ошибка при загрузке воронок");
          });
      })
      .catch(function (error) {
        setToastMessage("Ошибка при добавлении воронки");
        setFunnelName("");
      });
  };

  useEffect(() => {
    if (toastMessage) {
      showToast("success");
    }
  }, [toastMessage]);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        onClick={(e) => confirmDeleteFunnel(e, rowData)}
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
                  acceptDeletion();
                  hide();
                }}
                className="p-button-sm p-button-outlined p-button-danger"
              ></Button>
              <Button
                ref={rejectBtnRef}
                label="Отменить"
                outlined
                onClick={() => {
                  rejectDeletion();
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
              <Button label="Создать" onClick={confirmAddFunnel} />
            </div>
          )}
        ></Dialog>
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <DataTable
          value={funnels}
          paginator
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          stripedRows
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
          paginatorPosition="both"
          dataKey="id"
          filters={filters}
          loading={loading}
          globalFilterFields={[
            "funnel_name",
            "country.name",
            "representative.name",
            "status",
          ]}
          header={renderHeader()}
          emptyMessage="Воронка не найдена."
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "30%" }}
          ></Column>
          <Column field="funnel_name" header="Воронка"></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "30%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Funnels;
