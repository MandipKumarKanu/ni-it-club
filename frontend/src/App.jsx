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
import Tips from "./pages/Tips/Tips";
import TipDetails from "./pages/Tips/TipDetails";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";
import useResetScrollPosition from "./components/hook/useResetScrollPosition";
import FullPageLoader from "./components/ui/FullPageLoader";

import useSettingsStore from "./store/useSettingsStore";
import useHomeStore from "./store/useHomeStore";

function App() {
  const location = useLocation();
  useResetScrollPosition(location);
  const { fetchSettings } = useSettingsStore();
  const { fetchHomeData, loading, homeData } = useHomeStore();

  useEffect(() => {
    fetchSettings();
    fetchHomeData();
  }, [fetchSettings, fetchHomeData]);

  if (loading && !homeData) {
    return <FullPageLoader />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/:slug" element={<TipDetails />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
