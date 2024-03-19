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
  isLeadDialogDisabled,
  setIsLeadDialogDisabled,
  header,
  inputs,
  dialogInputObject,
  setDialogInputObject,
  handleAdd,
  handleEdit,
  formatCalendarDate,
  formatCalendarTime,
  dispatch,
}) => {
  const handleDialogInputChange = (field, value) => {
    setDialogInputObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(field, value);
  };

  return (
    <Dialog
      header={header}
      visible={isDialogVisible}
      resizable={false}
      draggable={false}
      onHide={() => {
        if (dispatch) {
          dispatch({
            type: "SET_PROPERTY",
            property: "isAddDialogVisible",
            payload: false,
          });
          dispatch({
            type: "SET_PROPERTY",
            property: "isEditDialogVisible",
            payload: false,
          });
          dispatch({
            type: "SET_PROPERTY",
            property: "isLeadDialogVisible",
            payload: false,
          });
        } else {
          setIsDialogVisible(false);
        }
      }}
      className={`w-full ${type !== "lead" ? "max-w-25rem" : ""} min-w-25rem`}
      style={{ maxWidth: "700px" }}
    >
      <div
        className={`${
          type === "lead"
            ? "w-full flex flex-wrap gap-3 mt-2 justify-content-center"
            : " flex flex-column gap-4 mt-2"
        }`}
      >
        {inputs.map((input, index) => {
          return (
            <div
              className="w-full flex flex-column gap-2"
              key={index}
              style={type === "lead" ? { maxWidth: "calc(50% - 0.5rem)" } : {}}
            >
              <h4 className="m-0">{input.label}</h4>
              {input.type === "text" ? (
                <InputText
                  value={dialogInputObject[input.key]}
                  onChange={(e) =>
                    handleDialogInputChange(input.key, e.target.value)
                  }
                  style={{ width: "100%" }}
                  placeholder={input.placeholder}
                  disabled={isLeadDialogDisabled}
                />
              ) : input.type === "dropdown" ? (
                <Dropdown
                  value={dialogInputObject[input.key]}
                  onChange={(e) =>
                    handleDialogInputChange(input.key, e.target.value)
                  }
                  options={input.options}
                  placeholder={input.placeholder}
                  className="w-full"
                  disabled={isLeadDialogDisabled}
                />
              ) : input.type === "calendar" ? (
                <Calendar
                  value={
                    input.key === "offer_start" || input.key === "offer_end"
                      ? formatCalendarTime(
                          dialogInputObject[input.key],
                          "to Date"
                        )
                      : formatCalendarDate(
                          dialogInputObject[input.key],
                          "to Date"
                        )
                  }
                  onChange={(e) => {
                    input.key === "offer_start" || input.key === "offer_end"
                      ? handleDialogInputChange(
                          input.key,
                          formatCalendarTime(e.value, "to string")
                        )
                      : handleDialogInputChange(
                          input.key,
                          formatCalendarDate(e.value, "to string")
                        );
                  }}
                  {...(input.key === "offer_start" || input.key === "offer_end"
                    ? { timeOnly: true }
                    : { dateFormat: "dd-mm-yy" })}
                  placeholder={input.placeholder}
                />
              ) : input.type === "multiselect" ? (
                <MultiSelect
                  value={dialogInputObject[input.key]}
                  onChange={(e) => {
                    handleDialogInputChange(input.key, e.value);
                  }}
                  options={input.options}
                  filter
                  maxSelectedLabels={3}
                  className="w-full"
                  placeholder={input.placeholder}
                />
              ) : (
                <span>Другой тип input</span>
              )}
            </div>
          );
        })}
        <div className="flex">
          <Button
            label={type === "add" ? "Добавить" : type === "edit" ? "Редактировать" : "Отправить"}

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
