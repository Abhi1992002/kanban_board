import { Column, Id, Task } from "@/types";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { SingleColumn } from "./single-column";

export const ColumnGroup = ({
  columns,
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
