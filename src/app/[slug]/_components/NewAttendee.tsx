import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckIcon from "@mui/icons-material/Check";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "../../_trpc/client";

interface Props {
  pollId: string;
}

export const NewAttendee: FC<Props> = ({ pollId }) => {
  const { mutateAsync, isPending } = trpc.attendee.create.useMutation();
  const [name, setName] = useState("");
  const utils = trpc.useUtils();
  const submit = useCallback(async () => {
    if (!name.length) {
      return;
    }
    await mutateAsync({ pollId, name });
    setName("");
    utils.attendee.list.invalidate({ pollId });
  }, [mutateAsync, pollId, name, utils.attendee.list]);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!isPending) {
      ref.current?.focus();
    }
  }, [isPending]);
  return (
    <>
      <TextField
        inputRef={ref}
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
      />
      <IconButton onClick={submit} disabled={isPending || !name.length}>
        {isPending ? <AutorenewIcon className="animate-spin" /> : <CheckIcon />}
      </IconButton>
    </>
  );
};
