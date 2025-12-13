
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Analyses - CV Saathi Admin",
  description: "View and manage your CV analyses",
};

export default function MyAnalysesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}