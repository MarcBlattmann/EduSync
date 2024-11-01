import "./globals.css";

export const metadata = {
  title: "EduSync",
  description: "Learn smarter, learn better :)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
