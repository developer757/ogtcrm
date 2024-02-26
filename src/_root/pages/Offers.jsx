import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  getOffers,
  getCountries,
  getFunnels,
  deleteUser,
  addUser,
  editUser,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";
import { Chip } from "primereact/chip";

function Offers() {
  const [offers, setOffers] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [funnelsNames, setFunnelsNames] = useState([]);
  const [geoNames, setGeoNames] = useState([]);
  const [selectedFunnels, setSelectedFunnels] = useState(null);
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [offerStartDate, setOfferStartDate] = useState(null);
  const [offerEndDate, setOfferEndDate] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    cap: "",
    funnels: [],
    geo: [],
    offer_start: "",
    offer_end: "",
  });

  const toast = useRef(null);

  const addDialogInputs = [
    {
      label: "Оффер",
      key: "name",
      type: "text",
      placeholder: "Введите название оффера",
    },
    {
      label: "Капа",
      key: "cap",
      type: "text",
      placeholder: "Введите капу",
    },
    {
      label: "Воронки",
      key: "funnels",
      type: "multiselect funnels",
      placeholder: "Выберите воронки",
      options: funnelsNames,
    },
    {
      label: "Гео",
      key: "geo",
      type: "multiselect geo",
      placeholder: "Выберите гео",
      options: geoNames,
    },
    {
      label: "Начало капы",
      key: "offer_start",
      type: "calendar offerstart",
      placeholder: "Выберите начало капы",
    },
    {
      label: "Конец капы",
      key: "offer_end",
      type: "calendar offerend",
      placeholder: "Выберите конец капы",
    },
  ];

  // const editDialogInputs = [
  //   {
  //     label: "Имя",
  //     key: "name",
  //     type: "text",
  //     placeholder: "Введите имя",
  //   },
  //   {
  //     label: "Почта",
  //     key: "email",
  //     type: "text",
  //     placeholder: "Введите почту",
  //   },
  //   {
  //     label: "Роль",
  //     key: "role",
  //     type: "dropdown",
  //     placeholder: "Выберите роль",
  //     options: funnelsArray,
  //   },
  // ];

  useEffect(() => {
    console.log(offers);
    console.log(geoNames);
    console.log(funnelsNames);
    console.log(selectedFunnels);
    console.log(selectedGeo);
  });

  useEffect(() => {
    renderOffers();
    getFunnels().then((response) => {
      setFunnelsNames(response.data);
    });
    getCountries().then((response) => {
      setGeoNames(getFilteredGeoNames(response.data));
    });
  }, []);

  const renderOffers = () => {
    getOffers().then(function (response) {
      setOffers(response.data);
    });
  };

  const getFilteredGeoNames = (array) => {
    return array.map((obj) => {
      const { iso } = obj;
      return { iso };
    });
  };

  const handleTogglePopUp = (option, e, users) => {
    if (option === "add") {
      showPopUp(e);
    } else {
      console.log(users);
      setDialogInputObject({
        name: users.name,
        email: users.email,
        role: users.role,
      });
      setIsEditDialogVisible(true);
    }
    setSelectedUserID(users.id);
  };

  useEffect(() => {
    console.log(selectedUserID);
  }, [selectedUserID]);

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteUser(selectedUserID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedUserID(null);
  };

  const formatCalendarTime = (timestamp, option) => {
    if (option === "to string") {
      const originalDate = new Date(timestamp);
      const hours = timestamp.getHours().toString().padStart(2, "0");
      const minutes = timestamp.getMinutes().toString().padStart(2, "0");

      const formattedTime = `${hours}:${minutes}`;
      return formattedTime;
    } else {
      const dateString = timestamp;
      const [year, month, day] = dateString.split("-");
      const formattedDate = new Date(year, month - 1, day);

      return formattedDate;
    }
  };

  const actionButtonsTemplate = (users) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleTogglePopUp("edit", e, users)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp("add", e, users)}
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
          showAcceptToast();
          renderOffers();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Fill all fields");
    }
  };

  const handleEditUser = ({ name, email, role }) => {
    if (name !== "" && email !== "" && role !== "") {
      editUser(dialogInputObject, selectedUserID)
        .then(function (response) {
          setIsEditDialogVisible(false);
          renderOffers();
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Fill all fields");
    }
  };

  const handleDeleteUser = () => {
    console.log(dialogInputObject, selectedUserID);
    deleteUser(selectedUserID)
      .then(function (response) {
        showAcceptToast();
        renderOffers();
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

  const funnelsTemplate = (object) => {
    const funnelsArray = JSON.parse(object.funnels);
    return (
      <div className="flex gap-2">
        {funnelsArray.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    );
  };

  const geoTemplate = (object) => {
    const geoArray = JSON.parse(object.geo);
    return (
      <div className="flex gap-2">
        {geoArray.map((item) => (
          <Chip key={item} label={item} />
        ))}
      </div>
    );
  };

  const capTimeTemplate = (object) => {
    return (
      <div className="flex flex-column">
        {object["offer_start"].slice(0, -3)} -{" "}
        {object["offer_end"].slice(0, -3)}
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <ConfirmPopup group="headless" content={popUpContent} />

      <DialogComponent
        type="add"
        isDialogVisible={isAddDialogVisible}
        setIsDialogVisible={setIsAddDialogVisible}
        header={"Добавить оффер"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={addDialogInputs}
        handleAdd={handleAddUser}
        selectedGeo={selectedGeo}
        geoNames={geoNames}
        setSelectedGeo={setSelectedGeo}
        selectedFunnels={selectedFunnels}
        funnelsNames={funnelsNames}
        setSelectedFunnels={setSelectedFunnels}
        offerStartDate={offerStartDate}
        setOfferStartDate={setOfferStartDate}
        offerEndDate={offerEndDate}
        setOfferEndDate={setOfferEndDate}
        formatCalendarTime={formatCalendarTime}
      />

      {/* <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Редактировать оффера"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditUser}
      /> */}

      <div className="flex flex-column align-items-center justify-content-center">
        <div
          className="flex justify-content-between my-5"
          style={{ width: "90%" }}
        >
          <h2 className="m-0">Оффера</h2>
          <Button
            label="Добавить"
            icon="pi pi-plus"
            onClick={() => setIsAddDialogVisible(true)}
          />
        </div>
        <DataTable
          value={offers}
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
          <Column field="name" header="Оффер"></Column>
          <Column field="cap" header="Капа"></Column>
          <Column
            field="funnels"
            header="Воронки"
            body={funnelsTemplate}
          ></Column>
          <Column field="geo" header="Гео" body={geoTemplate}></Column>
          <Column body={capTimeTemplate} header="Время капы"></Column>
          <Column field="active" header="Активность"></Column>
          <Column
            header="Действия"
            body={(users) => actionButtonsTemplate(users)}
          ></Column>
        </DataTable>
      </div>
    </>
  );
}

export default Offers;
