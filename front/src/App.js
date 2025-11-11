import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import { Reset } from "styled-reset";

function Layout() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/join";

  return (
    <>
      <Reset />
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <Layout />;
}