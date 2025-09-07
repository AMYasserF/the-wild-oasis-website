import { Suspense } from "react";
import SideNavigation from "../_components/SideNavigation";
import Spinner from "../_components/Spinner";

export default function Layout({children}) {
  return (
    <div className="grid h-full gap-12 grid-cols-[16rem_1fr]">
      <SideNavigation/>
      <div className="py-2">
        
        {children}
      
        
      </div>
    </div>
  );
}
