import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import {RoomProvider} from "./context/RoomContext";
import {Home} from "./pages/Home";
import {Room} from "./pages/Room";
import {UserProvider} from "./context/UserContext";
import {Login} from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import {Logout} from "./pages/Logout";
import {PageNotFound} from "./pages/PageNotFound";

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
