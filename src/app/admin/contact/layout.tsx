import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Inquiries - Career Sync User",
  description: "Manage contact inquiries and support tickets",
};

export default function ContactInquiriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}