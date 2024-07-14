import { PropsWithChildren } from "react";
import Topbar from "./Topbar";
import Footer from "../Footer";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-neutral-50">
      <div className="min-h-screen flex flex-col">
        <Topbar />
        {children}
      </div>
      <Footer links />
    </div>
  );
}
