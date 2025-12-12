import React from "react";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f6f6f6",
        }}
      >
        {children}
      </body>
    </html>
  );
}
