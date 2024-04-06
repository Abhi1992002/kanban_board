"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { SelectProjectColor } from "./select_project_color";
import { Button } from "../ui/button";

type Props = {};

export const CreateProject = (props: Props) => {
  const [open, setOpen] = useState(false);
  const onCreatingProject = () => {
    setOpen(false);
  };

  return (
    <div className="flex">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-fit hover:scale-105 transition-all ease-in-out duration-300">
          <PlusCircleIcon className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <Separator />
            <DialogDescription className="py-4">
              <Input className="mb-4" placeholder="Enter a new Project" />
              <Separator />
              <SelectProjectColor />
            </DialogDescription>
            <Separator />
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onCreatingProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
