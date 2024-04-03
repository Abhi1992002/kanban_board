import {
  Badge,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { SidebarHeader } from "./sidebar-header";

type Props = {};

export const Sidebar = (props: Props) => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SidebarHeader />
        <div className="flex-1">
          <FileList />
        </div>
      </div>
    </div>
  );
};

const FileList = () => {
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="#"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Home className="h-4 w-4" />
        Open Source Contribution
      </Link>
    </nav>
  );
};
