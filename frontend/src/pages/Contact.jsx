import React, { useState, useEffect } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Globe,
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Calendar,
  HelpCircle,
  ArrowRight,
  Zap,
  Heart,
  Coffee,
  Code2,
  CheckCircle2,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTelegram,
  FaWhatsapp,
  FaDiscord,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  HandDrawnArrow,
  Zigzag,
  CircleScribble,
  Dots,
  Binary,
  Star,
  Chip,
  WavyLine,
  CurlyBrace,
} from "../components/ui/Doodles";

import useSettingsStore from "../store/useSettingsStore";
import api from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [openFaq, setOpenFaq] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { settings } = useSettingsStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setErrors({});

      try {
        await api.post("/contact", {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          category: activeTab,
        });

        setSuccessMessage(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccessMessage(false), 5000);
      } catch (err) {
        console.error("Failed to send message:", err);
        setErrors({
          submit: err.response?.data?.message || "Failed to send message",
        });
      } finally {
        setSubmitted(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const contactTabs = [
    {
      id: "general",
      label: "General",
      icon: MessageCircle,
      color: "bg-ni-cyan",
    },
    { id: "membership", label: "Join Us", icon: Users, color: "bg-ni-pink" },
    { id: "events", label: "Events", icon: Calendar, color: "bg-ni-blue" },
    { id: "support", label: "Help", icon: HelpCircle, color: "bg-ni-neon" },
  ];

  const faqs = [
    {
      question: "How can I join the NI IT Club?",
      answer:
        "Simply fill out the membership form on our website or visit us during club hours. We welcome all students interested in technology!",
      icon: Users,
    },
    {
      question: "Are the workshops free for members?",
      answer:
        "Yes! All workshops and events are free for registered members. Non-members can attend with a small fee.",
      icon: Coffee,
    },
    {
      question: "What kind of events do you organize?",
      answer:
        "We organize hackathons, coding workshops, tech talks, networking events, and social meetups throughout the year.",
      icon: Calendar,
    },
    {
      question: "Can I propose a project or workshop topic?",
      answer:
        "Absolutely! We love member-driven initiatives. Reach out to us with your ideas and we will help make it happen.",
      icon: Code2,
    },
  ];

  const socialConfig = {
    github: {
      icon: FaGithub,
      bgColor: "bg-[#333]",
      hoverBg: "hover:bg-[#24292e]",
    },
    linkedin: {
      icon: FaLinkedin,
      bgColor: "bg-[#0077B5]",
      hoverBg: "hover:bg-[#005885]",
    },
    facebook: {
      icon: FaFacebook,
      bgColor: "bg-[#1877F2]",
      hoverBg: "hover:bg-[#0d5bbd]",
    },
    instagram: {
      icon: FaInstagram,
      bgColor: "bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743]",
      hoverBg: "hover:opacity-90",
    },
    twitter: {
      icon: FaTwitter,
      bgColor: "bg-[#1DA1F2]",
      hoverBg: "hover:bg-[#0c85d0]",
    },
    youtube: {
      icon: FaYoutube,
      bgColor: "bg-[#FF0000]",
      hoverBg: "hover:bg-[#cc0000]",
    },
    discord: {
      icon: FaDiscord, 
      bgColor: "bg-[#5865F2]",
      hoverBg: "hover:bg-[#4752c4]",
    },
    telegram: {
      icon: FaTelegram,
      bgColor: "bg-[#0088cc]",
      hoverBg: "hover:bg-[#0077b5]",
    },
    whatsapp: {
      icon: FaWhatsapp,
      bgColor: "bg-[#25D366]",
      hoverBg: "hover:bg-[#128c7e]",
    },
    website: {
      icon: Globe,
      bgColor: "bg-ni-black",
      hoverBg: "hover:bg-gray-800",
    },
    email: {
      icon: Mail,
      bgColor: "bg-ni-neon",
      hoverBg: "hover:bg-yellow-500",
    },
  };

  const socialLinks =
    settings?.socialLinks
      ?.filter((link) => link.isActive && link.url)
      .map((link) => {
        const config = socialConfig[link.platform.toLowerCase()] || {
          icon: Globe,
          bgColor: "bg-gray-500",
          hoverBg: "hover:bg-gray-600",
        };
        return {
          ...config,
          label: link.platform.charAt(0).toUpperCase() + link.platform.slice(1),
          href: link.url,
        };
      }) || [];

  const contactMethods = [
    settings?.contactEmail && {
      icon: Mail,
      title: "Email Us",
      value: settings.contactEmail,
      subtitle: "We reply within 24 hours",
      href: `mailto:${settings.contactEmail}`,
      gradient: "from-ni-cyan to-ni-blue",
      iconBg: "bg-ni-cyan",
    },
    settings?.address && {
      icon: MapPin,
      title: "Visit Us",
      value: settings.address,
      subtitle: "Birgunj, Nepal",
      href: "https://maps.app.goo.gl/i78sAWgpooFtQAA99",
      gradient: "from-ni-pink to-purple-500",
      iconBg: "bg-ni-pink",
    },
    settings?.contactPhone && {
      icon: Phone,
      title: "Call Us",
      value: settings.contactPhone,
      subtitle: "Sun-Fri, 10AM-5PM",
      href: `tel:${settings.contactPhone}`,
      gradient: "from-ni-neon to-yellow-500",
      iconBg: "bg-ni-neon",
    },
  ].filter(Boolean);

  return (
    <div className="relative overflow-hidden bg-ni-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative min-h-[50dvh] flex items-center justify-center overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-ni-black via-gray-900 to-ni-black" /> */}

        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ni-neon/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-ni-pink/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ni-cyan/10 rounded-full blur-3xl" />
        </div> */}

        <Binary className="absolute top-20 left-20 text-ni-neon opacity-30 scale-150" />
        {/* <Binary className="absolute bottom-32 right-20 text-ni-cyan opacity-30 scale-150" /> */}
        <Chip className="absolute top-32 right-32 w-24 h-24 text-ni-pink opacity-30" />
        <Star className="absolute bottom-40 left-32 w-16 h-16 text-ni-neon opacity-40 animate-pulse" />
        <CurlyBrace className="absolute top-1/3 right-16 h-32 text-ni-white opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-ni-neon/20 border-2 border-ni-neon/50 px-6 py-2 mb-8 backdrop-blur-sm">
            <Zap size={18} className="text-ni-neon" />
            <span className="text-ni-neon font-bold uppercase tracking-wider">
              We would love to hear from you
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-ni-black mb-6">
            Let's{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-ni-black bg-ni-neon px-6 py-2 transform -rotate-2 inline-block border-4 border-ni-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                Connect
              </span>
              <Star className="absolute -top-6 -right-6 w-10 h-10 text-ni-pink animate-spin-slow" />
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-gray-400 max-w-2xl mx-auto mb-12">
            Got a question, idea, or just want to say hello? <br />
            <span className="text-ni-white">
              We are always excited to chat!
            </span>
          </p>

         
          {/* <div className="flex flex-wrap justify-center gap-4 mb-12">
            {contactMethods.map((method, index) => (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-center gap-3 bg-ni-white/10 backdrop-blur-sm border-2 border-ni-white/20 px-6 py-3 hover:bg-ni-white hover:border-ni-black transition-all duration-300 transform hover:-translate-y-1 hover:shadow-brutal"
              >
                <method.icon
                  size={20}
                  className="text-ni-neon group-hover:text-ni-black transition-colors"
                />
                <span className="font-bold text-ni-white group-hover:text-ni-black transition-colors">
                  {method.value}
                </span>
              </a>
            ))}
          </div> */}

          {/* <div className="animate-bounce">
            <ChevronDown size={32} className="text-ni-black/50 mx-auto" />
          </div> */}
        </div>

        {/* <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div> */}
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-20 relative">
            <HandDrawnArrow className="absolute -left-8 top-0 w-24 text-ni-black transform -rotate-45 hidden xl:block" />
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Get in{" "}
              <span className="relative">
                <span className="text-ni-white bg-ni-black px-6 py-2 inline-block transform rotate-1 border-brutal shadow-brutal">
                  Touch
                </span>
                <Dots className="absolute -bottom-8 -right-8 w-16 h-16 text-ni-pink opacity-50" />
              </span>
            </h2>
            <p className="text-xl font-bold text-gray-600 max-w-xl mx-auto">
              Choose your preferred way to reach us. We are here to help!
            </p>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative overflow-hidden border-brutal bg-ni-white p-8 transition-all duration-500 transform hover:-translate-y-3 ${
                  index === 0
                    ? "rotate-1"
                    : index === 1
                    ? "-rotate-1"
                    : "rotate-2"
                } hover:rotate-0`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div
                  className={`relative z-10 ${method.iconBg} w-20 h-20 flex items-center justify-center border-brutal mb-6 transform group-hover:scale-110 transition-all duration-300`}
                >
                  <method.icon
                    size={36}
                    strokeWidth={2.5}
                    className="text-ni-black group-hover:text-ni-white transition-colors"
                  />
                </div>

                <div className="relative z-10">
                  <h3 className="font-black uppercase text-2xl mb-2 group-hover:text-ni-white transition-colors">
                    {method.title}
                  </h3>
                  <p className="font-mono font-bold text-sm sm:text-base lg:text-lg mb-1 group-hover:text-ni-white transition-colors break-all">
                    {method.value}
                  </p>
                  <p className="text-sm font-bold text-gray-500 group-hover:text-ni-white/80 transition-colors">
                    {method.subtitle}
                  </p>
                </div>

                <ArrowRight
                  size={24}
                  className="absolute bottom-8 right-8 text-gray-300 group-hover:text-ni-white group-hover:translate-x-2 transition-all duration-300"
                />

                {/* <div className="absolute -top-2 -right-2 w-8 h-8 bg-ni-black transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative">
                <div className="absolute -inset-2 bg-ni-neon transform -rotate-2" />
                <Card className="relative z-10 bg-ni-white border-brutal p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-ni-black text-ni-neon p-3 border-brutal">
                      <Clock size={28} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-black uppercase text-2xl">
                      Club Hours
                    </h3>
                  </div>
                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                      <span className="font-bold">Sunday - Friday</span>
                      <span className="bg-ni-black text-ni-neon px-3 py-1 font-bold">
                        07:00 - 17:00
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200">
                      <span className="font-bold">Saturday</span>
                      <span className="bg-ni-pink text-ni-white px-3 py-1 font-bold">
                        Closed
                      </span>
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-bold text-gray-500 flex items-center gap-2">
                    <Heart size={16} className="text-ni-pink" />
                    We are always available online!
                  </p>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                  <span className="bg-ni-black text-ni-white px-4 py-2 transform -rotate-1">
                    Follow Us
                  </span>
                  <WavyLine className="w-20 text-ni-pink" />
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative w-14 h-14 ${social.bgColor} ${social.hoverBg} border-brutal flex items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-brutal cursor-target`}
                      title={social.label}
                    >
                      <social.icon
                        size={24}
                        className="text-ni-white"
                        strokeWidth={2}
                      />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-3 bg-ni-black transform rotate-2 group-hover:rotate-0 transition-transform" />
                <div className="relative z-10 border-brutal h-80 overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3554.288842546062!2d84.88951357613793!3d27.021037355425662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3993544895a7a145%3A0xa5ec5209baf5e1d4!2sNational%20Infotech%20College!5e0!3m2!1sen!2snp!4v1764057187522!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ni-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <a
                    href="https://maps.app.goo.gl/i78sAWgpooFtQAA99"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ni-white border-brutal px-6 py-3 font-black uppercase shadow-brutal text-sm hover:bg-ni-neon transition-colors flex items-center gap-2"
                  >
                    <MapPin size={18} /> Open in Maps
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-br from-ni-neon via-ni-cyan to-ni-pink opacity-20 blur-xl" />
                <div className="absolute -inset-2 bg-ni-black transform rotate-1" />

                <div className="relative z-10 bg-ni-white border-brutal p-8 md:p-12">
                  {successMessage && (
                    <div className="absolute inset-0 z-20 bg-ni-neon border-brutal flex flex-col items-center justify-center text-center p-8">
                      <CheckCircle2
                        size={80}
                        className="text-ni-black mb-6"
                        strokeWidth={2}
                      />
                      <h3 className="text-4xl font-black uppercase mb-4">
                        Message Sent!
                      </h3>
                      <p className="text-xl font-bold">
                        We will get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mb-10">
                    {contactTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group px-5 py-3 font-black uppercase text-sm border-brutal transition-all duration-200 flex items-center gap-2 cursor-target ${
                          activeTab === tab.id
                            ? `${tab.color} text-ni-white shadow-none translate-x-1 translate-y-1`
                            : "bg-gray-100 text-ni-black shadow-brutal-sm hover:-translate-y-1 hover:bg-gray-200"
                        }`}
                      >
                        <tab.icon size={18} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-black uppercase mb-3">
                      Send a Message
                    </h2>
                    <div className="flex items-center gap-2">
                      <Zigzag className="w-32 text-ni-pink h-3" />
                      <span className="text-gray-500 font-bold text-sm">
                        All fields required
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block  font-black uppercase mb-3 text-sm tracking-wider  items-center gap-2">
                          <span className="w-6 h-6 bg-ni-black text-ni-white flex items-center justify-center text-xs">
                            01
                          </span>
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full p-4 bg-gray-50 border-4 ${
                            errors.name
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 focus:border-ni-black"
                          } font-bold focus:outline-none focus:bg-ni-white transition-all`}
                          placeholder="Chhota Bheem"
                        />
                        {errors.name && (
                          <p className="text-red-500 font-bold mt-2 text-sm flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div className="group">
                        <label className="block font-black uppercase mb-3 text-sm tracking-wider items-center gap-2">
                          <span className="w-6 h-6 bg-ni-black text-ni-white flex items-center justify-center text-xs">
                            02
                          </span>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full p-4 bg-gray-50 border-4 ${
                            errors.email
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 focus:border-ni-black"
                          } font-bold focus:outline-none focus:bg-ni-white transition-all`}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 font-bold mt-2 text-sm flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-black uppercase mb-3 text-sm tracking-wider items-center gap-2">
                        <span className="w-6 h-6 bg-ni-black text-ni-white flex items-center justify-center text-xs">
                          03
                        </span>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full p-4 bg-gray-50 border-4 ${
                          errors.subject
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-ni-black"
                        } font-bold focus:outline-none focus:bg-ni-white transition-all`}
                        placeholder="What is this about?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 font-bold mt-2 text-sm flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-black uppercase mb-3 text-sm tracking-wider items-center gap-2">
                        <span className="w-6 h-6 bg-ni-black text-ni-white flex items-center justify-center text-xs">
                          04
                        </span>
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className={`w-full p-4 bg-gray-50 border-4 ${
                          errors.message
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-ni-black"
                        } font-bold focus:outline-none focus:bg-ni-white transition-all resize-none`}
                        placeholder="Tell us everything..."
                      />
                      {errors.message && (
                        <p className="text-red-500 font-bold mt-2 text-sm flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full" />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitted}
                      className={`w-full bg-ni-black text-ni-white border-brutal py-5 text-xl font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 cursor-target ${
                        submitted
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:bg-ni-neon hover:text-ni-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1"
                      }`}
                    >
                      {submitted ? (
                        <>
                          <Sparkles className="animate-spin" size={24} />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send
                            size={24}
                            strokeWidth={2.5}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" py-24 relative overflow-hidden">
        <Binary className="absolute top-10 right-10 text-ni-black opacity-5 scale-200" />
        <CircleScribble className="absolute bottom-10 left-10 w-64 h-64 text-ni-pink opacity-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16">
            <span className="inline-block bg-ni-pink text-ni-white px-4 py-2 font-black uppercase text-sm mb-4 transform -rotate-2 border-brutal">
              Got Questions?
            </span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
              FAQ
            </h2>
          </div>

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-brutal bg-ni-white overflow-hidden transition-all duration-300 ${
                  openFaq === index
                    ? "shadow-brutal-lg"
                    : "shadow-brutal hover:shadow-brutal-lg"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full p-6 flex items-center gap-4 text-left transition-colors cursor-target ${
                    openFaq === index ? "bg-ni-neon" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center border-brutal transition-colors ${
                      openFaq === index
                        ? "bg-ni-black text-ni-neon"
                        : "bg-gray-100"
                    }`}
                  >
                    <faq.icon size={24} />
                  </div>
                  <span className="flex-1 font-black uppercase text-lg">
                    {faq.question}
                  </span>
                  <div
                    className={`w-10 h-10 flex items-center justify-center border-brutal transition-all ${
                      openFaq === index
                        ? "bg-ni-black text-ni-white rotate-180"
                        : "bg-ni-white"
                    }`}
                  >
                    <ChevronDown size={24} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <div className="p-6 pt-0 border-t-4 border-ni-black">
                    <p className="font-bold text-lg text-gray-700 pl-16 mt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-5 overflow-hidden">
        <p className="mt-12 text-gray-500 font-bold flex items-center justify-center gap-2">
          <Coffee size={18} />
          Always open for a coffee chat!
        </p>
      </div>
    </div>
  );
};

export default Contact;
