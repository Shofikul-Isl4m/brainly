import { BrowserRouter, Routes, Route } from "react-router-dom";

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
