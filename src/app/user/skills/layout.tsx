
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Skills - CV Saathi Admin",
  description: "View and manage your skills",
};

export default function SkillsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}