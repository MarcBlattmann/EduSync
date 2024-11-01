import { UserProvider } from '@auth0/nextjs-auth0/client';
import "./globals.css";

export const metadata = {
  title: "EduSync",
  description: "Learn smarter, learn better :)",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </UserProvider>
  );
}
