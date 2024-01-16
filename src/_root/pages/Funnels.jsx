import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../dummyData/ProductService";

function Funnels() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
  }, []);
  return (
    <div className="" style={{ maxWidth: "80%", margin: "0 auto" }}>
      <DataTable
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 100]}
        value={products}
        stripedRows
        showGridlines
        tableStyle={{ minWidth: "50rem" }}
        paginatorPosition="both"
      >
        <Column field="code" header="Code" sortable></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="category" header="Category" sortable></Column>
        <Column field="quantity" header="Quantity" sortable></Column>
      </DataTable>
    </div>
  );
}

export default Funnels;
