import { Dashboard } from "@/pages/AdminDashboard/Rootlayout";
import { AddProduct } from "@/pages/AdminDashboard/components/AddProduct";
import { Staff } from "@/pages/AdminDashboard/pages/Staff";
import { Rootlayout } from "@/pages/Client/Rootlayout";
import { Home } from "@/pages/Client/componenets/home";
import { LoginForm } from "@/pages/Login";
import { Route, Routes } from "react-router-dom";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
      </Route>

      {/*  //Admin Routes */}
      <Route path="/admin" element={<Dashboard />}>
        <Route path="/admin/addproduct" element={<AddProduct/>}/>
        <Route path="/admin/staff" element={<Staff/>} />
      </Route>
    </Routes>
  );
};
