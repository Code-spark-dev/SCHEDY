import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Reset } from 'styled-reset'

function App() {
  return (
    <Router>
      <Reset />
      <Header />
      <Home />
    </Router>
  );
}

export default App;
