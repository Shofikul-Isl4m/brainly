import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Credentials from "./pages/Credentials";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";

import Profile from "./pages/Profile";
import SharedPage from "./pages/SharedPage";
import Youtube from "./pages/Youtube";
import Tweets from "./pages/Tweets";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="profile" element={<Profile />} />
          <Route path="youtube" element={<Youtube />} />
          <Route path="tweets" element={<Tweets />} />
        </Route>
        <Route path="/" element={<Credentials />} />
        <Route path="/signup" element={<Credentials />} />
        <Route path="/share/:id" element={<SharedPage />} />
        <Route path="youtube" element={<Youtube />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
