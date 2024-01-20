import { FC } from "react";
import { AvailabilityIcon } from "./AvailabilityIcon";
import IconButton from "@mui/material/IconButton";

interface Props {}

export const AvailabilityPicker: FC<Props> = ({}) => {
  return (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <IconButton
        className="bg-zinc-200"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AvailabilityIcon status="yes" />
      </IconButton>
      <IconButton>
        <AvailabilityIcon status="maybe" />
      </IconButton>
      <IconButton>
        <AvailabilityIcon status="no" />
      </IconButton>
    </div>
  );
};
