import { Routes, Route } from "react-router-dom";

import {
  Domains,
  Funnels,
  Users,
  Spends,
  Offers,
  Sources,
  Statistics,
} from "./_root/pages";
import RootLayout from "./_root/RootLayout";

function App() {
  return (
    <>
      <Routes>
        {/* тут будет авторизация */}

        <Route element={<RootLayout />}>
          <Route path="/users" element={<Users />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/funnels" element={<Funnels />} />
          <Route path="/spends" element={<Spends />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
