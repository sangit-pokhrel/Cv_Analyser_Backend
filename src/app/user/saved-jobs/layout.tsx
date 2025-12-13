
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Jobs - CV Saathi Admin",
  description: "View and manage your saved jobs",
};

export default function SavedJobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}