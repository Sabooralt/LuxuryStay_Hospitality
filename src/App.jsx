import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LoginForm } from "./pages/Client/Login/components/Login";
import { AdminRoutes } from "./routes/routes";
import { useEffect } from "react";
import { socket } from "./socket";
import { useStaffAuthContext } from "./hooks/useStaffAuth";

function App() {
  const { staff } = useStaffAuthContext();
  useEffect(() => {
    socket.connect();
    socket.emit("test", "hello!");
  }, []);

  useEffect(() => {
    if (staff) {
      const staffId = staff._id;
      socket.emit("login", {staffId});
    }
  }, [staff]);

  return (
    <>
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
