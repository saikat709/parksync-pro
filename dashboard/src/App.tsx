import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Layout from "./Layout";
import Page404 from "./pages/Page404";

    const router = createBrowserRouter([
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            path: "/",
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
            path: "*",
            element: <Page404 />,
          }
        ]
      },
  ]);

function App() {

  return ( <RouterProvider router={router} /> );
}

export default App
