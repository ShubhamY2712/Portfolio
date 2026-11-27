import type { Metadata } from "next";
import ComingSoon from "@/components/shell/ComingSoon";

export const metadata: Metadata = { title: "Experience" };

export default function Page() {
  return <ComingSoon title="Experience" />;
}
