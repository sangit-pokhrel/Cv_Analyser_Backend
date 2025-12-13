
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Settings - CV Saathi Admin",
  description: "View and manage users settings",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}