import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {RoomProvider} from "./context/RoomContext";
import {Home} from "./pages/home/Home";
import {Room} from "./pages/dashboard/Room";
import {UserProvider} from "./context/UserContext";
import {Login} from "./pages/Login";
import {Logout} from "./pages/Logout";
import {PageNotFound} from "./pages/PageNotFound";
import reportWebVitals from './reportWebVitals';
import ProtectedRoute from "./pages/ProtectedRoute";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <UserProvider>
              <RoomProvider>
                  <Routes>
                      <Route path="/login" index element={<Login />} />
                      <Route path="/logout" index element={<Logout />} />
                      <Route path="/dashboard" element={<ProtectedRoute />}>
                          <Route index element={<Home />} />
                          <Route path="room/:id" element={<Room />} />
                      </Route>
                      <Route path="*" element={<PageNotFound />} />
                  </Routes>
              </RoomProvider>
          </UserProvider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
