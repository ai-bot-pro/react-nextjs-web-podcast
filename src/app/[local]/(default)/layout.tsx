import Header from "@/components/Header";
import { ReactNode } from "react";

export const runtime = "edge";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      {children}
    </div>
  );
}
