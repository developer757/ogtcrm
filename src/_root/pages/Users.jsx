import { useState, useEffect, useRef } from "react";

import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getUsers, addUser } from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";

function Users() {
  const [users, setUsers] = useState(null);
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const dialogRoles = [{ name: "Admin" }, { name: "Buyer" }];
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const toast = useRef(null);

  useEffect(() => {
    renderUsers();
  }, []);

  const renderUsers = () => {
    getUsers().then(function (response) {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    console.log(dialogInputObject);
  }, [dialogInputObject]);

  const actionButtonsTemplate = () => {
    return (
      <div className="flex gap-3">
        <Button icon="pi pi-pencil" severity="success" aria-label="Search" />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={confirm2}
        />
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
  const header = renderHeader();

  const accept = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "Удаление пользователя успешно",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "Удаление пользователя отклонено",
      life: 3000,
    });
  };

  const confirm2 = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Вы точно хотите удалить пользователя?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  const handleDialogInputChange = (field, value) => {
    if(field === "role") {
      console.log(value, value.name)
      setDialogInputObject((prevState) => ({
        ...prevState,
        [field]: value.name,
      }));
    } else {
      setDialogInputObject((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleAddUser = (dialogInputObject) => {
    addUser(dialogInputObject)
      .then(function (response) {
        renderUsers();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup />
      <Dialog
        header="Добавить пользователя"
        visible={isDialogVisible}
        onHide={() => setIsDialogVisible(false)}
        style={{ width: "30%" }}
      >
        <div className="flex flex-column gap-4 mt-2">
          <div className="flex flex-column gap-2">
            <h4 className="m-0">Имя</h4>
            <InputText
              value={dialogInputObject.name}
              onChange={(e) => handleDialogInputChange("name", e.target.value)}
              style={{ width: "100%" }}
              placeholder="Введите имя"
            />
          </div>
          <div className="flex flex-column gap-2">
            <h4 className="m-0">Почта</h4>
            <InputText
              value={dialogInputObject.email}
              onChange={(e) => handleDialogInputChange("email", e.target.value)}
              style={{ width: "100%" }}
              placeholder="Введите почту"
            />
          </div>
          <div className="flex flex-column gap-2">
            <h4 className="m-0">Пароль</h4>
            <InputText
              value={dialogInputObject.password}
              onChange={(e) =>
                handleDialogInputChange("password", e.target.value)
              }
              style={{ width: "100%" }}
              placeholder="Введите пароль"
            />
          </div>
          <div className="flex flex-column gap-2">
            <h4 className="m-0">Роль</h4>
            <Dropdown
              value={dialogInputObject.role}
              onChange={(e) => handleDialogInputChange("role", e.target.value)}
              options={dialogRoles}
              optionLabel="name"
              placeholder="Выберите роль"
              className="w-full"
            />
          </div>
          <div className="flex">
            <Button
              label="Добавить"
              onClick={() => handleAddUser(dialogInputObject)}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Пользователи</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsDialogVisible(true)}
          />
        </div>
        <DataTable
          value={users}
          paginator
          header={header}
          rows={10}
          stripedRows
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorPosition="top"
          filters={filters}
          style={{ width: "90%" }}
        >
          <Column field="id" header="ID"></Column>
          <Column field="name" header="Имя"></Column>
          <Column field="email" header="Почта"></Column>
          <Column field="role" header="Роль"></Column>
          <Column header="Действия" body={actionButtonsTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Users;
