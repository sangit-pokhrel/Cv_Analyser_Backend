
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Job Matches - Career Sync Admin",
  description: "View and manage your job matches",
};

export default function JobMatchesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}