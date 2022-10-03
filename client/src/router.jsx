import {
    createBrowserRouter,
  } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Room from "./components/Room";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/room/:roomId",
            element: <Room />
        }
      ]
    }
  ]);

  export default router;