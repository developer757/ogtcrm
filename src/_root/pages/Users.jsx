import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { getUsers, deleteUser, addUser } from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";

function Users() {
  const [users, setUsers] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const dialogRoles = [{ name: "Admin" }, { name: "Buyer" }];

  const toast = useRef(null);

  const inputs = [
    {
      label: "Имя",
      key: "name",
      type: "text",
      placeholder: "Введите имя",
      options: [],
    },
    {
      label: "Почта",
      key: "email",
      type: "text",
      placeholder: "Введите почту",
      options: [],
    },
    {
      label: "Пароль",
      key: "password",
      type: "text",
      placeholder: "Введите пароль",
      options: [],
    },
    {
      label: "Роль",
      key: "role",
      type: "dropdown",
      placeholder: "Выберите роль",
      options: dialogRoles,
    },
  ];
  
  useEffect(() => {
    renderUsers();
  }, []);

  const renderUsers = () => {
    getUsers().then(function (response) {
      setUsers(response.data);
    });
  };

  const handleTogglePopUp = (e, id) => {
    setSelectedUserID(id);
    showPopUp(e);
  };

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteUser(selectedUserID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedUserID(null);
  };

  const actionButtonsTemplate = (id) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={() => setIsEditDialogVisible(true)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp(e, id)}
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

  const showAcceptToast = () => {
    toast.current.show({
      severity: "info",
      summary: "До связи",
      detail: "Удаление пользователя успешно",
      life: 3000,
    });
  };

  const showRejectToast = () => {
    toast.current.show({
      severity: "success",
      summary: "На связи",
      detail: "Удаление пользователя отклонено",
      life: 3000,
    });
  };

  const handleAddUser = ({ name, email, password, role }) => {
    if (name !== "" && email !== "" && password !== "" && role !== "") {
      addUser(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          renderUsers();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Fill all fields");
    }
  };

  const handleDeleteUser = () => {
    console.log(selectedUserID);
    deleteUser(selectedUserID)
      .then(function (response) {
        showAcceptToast();
        renderUsers();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const showPopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить пользователя?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: showAcceptToast,
      reject: showRejectToast,
    });
  };

  const popUpContent = ({ message, acceptBtnRef, rejectBtnRef, hide }) => {
    return (
      <div className="border-round p-3">
        <span>{message}</span>
        <div className="flex align-items-center gap-2 mt-3">
          <Button
            ref={rejectBtnRef}
            label="Отменить"
            outlined
            severity="success"
            onClick={() => {
              handleConfirmPopUpButtonClick("reject", hide);
            }}
            className="p-button-sm w-full"
          />
          <Button
            ref={acceptBtnRef}
            outlined
            label="Удалить"
            severity="danger"
            onClick={() => {
              handleConfirmPopUpButtonClick("accept", hide);
            }}
            className="p-button-sm w-full"
          ></Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContent} />

      <DialogComponent
        type="add"
        isAddDialogVisible={isAddDialogVisible}
        setIsAddDialogVisible={setIsAddDialogVisible}
        header={"Добавить пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={inputs}
        handleAdd={handleAddUser}
      />

      <DialogComponent
        type="edit"
        isEditDialogVisible={isEditDialogVisible}
        setIsEditDialogVisible={setIsEditDialogVisible}
        header={"Редактировать пользователя"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={inputs}
        // handleEdit={}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Пользователи</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
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
          <Column
            header="Действия"
            body={(users) => actionButtonsTemplate(users.id)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Users;
