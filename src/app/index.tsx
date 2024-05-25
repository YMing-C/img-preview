import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout, ErrorPage } from "components";
import Home from "./home";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import "dayjs/locale/zh-cn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Home />,
        index: true,
      },
    ],
  },
]);

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router}></RouterProvider>
    </ConfigProvider>
  );
}

export default App;
