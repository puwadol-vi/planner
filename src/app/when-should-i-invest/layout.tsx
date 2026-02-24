import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When Should I Invest",
};

export default function WhenShouldIInvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
