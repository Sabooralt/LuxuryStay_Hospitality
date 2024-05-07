import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";
import { StaffsContextProvider } from "./context/staffContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { RoomTypeContextProvider } from "./context/roomTypeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <StaffsContextProvider>
        <RoomTypeContextProvider>
          <App />
        </RoomTypeContextProvider>
      </StaffsContextProvider>
    </AuthContextProvider>
    <Toaster />
  </React.StrictMode>
);
