
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Support - CV Saathi Admin",
  description: "View and manage your support tickets",
};

export default function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}