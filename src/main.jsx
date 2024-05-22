import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sooner } from "@/components/ui/sonner";
import { StaffsContextProvider } from "./context/staffContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { RoomTypeContextProvider } from "./context/roomTypeContext.jsx";
import { RoomContextProvider } from "./context/roomContext.jsx";
import { StaffAuthContextProvider } from "./context/staffAuthContext.jsx";
import { TaskContextProvider } from "./context/TaskContext.jsx";
import { NotiContextProvider } from "./context/notiContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RoomContextProvider>
        <StaffsContextProvider>
          <RoomTypeContextProvider>
            <StaffAuthContextProvider>
              <TaskContextProvider>
                <NotiContextProvider>
                  <App />
                </NotiContextProvider>
              </TaskContextProvider>
            </StaffAuthContextProvider>
          </RoomTypeContextProvider>
        </StaffsContextProvider>
      </RoomContextProvider>
    </AuthContextProvider>
    <Sooner />
    <Toaster />
  </React.StrictMode>
);
