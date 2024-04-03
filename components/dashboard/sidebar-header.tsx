import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

type Props = {};

export const SidebarHeader = (props: Props) => {
  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="">Kanban.</span>
      </Link>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </div>
  );
};
