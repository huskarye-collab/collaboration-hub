
import "./globals.css";

export const metadata = {
  title: "CollabHub | Collaboration Requests",
  description: "Submit a collaboration request."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
