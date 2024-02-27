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
  deleteOffer,
  addOffer,
  editOffer,
  editActivity,
  getSources,
} from "../../utilities/api";
import { ConfirmPopup } from "primereact/confirmpopup";
import { confirmPopup } from "primereact/confirmpopup";
import { DialogComponent } from "../../components/DialogComponent";
import { Chip } from "primereact/chip";
import { InputSwitch } from "primereact/inputswitch";

function Offers() {
  const [offers, setOffers] = useState(null);
  const [selectedOfferID, setSelectedOfferID] = useState(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [funnelsNames, setFunnelsNames] = useState([]);
  const [geoNames, setGeoNames] = useState([]);
  const [selectedFunnels, setSelectedFunnels] = useState(null);
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [offerStartDate, setOfferStartDate] = useState(null);
  const [offerEndDate, setOfferEndDate] = useState(null);
  const [activityChecked, setActivityChecked] = useState([]);
  const [sourcesNames, setSourcesNames] = useState([]);
  const [selectedSources, setSelectedSources] = useState(null);

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
    source: [],
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
    {
      label: "Источники",
      key: "source",
      type: "multiselect sources",
      placeholder: "Выберите источники",
    },
  ];

  const editDialogInputs = [
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
    {
      label: "Источники",
      key: "source",
      type: "multiselect sources",
      placeholder: "Выберите источники",
    },
  ];

  useEffect(() => {
    // console.log(offers);
    // console.log(geoNames);
    // console.log(funnelsNames);
    // console.log(selectedFunnels);
    // console.log(selectedGeo);
    // console.log(selectedOfferID);
    // console.log(sourcesNames);
    // console.log(activityChecked);
    // console.log(offers);
  });

  useEffect(() => {
    console.log(dialogInputObject);
  }, [dialogInputObject]);

  useEffect(() => {
    renderOffers();
    getFunnels().then((response) => {
      const funnelsArray = response.data.map(({ name }) => name);
      setFunnelsNames(funnelsArray);
    });
    getCountries().then((response) => {
      const geoArray = response.data.map(({ iso }) => iso);
      setGeoNames(geoArray);
    });
    getSources().then((response) => {
      const sourcesArray = response.data.map(({ name }) => name);
      setSourcesNames(sourcesArray);
    });
  }, []);

  const renderOffers = () => {
    getOffers().then(function (response) {
      const offerActiveArray = [];
      response.data.forEach((obj) => {
        offerActiveArray.push({
          id: obj.id,
          active: obj.active === 1,
        });
      });

      setOffers(response.data);
      setActivityChecked(offerActiveArray);
    });
  };

  const handleTogglePopUp = (option, e, rowData) => {
    console.log(rowData);
    if (option === "add") {
      showPopUp(e);
    } else {
      setDialogInputObject({
        name: rowData.name,
        cap: rowData.cap,
        funnels: JSON.parse(rowData.funnels),
        geo: JSON.parse(rowData.geo),
        offer_start: rowData.start,
        offer_end: rowData.end,
        source: JSON.parse(rowData.source),
      });
      setIsEditDialogVisible(true);
    }
    setSelectedOfferID(rowData.id);
  };

  useEffect(() => {
    console.log(selectedOfferID);
  }, [selectedOfferID]);

  const handleConfirmPopUpButtonClick = (option, hide) => {
    if (option === "accept") {
      handleDeleteOffer(selectedOfferID);
    } else {
      showRejectToast();
    }
    hide();
    setSelectedOfferID(null);
  };

  const formatCalendarTime = (timestamp, option) => {
    if (option === "to string") {
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

  const actionButtonsTemplate = (rowData) => {
    return (
      <div className="flex gap-3">
        <Button
          icon="pi pi-pencil"
          severity="success"
          aria-label="Search"
          onClick={(e) => handleTogglePopUp("edit", e, rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          aria-label="Cancel"
          onClick={(e) => handleTogglePopUp("add", e, rowData)}
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

  const handleAddOffer = ({
    name,
    cap,
    funnels,
    geo,
    offer_start,
    offer_end,
    source,
  }) => {
    if (
      (name !== "" &&
        cap !== "" &&
        funnels !== "" &&
        geo !== "" &&
        offer_start !== "" &&
        offer_end !== "",
      source !== "")
    ) {
      addOffer(dialogInputObject)
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

  const handleEditOffer = ({
    name,
    cap,
    funnels,
    geo,
    offer_start,
    offer_end,
    source,
  }) => {
    if (
      (name !== "" &&
        cap !== "" &&
        funnels !== "" &&
        geo !== "" &&
        offer_start !== "" &&
        offer_end !== "",
      source !== "")
    ) {
      editOffer(dialogInputObject, selectedOfferID)
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

  const handleDeleteOffer = () => {
    console.log(dialogInputObject, selectedOfferID);
    deleteOffer(selectedOfferID)
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
      <div className="flex flex-wrap max-w-30rem gap-2">
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

  const activityTemplate = (rowData) => {
    const item = activityChecked.find((el) => el.id === rowData.id);

    return (
      <InputSwitch
        key={item.id}
        checked={item.active}
        onChange={(e) => handleToggleActivity(item.id, e.value)}
      />
    );
  };

  const handleToggleActivity = (id, value) => {
    console.log(value);
    const transformedActive = value ? 1 : 0;
    handleEditActivity(id, transformedActive);
    setActivityChecked((prevActivityChecked) =>
      prevActivityChecked.map((item) =>
        item.id === id ? { ...item, active: value } : item
      )
    );
  };

  const handleEditActivity = (id, active) => {
    editActivity(id, active)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
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
        handleAdd={handleAddOffer}
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
        sourcesNames={sourcesNames}
        setSourcesNames={setSourcesNames}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
      />

      <DialogComponent
        type="edit"
        isDialogVisible={isEditDialogVisible}
        setIsDialogVisible={setIsEditDialogVisible}
        header={"Изменить оффер"}
        dialogInputObject={dialogInputObject}
        setDialogInputObject={setDialogInputObject}
        inputs={editDialogInputs}
        handleEdit={handleEditOffer}
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
        sourcesNames={sourcesNames}
        setSourcesNames={setSourcesNames}
        selectedSources={selectedSources}
        setSelectedSources={setSelectedSources}
      />

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
          <Column
            field="active"
            header="Активность"
            body={activityTemplate}
          ></Column>
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
