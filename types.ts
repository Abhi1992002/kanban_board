export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  column_color: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string | undefined;
  content: string | undefined;
  tag_color: string | undefined;
  tag_name: string | undefined;
  date: Date | undefined;
};
