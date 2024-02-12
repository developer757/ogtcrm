import { useState, useEffect, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import {
  getDomains,
  deleteDomain,
  addDomain,
  editDomain,
  getUsers,
} from "../../utilities/api";
import { MultiSelect } from "primereact/multiselect";
import { DialogComponent } from "../../components/DialogComponent";

function Domains() {
  const [domains, setDomains] = useState([]);

  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState({ text: "", severity: "" });
  const [currentRowData, setCurrentRowData] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    user: "",
  });

  const toast = useRef(null);
  const isMounting = useRef(true);

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
      options: users,
    },
  ];

  useEffect(() => {
    renderDomains();
    getUsers()
      .then((response) => {
        setUsers(
          response.data.map((user) => {
            return { name: user.name };
          })
        );
      })
      .catch((error) => {
        console.log(error);
        setToastMessage({
          text: "Ошибка при загрузке доменов",
          severity: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (!isMounting.current) {
      if (toastMessage) {
        showToast();
      }
    } else {
      isMounting.current = false;
    }
  }, [toastMessage]);

  const renderDomains = () => {
    getDomains()
      .then((response) => {
        const renamedData = response.data.map((item) => ({
          ...item,
          name: item.user_name,
        }));
        setDomains(renamedData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setToastMessage({
          text: "Ошибка при загрузке доменов",
          severity: "error",
        });
      });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const showToast = () => {
    toast.current.show({
      severity: toastMessage.severity,
      detail: toastMessage.text,
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
    setToastMessage({ text: "Удаление домена отменено", severity: "info" });
  };

  const deleteSelectedDomain = () => {
    if (currentRowData) {
      deleteDomain(currentRowData.id)
        .then(function (response) {
          setToastMessage({ text: response.data.message, severity: "success" });
          renderDomains();
        })
        .catch(function (error) {
          console.log(error);
          setToastMessage({
            text: "Ошибка удаления домена",
            severity: "error",
          });
        });
    }
  };

  const addNewDomain = () => {
    addDomain(dialogInputObject)
      .then(function (response) {
        setToastMessage({ text: response.data.message, severity: "success" });
        setIsAddDialogVisible(false);
        setDialogInputObject({});
        renderDomains();
      })
      .catch(function (error) {
        console.log(error);
        setToastMessage({
          text: "Ошибка добавления домена",
          severity: "error",
        });
      });
  };

  const handleEdit = (event, domains) => {
    console.log(domains);
    setCurrentRowData(domains.id);
    setIsEditDialogVisible(true);
    setDialogInputObject({
      name: domains.domain_name,
      user: domains.user_name,
    });
  };

  const editCurrentDomain = () => {
    editDomain(dialogInputObject, currentRowData)
      .then(function (response) {
        setToastMessage({ text: response.data.message, severity: "success" });
        setIsEditDialogVisible(false);
        setDialogInputObject({});
        renderDomains();
      })
      .catch(function (error) {
        setToastMessage({
          text: "Ошибка при редактировании домена",
          severity: "error",
        });
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
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleEdit(e, rowData)}
        />

        <Button
          onClick={(e) => confirmDeleteDomain(e, rowData)}
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
    );
  };

  const representativeFilterTemplate = (options) => {
    console.log(options.value, options);
    return (
      <MultiSelect
        value={options.value}
        options={users}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Any"
        optionLabel="name"
        optionValue="name"
        className="p-column-filter"
      />
    );
  };

  const representativeBodyTemplate = (rowData) => {
    console.log(rowData);

    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.user_name}</span>
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
          isDialogVisible={isAddDialogVisible}
          setIsDialogVisible={setIsAddDialogVisible}
          header={"Добавить домен"}
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleAdd={addNewDomain}
        />
        <DialogComponent
          type="edit"
          isDialogVisible={isEditDialogVisible}
          setIsDialogVisible={setIsEditDialogVisible}
          header={"Редактировать домен"}
          dialogInputObject={dialogInputObject}
          setDialogInputObject={setDialogInputObject}
          inputs={inputs}
          handleEdit={editCurrentDomain}
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
          <Column
            field="name"
            header="Пользователь"
            filter
            filterField="name"
            showFilterMatchModes={false}
            optionLabel="username"
            body={representativeBodyTemplate}
            filterElement={representativeFilterTemplate}
          ></Column>
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
