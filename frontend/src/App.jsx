import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Showcase from "./pages/Showcase";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import useResetScrollPosition from "./components/hook/useResetScrollPosition";

function App() {
  const location = useLocation();
  useResetScrollPosition(location);

  useEffect(() => {
    console.log("Hello!!!");
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
