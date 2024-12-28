export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // browser should use relative path
    return '';
  }
  
  if (process.env.VERCEL_URL) {
    // reference for vercel.com deployment
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // reference for custom domain deployment
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT || 3000}`;
}
