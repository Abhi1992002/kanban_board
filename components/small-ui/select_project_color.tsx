import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {};

export const SelectProjectColor = (props: Props) => {
  const project_colors = [
    "bg-red-400",
    "bg-green-400",
    "bg-rose-400",
    "bg-pink-400",
    "bg-fuchsia-400",
    "bg-purple-400",
    "bg-violet-400",
    "bg-indigo-400",
    "bg-teal-400",
    "bg-emerald-400",
    "bg-green-400",
    "bg-lime-400",
    "bg-yellow-400",
    "bg-amber-400",
    "bg-orange-400",
    "bg-stone-400",
  ];

  return (
    <div className="mt-4">
      <RadioGroup className="flex gap-3 flex-wrap">
        {project_colors.map((color) => {
          return (
            <RadioGroupItem
              key={color}
              value={color}
              id={color}
              className={`${color} h-5 w-5`}
            />
          );
        })}
      </RadioGroup>
    </div>
  );
};
