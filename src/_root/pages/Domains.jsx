import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { getDomains, deleteDomain, addDomain } from "../../utilities/api";
import { DialogComponent } from "../../components/DialogComponent";

function Domains() {
  const [domains, setDomains] = useState([]);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    user: "",
  });

  const toast = useRef(null);

  const dialogUsers = [
    { name: "Dev57" },
    { name: "Dirty Harry" },
    { name: "DEP" },
    { name: "Kovalev" },
    { name: "Washington" },
  ];

  const inputs = [
    {
      label: "Название",
      key: "name",
      type: "text",
      placeholder: "Введите название домена",
    },
    {
      label: "Пользователь",
      key: "user",
      type: "dropdown",
      placeholder: "Выберите пользователя",
      options: dialogUsers,
    },
  ];

  useEffect(() => {
    renderDomains();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      showToast("success");
    }
  }, [toastMessage]);

  const renderDomains = () => {
    getDomains()
      .then((response) => {
        setDomains(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setToastMessage("Ошибка при загрузке воронок");
      });
  };

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

  const confirmDeleteDomain = (event, rowData) => {
    setCurrentRowData(rowData);
    confirmPopup({
      group: "headless",
      target: event.currentTarget,
      message: "Вы точно хотите удалить домен?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: deleteSelectedDomain,
      rejectDeletion,
    });
  };

  const rejectDeletion = () => {
    setToastMessage("Удаление домена отменено");
  };

  const deleteSelectedDomain = () => {
    if (currentRowData) {
      deleteDomain(currentRowData.id)
        .then(function (response) {
          setToastMessage(response.data.message);
          renderDomains();
        })
        .catch(function (error) {
          console.log(error);
          setToastMessage("Ошибка удаления домена");
        });
    }
  };

  const addNewDomain = () => {
    addDomain(dialogInputObject)
      .then(function (response) {
        setToastMessage(response.data.message);
        setIsAddDialogVisible(false);
        setDomainName("");
        renderDomains();
      })
      .catch(function (error) {
        setToastMessage("Ошибка при добавлении домена");
        setDomainName("");
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Поиск"
          />
        </span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button icon="pi pi-pencil" severity="success" aria-label="Search" />

        <Button
          onClick={(e) => confirmDeleteDomain(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
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
                  deleteSelectedDomain();
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
        <h2 className="m-0">Домены</h2>
        <Button
          label="Создать"
          icon="pi pi-plus"
          onClick={setIsAddDialogVisible}
        />
        <DialogComponent
          type="add"
          isAddDialogVisible={isAddDialogVisible}
          setIsAddDialogVisible={setIsAddDialogVisible}
          header={"Добавить домен"}
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleAdd={addNewDomain}
        />
      </div>

      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <DataTable
          value={domains}
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
            "domain_name",
            "user_name",
            "representative.name",
            "status",
          ]}
          header={renderHeader()}
          emptyMessage="Домен не найден."
        >
          <Column
            field="id"
            header="ID"
            sortable
            style={{ width: "20%" }}
          ></Column>
          <Column field="domain_name" header="Домен"></Column>
          <Column field="user_name" header="Пользователь"></Column>
          <Column
            field="category"
            header="Действие"
            body={actionBodyTemplate}
            style={{ width: "20%" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Domains;
