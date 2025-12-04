import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Showcase", path: "/showcase" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-ni-white border-b-3 border-ni-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="shrink-0 flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#076F8C] text-ni-neon flex items-center justify-center font-bold text-xl border-2 border-transparent group-hover:bg-ni-neon group-hover:text-[#076F8C] group-hover:border-ni-black transition-colors">
              NI
            </div>
            <span className="font-bold text-2xl tracking-tighter uppercase">
              IT Club
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-lg font-bold uppercase tracking-wide hover:text-ni-red transition-colors ${
                  isActive(link.path)
                    ? "text-ni-red underline decoration-4 underline-offset-4"
                    : "text-ni-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* <Button variant="primary" className="ml-4">
              Join Us
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ni-black hover:text-ni-red focus:outline-none"
            >
              {isOpen ? (
                <X size={32} strokeWidth={3} />
              ) : (
                <Menu size={32} strokeWidth={3} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-ni-white border-b-3 border-ni-black absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 text-xl font-bold uppercase border-2 border-transparent hover:bg-ni-neon hover:border-ni-black transition-all ${
                  isActive(link.path)
                    ? "bg-ni-black text-ni-neon"
                    : "text-ni-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* <div className="pt-4">
              <Button variant="primary" className="w-full justify-center">
                Join Us Today
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
