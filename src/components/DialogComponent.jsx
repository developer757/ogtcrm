import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export const DialogComponent = ({
  type,
  isAddDialogVisible,
  setIsAddDialogVisible,
  isEditDialogVisible,
  setIsEditDialogVisible,
  header,
  inputs,
  dialogInputObject,
  setDialogInputObject,
  handleAdd,
  handleEdit,
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
      visible={isAddDialogVisible || isEditDialogVisible}
      onHide={() =>
        setIsAddDialogVisible
          ? setIsAddDialogVisible(false)
          : setIsEditDialogVisible(false)
      }
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
                  value={dialogInputObject[index]}
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
              ) : (
                <span>Другой тип input</span>
              )}
            </div>
          );
        })}
        <div className="flex">
          <Button
            label={isAddDialogVisible ? "Добавить" : "Редактировать"}
            onClick={() => handleAdd(dialogInputObject)}
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};
