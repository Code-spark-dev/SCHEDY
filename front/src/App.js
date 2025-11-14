import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import { Reset } from "styled-reset";

function Layout() {
  return (
    <>
      <Reset />
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