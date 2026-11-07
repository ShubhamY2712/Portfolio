import type { Metadata } from "next";
import ComingSoon from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return <ComingSoon title="Contact" />;
}
