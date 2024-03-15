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
        } else {
          setIsDialogVisible(false);
        }
      }}
      className="w-full max-w-25rem min-w-25rem"
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
              ) : input.type === "multiselect funnels" ? (
                <MultiSelect
                  value={dialogInputObject.funnels}
                  onChange={(e) => {
                    handleDialogInputChange(input.key, e.value);
                  }}
                  options={input.options}
                  filter
                  placeholder="Выберите воронки"
                  maxSelectedLabels={3}
                  className="w-full"
                />
              ) : input.type === "multiselect geo" ? (
                <MultiSelect
                  value={dialogInputObject.geo}
                  onChange={(e) => {
                    handleDialogInputChange(input.key, e.value);
                  }}
                  options={input.options}
                  filter
                  placeholder="Выберите гео"
                  maxSelectedLabels={3}
                  className="w-full"
                />
              ) : input.type === "multiselect sources" ? (
                <MultiSelect
                  value={dialogInputObject.source}
                  onChange={(e) => {
                    handleDialogInputChange(input.key, e.value);
                  }}
                  options={input.options}
                  filter
                  placeholder="Выберите источники"
                  maxSelectedLabels={3}
                  className="w-full"
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
