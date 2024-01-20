import { RouterOutput, trpc } from "@/app/_trpc/client";
import { FC } from "react";

import { EditableAttendeeName } from "./EditableAttendeeName";
import { AttendeeDeleteButton } from "./AttendeeDeleteButton";

interface Props {
  attendee: RouterOutput["attendee"]["list"][number];
}

export const AttendeeHeader: FC<Props> = ({ attendee }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <AttendeeDeleteButton attendee={attendee} />
      </div>
      <EditableAttendeeName attendee={attendee} />
    </div>
  );
};
