export function getDomain(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host; // This returns 'www.domain.com'
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
  