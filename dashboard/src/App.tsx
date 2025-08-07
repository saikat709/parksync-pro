import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home       from "./pages/Home";
import About      from "./pages/About";
import Layout     from "./Layout";
import Page404    from "./pages/Page404";
import LogsScreen from "./pages/LogsScreen";
import ZoneScreen from "./pages/ZoneScreen";

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

function App() {

  return ( <RouterProvider router={router} /> );
}

export default App
