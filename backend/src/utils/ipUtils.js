/**
 * Get real client IP address (handles proxies like Vercel, Cloudflare, nginx)
 * @param {Object} req - Express request object
 * @returns {string} Client IP address or empty string
 */
const getClientIP = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    const clientIP = ips[0];
    if (clientIP && !isLocalIP(clientIP)) {
      return clientIP;
    }
  }

  const cfIP = req.headers["cf-connecting-ip"];
  if (cfIP && !isLocalIP(cfIP)) return cfIP;
  const realIP = req.headers["x-real-ip"];
  if (realIP && !isLocalIP(realIP)) return realIP;
  const vercelIP = req.headers["x-vercel-forwarded-for"];
  if (vercelIP) {
    const ips = vercelIP.split(",").map((ip) => ip.trim());
    if (ips[0] && !isLocalIP(ips[0])) return ips[0];
  }
  const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  if (ip && !isLocalIP(ip)) return ip;

  return "";
};

/**
 * Check if IP is localhost or private network
 * @param {string} ip - IP address to check
 * @returns {boolean} True if local/private IP
 */
const isLocalIP = (ip) => {
  if (!ip) return true;
  const cleanIP = ip.replace(/^::ffff:/, "");
  return (
    cleanIP === "127.0.0.1" ||
    cleanIP === "::1" ||
    cleanIP === "localhost" ||
    cleanIP.startsWith("192.168.") ||
    cleanIP.startsWith("10.") ||
    cleanIP.startsWith("172.16.") ||
    cleanIP.startsWith("172.17.") ||
    cleanIP.startsWith("172.18.") ||
    cleanIP.startsWith("172.19.") ||
    cleanIP.startsWith("172.20.") ||
    cleanIP.startsWith("172.21.") ||
    cleanIP.startsWith("172.22.") ||
    cleanIP.startsWith("172.23.") ||
    cleanIP.startsWith("172.24.") ||
    cleanIP.startsWith("172.25.") ||
    cleanIP.startsWith("172.26.") ||
    cleanIP.startsWith("172.27.") ||
    cleanIP.startsWith("172.28.") ||
    cleanIP.startsWith("172.29.") ||
    cleanIP.startsWith("172.30.") ||
    cleanIP.startsWith("172.31.")
  );
};

module.exports = { getClientIP, isLocalIP };
