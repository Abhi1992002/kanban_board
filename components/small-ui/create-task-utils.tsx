import React from "react";
import { DatePicker } from "./date-picker";

type Props = {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export const CreateTaskUtils = ({ date, setDate }: Props) => {
  return (
    <div className="mt-4">
      <DatePicker date={date} setDate={setDate} />
    </div>
  );
};
