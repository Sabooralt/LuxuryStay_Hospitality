import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";
import { StaffsContextProvider } from "./context/staffContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { RoomTypeContextProvider } from "./context/roomTypeContext.jsx";
import { RoomContextProvider } from "./context/roomContext.jsx";
import { StaffAuthContextProvider } from "./context/staffAuthContext.jsx";
import { TaskContextProvider } from "./context/TaskContext.jsx";
import { NotiContextProvider } from "./context/notiContext.jsx";
import { BookingContextProvider } from "./context/bookingContext.jsx";
import { MemberContextProvider } from "./context/memberContext.jsx";
import "@fontsource-variable/rubik";
import { ThemeProvider } from "./ThemeProvider.jsx";
import { ServiceContextProvider } from "./context/serviceContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RoomContextProvider>
        <StaffsContextProvider>
          <RoomTypeContextProvider>
            <StaffAuthContextProvider>
              <TaskContextProvider>
                <NotiContextProvider>
                  <BookingContextProvider>
                    <MemberContextProvider>
                      <ServiceContextProvider>
                        
                      <App />
                      </ServiceContextProvider>
                    </MemberContextProvider>
                  </BookingContextProvider>
                </NotiContextProvider>
              </TaskContextProvider>
            </StaffAuthContextProvider>
          </RoomTypeContextProvider>
        </StaffsContextProvider>
      </RoomContextProvider>
    </AuthContextProvider>

    <Toaster />
  </React.StrictMode>
);
