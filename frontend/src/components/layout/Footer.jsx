import React, { useState, useEffect } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
// import api from "../services/api";

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const socialIcons = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    instagram: Instagram,
    mail: Mail,
  };

  // Default social links if none provided
  const defaultSocials = [
    { platform: "github", url: "https://github.com/ni-it-club" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ];

  const socials =
    settings?.socialLinks?.length > 0 ? settings.socialLinks : defaultSocials;

  return (
    <footer className="bg-ni-black text-ni-white border-t-4 border-ni-neon py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-ni-neon uppercase tracking-tighter">
              {settings?.siteName || "NI IT Club"}
            </h2>
            <p className="text-ni-gray max-w-xs">
              {settings?.siteTagline ||
                "Where innovation meets technology. Join the revolution of brutalist coding."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase border-b-2 border-ni-neon inline-block pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/events"
                  className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/showcase"
                  className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4"
                >
                  Showcase
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase border-b-2 border-ni-neon inline-block pb-1">
              Connect
            </h3>
            <div className="flex space-x-4">
              {socials.map((social, index) => {
                const Icon = socialIcons[social.platform.toLowerCase()] || Mail;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:translate-y-[-4px] transition-all border-2 border-transparent hover:border-ni-white"
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-ni-gray/20 text-center text-ni-gray text-sm font-mono">
          &copy; {new Date().getFullYear()} {settings?.siteName || "NI IT Club"}
          . All rights reserved. Brutally designed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
