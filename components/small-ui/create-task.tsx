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
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Id } from "@/types";
import { CreateTaskUtils } from "./create-task-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  createTask: (
    columnId: Id,
    content: string | undefined,
    tag_color: string | undefined,
    tag_name: string | undefined,
    date: Date | undefined,
    title: string | undefined
  ) => void;
  columnId: Id;
};

export const CreateTaskDialog = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>();
  const [tag_color, setTagColor] = useState<string>();
  const [tag_name, setTagName] = useState<string>();
  const [date, setDate] = React.useState<Date>();
  const [title, setTitle] = React.useState<string>();

  const onCreatingTask = () => {
    setOpen(false);
    props.createTask(props.columnId, content, tag_color, tag_name, date, title);
  };
  const tags = [
    { name: "Important", color: "bg-red-500" },
    { name: "Moderate", color: "bg-yellow-500" },
    { name: "ok", color: "bg-green-500" },
  ];

  return (
    <div className="flex">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full bg-task p-4 flex items-center justify-center rounded-md">
          <Plus className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <p className="text-yellow-400 text-sm">Open source contribution</p>
            <Separator />
            <DialogDescription className="py-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-4"
                placeholder="Title"
              />
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-4"
                placeholder="Description"
              />
              <Select value={tag_name} onValueChange={setTagName}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Add Tag" />
                </SelectTrigger>
                <SelectContent className=" bg-background">
                  {tags.map((tag) => {
                    return (
                      <SelectItem value={tag.name}>
                        <div
                          className={`${tag.color} text-xs py-1 px-3 text-white rounded-full`}
                        >
                          {tag.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Separator />
              <CreateTaskUtils date={date} setDate={setDate} />
            </DialogDescription>
            <Separator />
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onCreatingTask}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
