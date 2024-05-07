import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LoginForm } from "./pages/Client/Login/components/Login";
import { AdminRoutes } from "./routes/routes";


function App() {

  return (
    <>
   
    
    <BrowserRouter>
    <AdminRoutes/>
    
    </BrowserRouter>
    </>
  );
}

export default App;
