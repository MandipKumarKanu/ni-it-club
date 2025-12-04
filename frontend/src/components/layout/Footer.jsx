import React, { useState, useEffect } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Send,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import useSettingsStore from "../../store/useSettingsStore";
import NewsletterSubscribe from "../ui/NewsletterSubscribe";

const Footer = () => {
  const { settings } = useSettingsStore();

  const socialIcons = {
    github: Github,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    website: Globe,
    telegram: Send,
    whatsapp: MessageCircle,
    discord: MessageCircle,
    email: Mail,
  };

  const defaultSocials = [
    { platform: "github", url: "https://github.com/ni-it-club" },
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ];

  const socials =
    settings?.socialLinks?.length > 0
      ? settings.socialLinks.filter((link) => link.isActive && link.url)
      : defaultSocials;

  return (
    <footer className="bg-ni-black text-ni-white border-t-4 border-ni-neon py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-ni-neon uppercase tracking-tighter">
              {settings?.siteName || "NI IT Club"}
            </h2>
            <p className="text-ni-gray max-w-xs">
              {settings?.siteTagline ||
                "Where innovation meets technology. Join the revolution of brutalist coding."}
            </p>
          </div>

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
              <li>
                <Link
                  to="/tips"
                  className="hover:text-ni-neon hover:underline decoration-2 underline-offset-4"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            {/* Connect Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold uppercase border-b-2 border-ni-neon inline-block pb-1">
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((social, index) => {
                  const Icon =
                    socialIcons[social.platform.toLowerCase()] || Mail;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-ni-white text-ni-black p-2 hover:bg-ni-neon hover:-translate-y-1 transition-all border-2 border-transparent hover:border-ni-white"
                    >
                      <Icon size={24} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Subscribe - Below Connect */}
            <div className="pt-4 border-t border-ni-gray/30">
              <h3 className="text-xl font-bold uppercase border-b-2 border-ni-pink inline-block pb-1 mb-4">
                📬 Newsletter
              </h3>
              <p className="text-ni-gray text-sm mb-3">
                Get updates on events, projects & tech tips!
              </p>
              <NewsletterSubscribe variant="compact" />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-ni-gray/20 text-center text-ni-gray text-sm font-mono">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {settings?.siteName || "NI IT Club"} in association with{" "}
            <a
              href="https://nationalinfotechcollege.edu.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ni-blue text-xl hover:text-ni-neon transition-colors duration-300"
            >
              National Infotech College
            </a>
          </p>
          <p className="mt-2">
            Made Brutally by{" "}
            <a
              href="https://mandipkk.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ni-neon hover:text-ni-blue text-xl transition-colors duration-300"
            >
              Mandy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
