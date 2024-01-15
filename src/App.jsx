import { Routes, Route } from "react-router-dom";

import { Domains, Users } from "./_root/pages";
import RootLayout from "./_root/RootLayout";

function App() {
  return (
    <>
      <Routes>
        {/* тут будет авторизация */}

        <Route element={<RootLayout />}>
          <Route path="/users" element={<Users />} />
          <Route path="/domains" element={<Domains/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
