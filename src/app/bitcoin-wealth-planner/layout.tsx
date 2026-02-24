import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin Wealth Planner",
};

export default function WhenShouldIInvestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
