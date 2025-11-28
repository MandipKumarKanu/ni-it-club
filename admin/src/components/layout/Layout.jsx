import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <Header onMenuToggle={toggleMobileMenu} />
      <main className="ml-0 md:ml-64 pt-20 mt-4 p-4 md:p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
