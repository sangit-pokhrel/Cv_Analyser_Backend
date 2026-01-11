
import type {Metadata} from "next";
import Applications from '../../../components/user/pages/Applications';

export const metadata: Metadata = {
  title: "Job Applications - Career Sync Admin",
  description: "View and manage your job applications",
};

export default function ApplicationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}