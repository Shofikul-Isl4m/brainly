import { BrowserRouter, Routes, Route } from "react-router-dom";
import Credentials from "./pages/Credentials";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<Layout />}></Route>
        <Route path="/" element={<Credentials />} />
        <Route path="/signup" element={<Credentials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
