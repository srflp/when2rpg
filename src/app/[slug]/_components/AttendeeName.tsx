import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import { FC, useCallback, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import IconButton from "@mui/material/IconButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { RouterOutput } from "@/app/_trpc/client";

export interface Props {
  attendee: RouterOutput["attendee"]["list"][number];
  isPollEditMode: boolean;
}

export const AttendeeName: FC<Props> = ({ attendee, isPollEditMode }) => {
  const [name, setName] = useState(attendee.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const { isPending, mutateAsync } = trpc.attendee.update.useMutation();
  const utils = trpc.useUtils();

  const submit = useCallback(async () => {
    await mutateAsync({
      id: attendee.id,
      name,
    });
    utils.attendee.list.setData({ pollId: attendee.pollId }, (old) => {
      if (!old) {
        return old;
      }
      return old.map((oldAttendee) => {
        if (oldAttendee.id === attendee.id) {
          return {
            ...attendee,
            name,
          };
        }
        return oldAttendee;
      });
    });
    setIsEditingName(false);
  }, [attendee, mutateAsync, name, utils.attendee.list]);

  return (
    <>
      {isEditingName && isPollEditMode ? (
        <div className="flex">
          <TextField
            size="small"
            label="Imię uczestnika"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await submit();
              }
            }}
            autoFocus
          />
          <IconButton onClick={submit} disabled={isPending || !name.length}>
            {isPending ? (
              <AutorenewIcon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
          </IconButton>
        </div>
      ) : (
        <span onClick={() => isPollEditMode && setIsEditingName(true)}>
          {attendee.name}
        </span>
      )}
    </>
  );
};
