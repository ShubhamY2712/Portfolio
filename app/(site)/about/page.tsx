import type { Metadata } from "next";
import ComingSoon from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <ComingSoon title="About" />;
}
