import { BrowserRouter, Routes, Route } from "react-router-dom";
import Credentials from "./pages/Credentials";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user" element={<Navbar />}></Route>
        <Route path="/" element={<Credentials />} />
        <Route path="/signup" element={<Credentials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
