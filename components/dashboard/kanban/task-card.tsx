"use client";
import { Id, Task } from "@/types";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Separator } from "@/components/ui/separator";

type Props = {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
};

export const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editmode, setEditmode] = useState(false);

  const toggleEditMode = () => {
    setEditmode((prev) => !prev);
    setMouseIsOver(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    // unique id for each column hook
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    //  disable drag and drop at the time of editing title
    disabled: editmode,
  });

  // when we are dragging column, our other colum shift, this transition happened due to this style
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={toggleEditMode}
        key={task.id}
        className="w-full rounded-xl bg-background text-foreground/80 border border-foreground/40 border-dashed py-4 flex flex-col justify-between p-2 pl-4"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <p className=" text-foreground/80 text-start text-sm mb-2 opacity-0">
          Due - {task.date?.toLocaleDateString()}
        </p>

        <Separator className=" bg-foreground/10 opacity-0" />

        {/* top section - tags + dropdown*/}
        <div className="flex mt-2 opacity-0">
          <div className="flex-1">
            <div
              className={`bg-green-400 text-background w-fit text-xs py-1 px-3 font-semibold mb-4 rounded-full`}
            >
              {task.tag_name}
            </div>
          </div>
        </div>

        {/* Title */}
        <p className=" text-foreground/80 opacity-0 text-start">{task.title}</p>

        {/* Content */}
        <p className=" text-foreground/50 opacity-0 text-start mt-2">
          {task.content}
        </p>
      </div>
    );
  }

  if (editmode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        key={task.id}
        className="w-full rounded-xl bg-task text-foreground/80 py-4 flex justify-between p-2 pl-4 pr-4 items-center"
      >
        <Textarea
          className="h-[90%] w-full text-foreground"
          autoFocus
          value={task.content}
          placeholder="Task Content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
            } else if (e.key === "Enter") {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      key={task.id}
      className="w-full rounded-xl bg-task border text-foreground/80 py-4 flex flex-col justify-between p-2 pl-4"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className=" text-foreground/80 text-start text-sm mb-2">
        Due - {task.date?.toLocaleDateString()}
      </p>

      <Separator className=" bg-foreground/10" />

      {/* top section - tags + dropdown*/}
      <div className="flex mt-2">
        <div className="flex-1">
          <div
            className={`bg-green-400 text-background w-fit text-xs py-1 px-3 font-semibold mb-4 rounded-full`}
          >
            {task.tag_name}
          </div>
        </div>
        <div>
          <MoreVerticalIcon className="h-4 w-4" />
        </div>
      </div>

      {/* Title */}
      <p className=" text-foreground/80 text-start">{task.title}</p>

      {/* Content */}
      <p className=" text-foreground/50 text-start mt-2">{task.content}</p>

      {/* {mouseIsOver && (
        <Button
          variant={"link"}
          size={"icon"}
          className="p-0 h-fit"
          onClick={() => deleteTask(task.id)}
        >
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      )} */}
    </div>
  );
};
