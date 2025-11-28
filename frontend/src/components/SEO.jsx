import { useEffect } from "react";

/**
 * SEO Component - Sets document title and meta tags
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} keywords - SEO keywords
 * @param {string} image - OG image URL
 * @param {string} url - Canonical URL
 */
const SEO = ({
  title = "NI IT Club",
  description = "NI IT Club - Where Innovation Meets Community. Join us to level up your tech skills through workshops, hackathons, and tech talks.",
  keywords = "NI IT Club, IT Club, tech community, hackathons, workshops, coding, programming, Nepal",
  image = "/niit-c.png",
  url = "",
}) => {
  const fullTitle = title === "NI IT Club" ? title : `${title} | NI IT Club`;
  const siteUrl = "https://ni-itclub.web.app/"; // Update with actual URL

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMetaTag = (name, content, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("author", "NI IT Club");

    // Open Graph tags
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image.startsWith("http") ? image : `${siteUrl}${image}`, true);
    setMetaTag("og:url", url ? `${siteUrl}${url}` : siteUrl, true);
    setMetaTag("og:type", "website", true);
    setMetaTag("og:site_name", "NI IT Club", true);

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", fullTitle);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image.startsWith("http") ? image : `${siteUrl}${image}`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url ? `${siteUrl}${url}` : siteUrl);

    // Cleanup on unmount - reset to defaults
    return () => {
      document.title = "NI IT Club";
    };
  }, [fullTitle, description, keywords, image, url]);

  return null; // This component doesn't render anything
};

export default SEO;
