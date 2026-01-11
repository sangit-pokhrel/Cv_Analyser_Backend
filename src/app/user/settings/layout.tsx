
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Settings - Career Sync Admin",
  description: "View and manage users settings",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}