import { BrowserRouter, Routes, Route } from "react-router-dom";
import Credentials from "./pages/Credentials";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Credentials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
