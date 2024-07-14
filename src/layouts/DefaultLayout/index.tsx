import { PropsWithChildren } from "react";
import Footer from "../Footer";

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-neutral-50">
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}
