import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PanelPage from "./pages/PanelPage"; // Import the PanelPage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Route for the Panel Page */}
        <Route path="/panel" element={<PanelPage />} />
      </Routes>
    </Router>
  );
}

export default App;
