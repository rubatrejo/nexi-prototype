import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXI CMS — White-label Hotel Configuration",
  description: "TrueOmni command center for NEXI hotel kiosk branding",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
