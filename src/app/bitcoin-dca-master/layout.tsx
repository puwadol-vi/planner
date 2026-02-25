import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitcoin DCA Master",
};

export default function BitcoinDcaMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
