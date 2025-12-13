import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Inquiries - CV Saathi User",
  description: "Manage contact inquiries and support tickets",
};

export default function ContactInquiriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}