import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home       from "./pages/Home";
import About      from "./pages/About";
import Layout     from "./Layout";
import Page404    from "./pages/Page404";
import LogsScreen from "./pages/LogsScreen";
import ZoneScreen from "./pages/ZoneScreen";

import { WebSocketProvider } from "./hooks/WebSocketContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        index: true,
        path: "/home",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/logs",
        element: <LogsScreen />,
      },
      {
        path: "/zones/:zoneId",
        element: <ZoneScreen />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
      {
        path: "*/*",
        element: <Page404 />,
      }
    ]
  },
]);


const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = "ws://127.0.0.1:8000/ws";

function App() {
  return (
    <WebSocketProvider url={wsUrl}>
      <RouterProvider router={router} /> 
    </WebSocketProvider>
  );
}

export default App
