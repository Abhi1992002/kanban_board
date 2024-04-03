"use client";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle, Trash2, TrashIcon } from "lucide-react";
import { Column, Id, Task } from "@/types";
import { Badge } from "../ui/badge";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { Input } from "../ui/input";
import { TaskCard } from "./task-card";

type Props = {};

export const KanbanBoard = (props: Props) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  const createNewColumn = () => {
    const new_column_to_add = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, new_column_to_add]);
  };

  const ondragstart = (e: DragStartEvent) => {
    // this event gives us which column we are dragging
    if (e.active.data.current?.type == "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type == "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };

  const deleteColumn = (id: string | number) => {
    setColumns((columns) => columns.filter((column) => column.id !== id));
    // delete all tasks in the column also
    setTasks((tasks) => tasks.filter((task) => task.columnId !== id));
  };

  const ondragend = (e: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    // we will focus on "over" and "active"
    // active -> column i am dragging right now
    // over -> column over which i am dragging at the end
    const { active, over } = e;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((column) => {
      const activeColumnIndex = column.findIndex(
        (col) => col.id == activeColumnId
      );
      const overColumnIndex = column.findIndex((col) => col.id == overColumnId);
      //  we will use dnd helper function (array move function), it put the first index to position of 2nd index and move all element to left by 1
      return arrayMove(column, activeColumnIndex, overColumnIndex);
    });
  };

  // we are solving a problem when we are clicking, our dnd thinks we are dragging, so we are creating activators to solve it

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //if we need to start dragging, we need to drag about 3px, clicking start to work
      },
    })
  );

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const [tasks, setTasks] = useState<Task[]>([]);

  const createTask = (columnId: Id) => {
    setTasks((tasks) => [
      ...tasks,
      {
        id: generateId(),
        columnId: columnId,
        content: "Write Content here....",
      },
    ]);
  };

  const deleteTask = (id: Id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  };

  const updateTask = (id: Id, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  //  we will use this, to add my task in another column
  const ondragover = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type == "Task";
    const isOverATask = over.data.current?.type == "Task";

    if (!isActiveATask) return;

    // dropping task over another task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        // if dropping task over task but of diffreent column
        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // dropping a task over a  column (very useful is another column is empty)
    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        // if dropping task over task but of diffreent column
        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  return (
    <DndContext
      onDragStart={ondragstart}
      onDragEnd={ondragend}
      onDragOver={ondragover}
      sensors={sensors}
    >
      <div className="p-4  h-[calc(100%-56px)] w-[100vw] md:w-[calc(100vw-220px)] gap-4 lg:w-[calc(100vw-280px)] flex  overflow-x-auto overflow-y-hidden">
        <ColumnBox
          updateTask={updateTask}
          deleteTask={deleteTask}
          tasks={tasks}
          updateColumn={updateColumn}
          createTask={createTask}
          columns={columns}
          setColumns={setColumns}
          deleteColumn={deleteColumn}
        />
        <Button className="flex w-fit " onClick={() => createNewColumn()}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      {createPortal(
        // drag overlay , means when i am dragging, i stick card to my pointer
        <DragOverlay>
          {activeColumn && (
            <SingleColumn
              updateTask={updateTask}
              deleteTask={deleteTask}
              tasks={tasks}
              createTask={createTask}
              updateColumn={updateColumn}
              column={activeColumn}
              deleteColumn={deleteColumn}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

const ColumnBox = ({
  columns,
  setColumns,
  tasks,
  createTask,
  deleteColumn,
  updateColumn,
  deleteTask,
  updateTask,
}: {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  deleteColumn: (id: string | number) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}) => {
  const columsId = useMemo(() => columns.map((col) => col.id), [columns]);

  return (
    <div className="h-full flex gap-2">
      {/* items in here is the array of column ids */}
      <SortableContext items={columsId}>
        {columns.map((column) => {
          return (
            <SingleColumn
              deleteTask={deleteTask}
              updateTask={updateTask}
              tasks={tasks}
              createTask={createTask}
              updateColumn={updateColumn}
              column={column}
              deleteColumn={deleteColumn}
            />
          );
        })}
      </SortableContext>
    </div>
  );
};

const SingleColumn = ({
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
  createTask: (columnId: Id) => void;
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
        className="min-w-[300px] opacity-60 bg-background px-3 pt-3 text-center h-full border rounded-lg border-foreground/30"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={column.id}
      className="min-w-[300px] max-h-[calc(100vh-94px)] overflow-hidden flex gap-2 flex-col bg-background  pt-3 text-center h-full border rounded-lg border-foreground/30"
    >
      {/* header */}
      <div
        // now we can only drag and drop using header
        {...attributes}
        {...listeners}
        onClick={() => setEditmode(true)}
        className="flex px-3  justify-between h-[50px] items-center"
      >
        {/* number of todos */}
        <Badge className="rounded-full w-4 h-4 p-3 flex items-center justify-center">
          {tasks.length}
        </Badge>
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
          <p className="font-bold">{column.title}</p>
        )}

        {/* delete button */}
        <Button variant={"destructive"} onClick={() => deleteColumn(column.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/*  content */}
      <div className="px-3 scroller w-full h-[calc(100%-110px)] flex  flex-col gap-2 text-sm relative overflow-y-auto">
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
      </div>

      {/* footer */}
      <div className="px-4 gap-2 h-[60px] w-full bg-secondary flex items-center">
        {/* Create Task */}
        <Button
          size={"sm"}
          className="text-sm"
          onClick={() => createTask(column.id)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>
    </div>
  );
};
