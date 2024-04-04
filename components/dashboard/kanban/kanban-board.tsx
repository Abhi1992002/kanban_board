"use client";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import { PlusCircle } from "lucide-react";
import { Column, Id, Task } from "@/types";
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
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./task-card";
import { ColumnGroup } from "./column-group";
import { SingleColumn } from "./single-column";

type Props = {};

export const KanbanBoard = (props: Props) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --------------------------------------------- General Function -----------------------------------------------
  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  // ------------------------------------------------ Column CRUD Operation ------------------------------------------------
  const createNewColumn = () => {
    const new_column_to_add = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, new_column_to_add]);
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  };

  const deleteColumn = (id: string | number) => {
    setColumns((columns) => columns.filter((column) => column.id !== id));
    // delete all tasks in the column also
    setTasks((tasks) => tasks.filter((task) => task.columnId !== id));
  };

  // ------------------------------------------------ Task CRUD Operation ------------------------------------------------
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

  // ------------------------------------------------ Drag and Drop specific function ------------------------------------------------
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

  // we are solving a problem when we are clicking, our dnd thinks we are dragging, so we are creating activators to solve it
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //if we need to start dragging, we need to drag about 3px, clicking start to work
      },
    })
  );

  return (
    <DndContext
      onDragStart={ondragstart}
      onDragEnd={ondragend}
      onDragOver={ondragover}
      sensors={sensors}
    >
      <div className="p-4  h-[calc(100%-56px)] w-[100vw] md:w-[calc(100vw-220px)] gap-4 lg:w-[calc(100vw-280px)] flex  overflow-x-auto overflow-y-hidden">
        <ColumnGroup
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
      </DragOverlay>
    </DndContext>
  );
};
