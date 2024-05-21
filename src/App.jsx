import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LoginForm } from "./pages/Client/Login/components/Login";
import { AdminRoutes } from "./routes/routes";
import { useEffect } from "react";
import { socket } from "./socket";
import { useStaffAuthContext } from "./hooks/useStaffAuth";

function App() {
  return (
    <>
      <BrowserRouter>
        <AdminRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
