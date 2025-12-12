import Metadata from "next";

export const metadata: Metadata = {
  title: "CV Saathi Admin - Dashboard",
  description: "Admin Dashboard - Together We Grow, Together We Improve",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}