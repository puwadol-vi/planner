import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchasing Power",
};

export default function PurchasingPowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
