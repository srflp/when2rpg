import TextField from "@mui/material/TextField";
import CheckIcon from "@mui/icons-material/Check";
import { FC, useCallback, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import IconButton from "@mui/material/IconButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export interface Props {
  slug: string;
  attendeeId: string;
  attendeeName: string;
  isPollEditMode: boolean;
}

export const AttendeeName: FC<Props> = ({
  slug,
  attendeeId,
  attendeeName,
  isPollEditMode,
}) => {
  const [name, setName] = useState(attendeeName);
  const [isEditingName, setIsEditingName] = useState(false);
  const { isPending, mutateAsync } = trpc.attendee.update.useMutation();
  const utils = trpc.useUtils();

  const submit = useCallback(async () => {
    await mutateAsync(
      {
        id: attendeeId,
        name,
      },
      {
        onSuccess() {
          utils.poll.get.setData({ slug }, (old) => {
            if (!old) {
              return old;
            }
            return {
              ...old,
              attendees: old.attendees.map((oldAttendee) => {
                if (oldAttendee.id === attendeeId) {
                  return {
                    ...oldAttendee,
                    name,
                  };
                }
                return oldAttendee;
              }),
            };
          });
        },
      },
    );
    setIsEditingName(false);
  }, [attendeeId, mutateAsync, name, slug, utils.poll.get]);

  return (
    <>
      {isEditingName && isPollEditMode ? (
        <div className="flex min-w-52">
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
          {attendeeName}
        </span>
      )}
    </>
  );
};
