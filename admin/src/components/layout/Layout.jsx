import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-20 mt-4 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
