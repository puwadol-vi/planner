import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin VS Insurance Simulator",
};

export default function WhenShouldIInvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
