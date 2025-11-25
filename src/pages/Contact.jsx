import React, { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  HandDrawnArrow,
  Zigzag,
  CircleScribble,
  Dots,
} from "../components/ui/Doodles";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        alert("Message sent successfully!");
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      <Dots className="absolute top-0 right-0 w-64 h-64 text-ni-pink opacity-20 -z-10" />
      <CircleScribble className="absolute bottom-0 left-0 w-64 h-64 text-ni-cyan opacity-20 -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="relative">
          <HandDrawnArrow className="absolute -top-10 right-0 w-32 text-ni-black transform rotate-12 hidden lg:block" />

          <h1 className="text-7xl font-black uppercase tracking-tighter mb-10 relative z-10">
            Get in <br />
            <span className="text-ni-white bg-ni-black px-6 shadow-brutal inline-block transform -rotate-2 border-brutal">
              Touch
            </span>
          </h1>

          <p className="text-xl font-bold mb-12 border-l-8 border-ni-neon pl-6 py-2 bg-ni-white shadow-brutal transform rotate-1">
            Have questions? Want to partner with us? Or just want to say hi?
            Fill out the form or drop by our club room.
          </p>

          <div className="space-y-8 relative z-10">
            <Card
              rotate={-1}
              className="flex items-center gap-6 bg-ni-white hover:bg-ni-cyan transition-colors group"
            >
              <div className="bg-ni-black text-ni-neon p-4 border-brutal group-hover:rotate-12 transition-transform">
                <Mail size={32} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-black uppercase text-lg">Email Us</h3>
                <p className="font-mono font-bold text-lg">
                  contact@niitclub.com
                </p>
              </div>
            </Card>

            <Card
              rotate={1}
              className="flex items-center gap-6 bg-ni-white hover:bg-ni-pink hover:text-ni-white transition-colors group"
            >
              <div className="bg-ni-black text-ni-neon p-4 border-brutal group-hover:-rotate-12 transition-transform">
                <MapPin size={32} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-black uppercase text-lg">Visit Us</h3>
                <p className="font-mono font-bold text-lg">
                  National Infotech College
                </p>
              </div>
            </Card>

            <Card
              rotate={-1}
              className="flex items-center gap-6 bg-ni-white hover:bg-ni-neon transition-colors group"
            >
              <div className="bg-ni-black text-ni-neon p-4 border-brutal group-hover:rotate-12 transition-transform">
                <Phone size={32} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-black uppercase text-lg">Call Us</h3>
                <p className="font-mono font-bold text-lg">+977 980-000-0000</p>
              </div>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="mt-16 border-brutal shadow-brutal h-64 bg-ni-gray flex items-center justify-center relative overflow-hidden group transform rotate-2 hover:rotate-0 transition-transform">
            <div className="absolute inset-0 bg-[url('https://placehold.co/800x400/e0e0e0/a0a0a0?text=Map+View')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"></div>
            <div className="relative z-10 bg-ni-white border-brutal px-6 py-3 font-black uppercase shadow-brutal-sm transform -rotate-2 group-hover:scale-110 transition-transform">
              View on Google Maps
            </div>
            <Zigzag className="absolute bottom-0 left-0 w-full text-ni-black h-4" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-ni-black transform rotate-1"></div>
          <div className="bg-ni-neon border-brutal p-10 shadow-brutal-lg relative z-10 transform -rotate-1">
            <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-ni-black pb-4 inline-block">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-black uppercase mb-2 text-lg">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-4 border-brutal bg-ni-white font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_#000000] transition-all transform focus:-rotate-1 ${
                    errors.name ? "border-ni-red" : ""
                  }`}
                  placeholder="YOUR NAME"
                />
                {errors.name && (
                  <p className="text-ni-red font-black mt-2 text-sm bg-ni-white inline-block px-2 border-2 border-ni-black transform rotate-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-black uppercase mb-2 text-lg">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-4 border-brutal bg-ni-white font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_#000000] transition-all transform focus:rotate-1 ${
                    errors.email ? "border-ni-red" : ""
                  }`}
                  placeholder="YOUR@EMAIL.COM"
                />
                {errors.email && (
                  <p className="text-ni-red font-black mt-2 text-sm bg-ni-white inline-block px-2 border-2 border-ni-black transform rotate-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-black uppercase mb-2 text-lg">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full p-4 border-brutal bg-ni-white font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_#000000] transition-all transform focus:-rotate-1 ${
                    errors.subject ? "border-ni-red" : ""
                  }`}
                  placeholder="WHAT'S THIS ABOUT?"
                />
                {errors.subject && (
                  <p className="text-ni-red font-black mt-2 text-sm bg-ni-white inline-block px-2 border-2 border-ni-black transform rotate-1">
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-black uppercase mb-2 text-lg">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full p-4 border-brutal bg-ni-white font-bold focus:outline-none focus:shadow-[8px_8px_0px_0px_#000000] transition-all resize-none transform focus:rotate-1 ${
                    errors.message ? "border-ni-red" : ""
                  }`}
                  placeholder="TELL US EVERYTHING..."
                ></textarea>
                {errors.message && (
                  <p className="text-ni-red font-black mt-2 text-sm bg-ni-white inline-block px-2 border-2 border-ni-black transform rotate-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-ni-black text-ni-white hover:bg-ni-white hover:text-ni-black py-5 text-xl border-ni-white shadow-[8px_8px_0px_0px_#ffffff] hover:shadow-[8px_8px_0px_0px_#000000] hover:border-ni-black"
                disabled={submitted}
              >
                {submitted ? "Sending..." : "Send Message"}{" "}
                <Send className="ml-2" size={24} strokeWidth={3} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
