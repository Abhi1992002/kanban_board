import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { CreateProject } from "../small-ui/create_project";

type Props = {};

export const SidebarHeader = (props: Props) => {
  return (
    <div className="flex h-14 items-center border-b border-r px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex flex-1 items-center gap-2 font-semibold">
        <span className="">Kanban.</span>
      </Link>
      <CreateProject />
    </div>
  );
};
