import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorPage from "components/ErrorPage";
import { Layout } from "components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
