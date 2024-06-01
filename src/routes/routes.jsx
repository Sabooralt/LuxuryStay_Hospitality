import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { Dashboard } from "@/pages/AdminDashboard/Rootlayout";
import { AddProduct } from "@/pages/AdminDashboard/components/AddProduct";
import { Staff } from "@/pages/AdminDashboard/pages/Staff";
import { SignupForm } from "@/pages/Client/Login/components/signup";
import { Rootlayout } from "@/pages/Client/Rootlayout";
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
import { StaffRooms } from "@/pages/StaffDashboard/components/pages/Rooms";
import { StaffBookings } from "@/pages/StaffDashboard/components/pages/Bookings";
import { AdminBookings } from "@/pages/AdminDashboard/pages/Bookings";
import { Home } from "@/pages/Client/pages/Home";
import { Not_Found } from "@/404";
import { Blog } from "@/pages/Client/pages/Blog";
import { About } from "@/pages/Client/pages/About";
import { ContactUs } from "@/pages/Client/pages/Contact";
import { ClientRooms } from "@/pages/Client/pages/Rooms";
import { Profile } from "@/pages/Client/pages/Profile";
import { ProfileSettings } from "@/pages/Client/componenets/ProfileSettings";
import { ProfileHome } from "@/pages/Client/componenets/ProfileHome";
import { GuestBookings } from "@/pages/Client/componenets/ClientBookings";
import { Services } from "@/pages/AdminDashboard/pages/Services";
import { Transactions } from "@/pages/AdminDashboard/pages/Transactions";

export const AdminRoutes = () => {
  const { user } = useAuthContextProvider();
  const { staff } = useStaffAuthContext();
  return (
    <Routes>
      <Route path="/" element={<Rootlayout />}>
        <Route index element={user ? <Home /> : <Navigate to="/signup" />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/rooms" element={<ClientRooms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/signup" />}
        >
          <Route index element={<ProfileHome />} />
          <Route path="/profile/bookings" element={<GuestBookings />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
        </Route>
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

        <Route path="*" element={<Not_Found />} />
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
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/services" element={<Services />} />
        <Route path="/admin/services" element={<Transactions />} />
      </Route>

      {/* Staff Routes */}

      <Route
        path="/staff"
        element={staff ? <StaffDashboard /> : <StaffLogin />}
      >
        <Route index element={<StaffHome />} />

        <Route path="/staff/Tasks" element={<StaffTasks />} />
        <Route path="/staff/Notifications" element={<StaffNotifications />} />
        <Route path="/staff/Bookings" element={<StaffBookings />} />
        <Route path="/staff/Rooms" element={<StaffRooms />} />
      </Route>
    </Routes>
  );
};
