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
import { DashboardHome } from "@/pages/AdminDashboard/pages/Main";
import { Settings } from "@/pages/AdminDashboard/pages/Settings";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { StaffLogin } from "@/pages/Client/Login/components/staffLogin";
import { StaffDashboard } from "@/pages/StaffDashboard/components/pages/RootLayout";
import { StaffHome } from "@/pages/StaffDashboard/components/pages/Home";
import { Tasks } from "@/pages/AdminDashboard/pages/Task";
import { StaffTasks } from "@/pages/StaffDashboard/components/pages/Tasks";
import { StaffNotifications } from "@/pages/StaffDashboard/components/pages/Notifications";

export const AdminRoutes = () => {
  const { user } = useAuthContextProvider();
  const { staff } = useStaffAuthContext();

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
        <Route
          path="/StaffLogin"
          element={staff ? <Navigate to="/staff" /> : <StaffLogin />}
        />
      </Route>

      {/*  Admin Routes */}
      <Route
        path="/admin"
        element={
          user && user.role === "admin" ? <Dashboard /> : <Navigate to="/" />
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="/admin/addproduct" element={<AddProduct />} />
        <Route path="/admin/staffs" element={<Staff />} />
        <Route path="/admin/guests" element={<Guests />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* Staff Routes */}

      <Route
        path="/staff"
        element={staff ? <StaffDashboard /> : <StaffLogin />}
      >
        <Route index element={<StaffHome />} />

        <Route path="/staff/tasks" element={<StaffTasks />} />
        <Route path="/staff/Notifications" element={<StaffNotifications />} />
      </Route>
    </Routes>
  );
};
