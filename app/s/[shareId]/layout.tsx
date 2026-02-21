import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "文件分享 - FlowPan",
  description: "FlowPan 文件分享",
}

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children
}
