import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

export const DialogComponent = ({
  type,
  isDialogVisible,
  setIsDialogVisible,
  header,
  inputs,
  dialogInputObject,
  setDialogInputObject,
  handleAdd,
  handleEdit,
  date,
  setDate,
  formatCalendarDate,
  formatCalendarTime,
  selectedGeo,
  geoNames,
  setSelectedGeo,
  selectedFunnels,
  funnelsNames,
  setSelectedFunnels,
  offerStartDate,
  setOfferStartDate,
  offerEndDate,
  setOfferEndDate,
}) => {
  useEffect(() => {
    console.log(dialogInputObject);
  }, [dialogInputObject]);

  const handleDialogInputChange = (field, value) => {
    setDialogInputObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <Dialog
      header={header}
      visible={isDialogVisible}
      onHide={() => setIsDialogVisible(false)}
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <div className="flex flex-column gap-4 mt-2">
        {inputs.map((input, index) => {
          if (input.options && input.options[0]) {
            var options = input.options[0];
            var firstKey = Object.keys(options)[0];
          }
          return (
            <div className="flex flex-column gap-2" key={index}>
              <h4 className="m-0">{input.label}</h4>
              {input.type === "text" ? (
                <InputText
                  value={dialogInputObject[input.key]}
                  onChange={(e) =>
                    handleDialogInputChange(input.key, e.target.value)
                  }
                  style={{ width: "100%" }}
                  placeholder={input.placeholder}
                />
              ) : input.type === "dropdown" ? (
                <Dropdown
                  value={dialogInputObject[input.key]}
                  onChange={(e) =>
                    handleDialogInputChange(input.key, e.target.value)
                  }
                  options={input.options}
                  optionLabel={firstKey}
                  optionValue={firstKey}
                  placeholder={input.placeholder}
                  className="w-full"
                />
              ) : input.type === "calendar" ? (
                <Calendar
                  value={date}
                  onChange={(e) => {
                    setDate(e.value);
                    handleDialogInputChange(
                      input.key,
                      formatCalendarDate(e.value, "to string")
                    );
                  }}
                  dateFormat="dd-mm-yy"
                />
              ) : input.type === "calendar offerstart" ? (
                <Calendar
                  value={offerStartDate}
                  timeOnly
                  onChange={(e) => {
                    setOfferStartDate(e.value);
                    handleDialogInputChange(
                      input.key,
                      formatCalendarTime(e.value, "to string")
                    );
                  }}
                  dateFormat="dd-mm-yy"
                />
              ) : input.type === "calendar offerend" ? (
                <Calendar
                  value={offerEndDate}
                  timeOnly
                  onChange={(e) => {
                    setOfferEndDate(e.value);
                    handleDialogInputChange(
                      input.key,
                      formatCalendarTime(e.value, "to string")
                    );
                  }}
                  dateFormat="dd-mm-yy"
                />
              ) : input.type === "multiselect funnels" ? (
                <MultiSelect
                  value={selectedFunnels}
                  onChange={(e) => setSelectedFunnels(e.value)}
                  options={funnelsNames}
                  optionLabel="name"
                  filterplaceholder="Выберите воронки"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              ) : input.type === "multiselect geo" ? (
                <MultiSelect
                  value={selectedGeo}
                  onChange={(e) => setSelectedGeo(e.value)}
                  options={geoNames}
                  optionLabel="iso"
                  filter
                  placeholder="Выберите гео"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              ) : (
                <span>Другой тип input</span>
              )}
            </div>
          );
        })}
        <div className="flex">
          <Button
            label={type === "add" ? "Добавить" : "Редактировать"}
            onClick={() =>
              type === "add"
                ? handleAdd(dialogInputObject)
                : handleEdit(dialogInputObject)
            }
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};
