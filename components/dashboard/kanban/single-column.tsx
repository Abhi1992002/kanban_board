import { Column, Id, Task } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  Badge,
  EllipsisVertical,
  Plus,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { CreateTaskDialog } from "@/components/small-ui/create-task";

export const SingleColumn = ({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
  tasks,
}: {
  column: Column;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (
    columnId: Id,
    content: string | undefined,
    tag_color: string | undefined,
    tag_name: string | undefined,
    date: Date | undefined,
    title: string | undefined
  ) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}) => {
  const [editmode, setEditmode] = useState(false);

  //  use sortable hook
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    // unique id for each column hook
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    //  disable drag and drop at the time of editing title
    disabled: editmode,
  });

  // when we are dragging column, our other colum shift, this transition happened due to this style
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  const taskIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  //  if we are dragging the column, we will change the background
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        key={column.id}
        className="max-w-[340px] w-[33vw] opacity-60 bg-background px-3 pt-3 text-center h-full border rounded-lg border-foreground/30"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={column.id}
      className="max-w-[340px] w-[33vw] max-h-[calc(100vh-94px)] overflow-hidden flex gap-2 flex-col bg-background  pt-3 text-center h-full"
    >
      {/* header */}
      <div
        // now we can only drag and drop using header
        {...attributes}
        {...listeners}
        onClick={() => setEditmode(true)}
        className="flex px-3 h-[50px] items-center relative"
      >
        {/* number of todos */}
        <Badge
          className={`rounded-full w-2 h-2 p-1 flex items-center justify-center mr-2 ${column.column_color}`}
        ></Badge>
        {/* title */}
        {editmode ? (
          <Input
            className="py-0 mx-4"
            autoFocus
            onChange={(e) => updateColumn(column.id, e.target.value)}
            onBlur={() => setEditmode(false)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              setEditmode(false);
            }}
          />
        ) : (
          <p className="font-bold flex-1 text-start">{column.title}</p>
        )}

        {/* delete button */}
        {/* <Button variant={"destructive"} onClick={() => deleteColumn(column.id)}>
          <Trash2 className="w-4 h-4" />
        </Button> */}
        {/* Dropdown */}
        <EllipsisVertical className="w-4 h-4 " />
      </div>

      {/* Create Task */}
      <CreateTaskDialog createTask={createTask} columnId={column.id} />

      {/*  content */}
      <div className="scroller w-full h-[calc(100%-110px)] flex  flex-col gap-2 text-sm overflow-y-auto">
        <SortableContext items={taskIds}>
          {tasks.map((task) => {
            if (task.columnId === column.id) {
              return (
                <TaskCard
                  updateTask={updateTask}
                  task={task}
                  deleteTask={deleteTask}
                />
              );
            }
          })}
        </SortableContext>
        <div className="w-full h-[60px] bg-gradient-to-t from-background to-transparent fixed bottom-0"></div>
      </div>
    </div>
  );
};
