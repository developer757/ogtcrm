import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { getUsers, addUser } from "../utilities/api";

export const DialogComponent = ({
  isAddDialogVisible,
  setIsAddDialogVisible,
  isEditDialogVisible,
  setIsEditDialogVisible,
  header,
}) => {
  const dialogRoles = [{ name: "Admin" }, { name: "Buyer" }];
  const [dialogInputObject, setDialogInputObject] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    console.log(dialogInputObject);
  }, [dialogInputObject]);

  const handleDialogInputChange = (field, value) => {
    setDialogInputObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
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
            optionValue="name"
            placeholder="Выберите роль"
            className="w-full"
          />
        </div>
        <div className="flex">
          <Button
            label={isAddDialogVisible ? "Добавить" : "Редактировать"}
            onClick={() => handleAddUser(dialogInputObject)}
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
};
