"use client";
import { Id, Task } from "@/types";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { TrashIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
        key={task.id}
        className="w-full opacity-50 rounded-xl bg-primary text-background py-4 flex justify-between p-2 pl-4 pr-4 items-center"
      >
        <p className="whitespace-pre-wrap">
          {task.id}+{task.content}
        </p>

        {mouseIsOver && (
          <Button
            variant={"link"}
            size={"icon"}
            className="p-0 h-fit"
            onClick={() => deleteTask(task.id)}
          >
            <TrashIcon className="h-4 w-4 text-destructive" />
          </Button>
        )}
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
      className="w-full rounded-xl bg-task text-foreground/80 py-4 flex justify-between p-2 pl-4 items-center"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="whitespace-pre-wrap">
        {task.id}+{task.content}
      </p>

      {mouseIsOver && (
        <Button
          variant={"link"}
          size={"icon"}
          className="p-0 h-fit"
          onClick={() => deleteTask(task.id)}
        >
          <TrashIcon className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );
};
