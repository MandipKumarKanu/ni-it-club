import React, { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

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
      // Simulate submission
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-8">
            Get in <br />
            <span className="text-ni-white bg-ni-black px-4 shadow-brutal inline-block transform -rotate-1">
              Touch
            </span>
          </h1>

          <p className="text-xl font-medium mb-12 border-l-4 border-ni-neon pl-6">
            Have questions? Want to partner with us? Or just want to say hi?
            Fill out the form or drop by our club room.
          </p>

          <div className="space-y-6">
            <Card className="flex items-center gap-4 bg-ni-gray">
              <div className="bg-ni-black text-ni-neon p-3 border-2 border-ni-black">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm">Email Us</h3>
                <p className="font-mono">contact@niitclub.com</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 bg-ni-gray">
              <div className="bg-ni-black text-ni-neon p-3 border-2 border-ni-black">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm">Visit Us</h3>
                <p className="font-mono">Room 304, IT Block, NI Campus</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4 bg-ni-gray">
              <div className="bg-ni-black text-ni-neon p-3 border-2 border-ni-black">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm">Call Us</h3>
                <p className="font-mono">+1 (555) 123-4567</p>
              </div>
            </Card>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 border-3 border-ni-black shadow-brutal h-64 bg-ni-gray flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://placehold.co/800x400/e0e0e0/a0a0a0?text=Map+View')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"></div>
            <div className="relative z-10 bg-ni-white border-2 border-ni-black px-4 py-2 font-bold uppercase shadow-brutal-sm">
              View on Google Maps
            </div>
          </div>
        </div>

        <div className="bg-ni-neon border-4 border-ni-black p-8 shadow-brutal-lg">
          <h2 className="text-3xl font-black uppercase mb-6 border-b-4 border-ni-black pb-2 inline-block">
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-bold uppercase mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-4 border-3 border-ni-black bg-ni-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow ${
                  errors.name ? "border-ni-red" : ""
                }`}
                placeholder="YOUR NAME"
              />
              {errors.name && (
                <p className="text-ni-red font-bold mt-1 text-sm">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-4 border-3 border-ni-black bg-ni-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow ${
                  errors.email ? "border-ni-red" : ""
                }`}
                placeholder="YOUR@EMAIL.COM"
              />
              {errors.email && (
                <p className="text-ni-red font-bold mt-1 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-4 border-3 border-ni-black bg-ni-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow ${
                  errors.subject ? "border-ni-red" : ""
                }`}
                placeholder="WHAT'S THIS ABOUT?"
              />
              {errors.subject && (
                <p className="text-ni-red font-bold mt-1 text-sm">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full p-4 border-3 border-ni-black bg-ni-white focus:outline-none focus:shadow-[4px_4px_0px_0px_#000000] transition-shadow resize-none ${
                  errors.message ? "border-ni-red" : ""
                }`}
                placeholder="TELL US EVERYTHING..."
              ></textarea>
              {errors.message && (
                <p className="text-ni-red font-bold mt-1 text-sm">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-ni-black text-ni-white hover:bg-ni-white hover:text-ni-black py-4 text-xl"
              disabled={submitted}
            >
              {submitted ? "Sending..." : "Send Message"}{" "}
              <Send className="ml-2" size={20} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
