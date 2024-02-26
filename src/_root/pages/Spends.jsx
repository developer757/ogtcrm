import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  addSpends,
  getSpends,
  getUsers,
  deleteSpends,
  editSpends,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";

function Spends() {
  const [spends, setSpends] = useState(null);
  const [users, setUsers] = useState(null);
  const [selectedSpendID, setSelectedSpendID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [dialogNames, setDialogNames] = useState([]);
  const [date, setDate] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    summary: "",
    date: "",
  });

  const toast = useRef(null);

  const addDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: dialogNames,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
      options: dialogNames,
    },
  ];

  const editDialogInputs = [
    {
      label: "Имя",
      key: "name",
      type: "dropdown",
      placeholder: "Введите имя",
      options: dialogNames,
    },
    {
      label: "Сумма",
      key: "summary",
      type: "text",
      placeholder: "Введите сумму",
    },
    {
      label: "Дата",
      key: "date",
      type: "calendar",
      placeholder: "Выберите дату",
      options: dialogNames,
    },
  ];
  useEffect(() => {
    console.log(dialogInputObject);
  }, [dialogInputObject]);

  useEffect(() => {
    console.log(dialogNames);
    console.log(users);
  }, [dialogNames, users]);

  const getFilteredUsers = (array) => {
    return array.map((obj) => {
      const { name } = obj;
      return { name };
    });
  };

  useEffect(() => {
    getUsers().then((response) => {
      setUsers(response.data);
      setDialogNames(getFilteredUsers(response.data));
    });
    console.log(dialogNames);
    renderSpends();
  }, []);

  const renderSpends = () => {
    getSpends().then(function (response) {
      setSpends(response.data);
      console.log(response.data);
    });
  };

  const handleTogglePopUp = (option, e, spends) => {
    if (option === "add") {
      showPopUp(e);
    } else {
      console.log(spends);

      setDialogInputObject({
        name: spends.name,
        summary: spends.summary,
        date: formatCalendarDate(spends.date),
      });
      setIsEditDialogVisible(true);
      console.log(formatCalendarDate(spends.date, "to timestamp"));
    }
    setSelectedSpendID(spends.id);
  };

  useEffect(() => {
    console.log(selectedSpendID);
  }, [selectedSpendID]);

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteSpend(selectedSpendID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedSpendID(null);
  };

  const actionButtonsTemplate = (spends) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleTogglePopUp("edit", e, spends)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp("add", e, spends)}
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
      detail: "Удаление расхода успешно",
      life: 3000,
    });
  };

  const showRejectToast = () => {
    toast.current.show({
      severity: "success",
      summary: "На связи",
      detail: "Удаление расхода отклонено",
      life: 3000,
    });
  };

  const handleAddSpend = ({ name, summary, date }) => {
    if (name !== "" && summary !== "" && date !== "") {
      addSpends(dialogInputObject)
        .then(function (response) {
          setIsAddDialogVisible(false);
          showAcceptToast();
          renderSpends();
          clearDialogInputObject();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Fill all fields");
    }
  };

  const handleEditSpend = ({ name, summary, date }) => {
    if (name !== "" && summary !== "" && date !== "") {
      editSpends(dialogInputObject, selectedSpendID)
        .then(function (response) {
          setIsEditDialogVisible(false);
          renderSpends();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Fill all fields");
    }
  };

  const handleDeleteSpend = () => {
    console.log(dialogInputObject, selectedSpendID);
    deleteSpends(selectedSpendID)
      .then(function (response) {
        showAcceptToast();
        renderSpends();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const clearDialogInputObject = () => {
    setDialogInputObject({
      name: "",
      summary: "",
      date: "",
    });
    console.log("cleared")
  };

  const showPopUp = (e) => {
    confirmPopup({
      group: "headless",
      target: e.currentTarget,
      message: "Вы точно хотите удалить расход?",
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

  const formatCalendarDate = (timestamp, option) => {
    if (option === "to string") {
      const originalDate = new Date(timestamp);
      const year = originalDate.getFullYear();
      const month = String(originalDate.getMonth() + 1).padStart(2, "0");
      const day = String(originalDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    } else {
      const dateString = timestamp;
      const [year, month, day] = dateString.split("-");
      const formattedDate = new Date(year, month - 1, day);

      return formattedDate;
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContent} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить расходы"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddSpend}
        date={date}
        setDate={setDate}
        formatCalendarDate={formatCalendarDate}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать расходы"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditSpend}
        date={date}
        setDate={setDate}
        formatCalendarDate={formatCalendarDate}
      />

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Расходы</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={spends}
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
          <Column field="summary" header="Сумма"></Column>
          <Column field="date" header="Дата"></Column>
          <Column
            header="Действия"
            body={(spends) => actionButtonsTemplate(spends)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Spends;
