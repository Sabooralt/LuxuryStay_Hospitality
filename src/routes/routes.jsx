import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { Dashboard } from "@/pages/AdminDashboard/Rootlayout";
import { AddProduct } from "@/pages/AdminDashboard/components/AddProduct";
import { Staff } from "@/pages/AdminDashboard/pages/Staff";
import { SignupForm } from "@/pages/Client/Login/components/signup";
import { Rootlayout } from "@/pages/Client/Rootlayout";
import { Home } from "@/pages/Client/componenets/home";
import { LoginForm } from "@/pages/Client/Login/components/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { Guests } from "@/pages/AdminDashboard/pages/Guests";
import { Rooms } from "@/pages/AdminDashboard/pages/Rooms";

export const AdminRoutes = () => {
  const { user } = useAuthContextProvider();

  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
        <Route index element={user ? <Home /> : <Navigate to="/signup" />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignupForm />}
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : user?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <LoginForm />
            )
          }
        />
      </Route>

      {/*  Admin Routes */}
      <Route
        path="/admin"
        element={
          user && user.role === "admin" ? <Dashboard /> : <Navigate to="/" />
        }
      >
        <Route path="/admin/addproduct" element={<AddProduct />} />
        <Route path="/admin/staffs" element={<Staff />} />
        <Route path="/admin/guests" element={<Guests />} />
        <Route path="/admin/rooms" element={<Rooms />} />
      </Route>
    </Routes>
  );
};
