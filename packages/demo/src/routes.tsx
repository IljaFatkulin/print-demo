import { Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Connect from "./routes/connect";
import Product from "./routes/product";

export default function RoutesList() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/product/:id" element={<Product />} />
    </Routes>
  );
}
