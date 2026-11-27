import type { Metadata } from "next";
import ComingSoon from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "Portfolio" };

export default function Page() {
  return <ComingSoon title="Portfolio" />;
}
