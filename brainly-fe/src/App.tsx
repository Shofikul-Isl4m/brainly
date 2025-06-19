import { BrowserRouter, Routes, Route } from "react-router-dom";
import Credentials from "./pages/Credentials";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="/" element={<Credentials />} />
        <Route path="/signup" element={<Credentials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
