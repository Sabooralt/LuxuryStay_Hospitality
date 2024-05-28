import { Outlet } from "react-router-dom";
import { Navbar } from "./componenets/Navbar";
import { Footer } from "./componenets/Footer";

export const Rootlayout = () => {
  return (
    <div className="bg-white font-rubik">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
