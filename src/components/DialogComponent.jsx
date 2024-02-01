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
  handleEdit
}) => {
  const dialogRoles = [{ name: "Admin" }, { name: "Buyer" }];

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
                  value={dialogInputObject.role}
                  onChange={(e) =>
                    handleDialogInputChange("role", e.target.value)
                  }
                  options={dialogRoles}
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Выберите роль"
                  className="w-full"
                />
              ) : (
                // Код, который будет отображаться для других типов input
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
