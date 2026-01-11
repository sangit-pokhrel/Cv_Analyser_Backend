
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Skills - Career Sync Admin",
  description: "View and manage your skills",
};

export default function SkillsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}