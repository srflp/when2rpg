import { FC, useCallback, useState } from "react";
import { RouterOutput, trpc } from "../_trpc/client";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import AutorenewIcon from "@mui/icons-material/Autorenew";

interface Props {
  poll: RouterOutput["getPoll"];
}

export const Meta: FC<Props> = ({ poll }) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const [meta, setMeta] = useState({
    name: poll.name,
    description: poll.description,
  });
  const { mutateAsync, isPending } = trpc.updatePollMetadata.useMutation();
  const utils = trpc.useUtils();

  const submit = useCallback(async () => {
    await mutateAsync(
      {
        slug: poll.slug,
        ...meta,
      },
      {
        onSuccess() {
          setIsEditingMeta(false);
          utils.getPoll.setData({ slug: poll.slug }, (old) => ({
            ...old!,
            ...meta,
          }));
        },
      },
    );
  }, [meta, mutateAsync, poll.slug, utils.getPoll]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
      <div>
        {isEditingMeta ? (
          <IconButton onClick={submit} disabled={isPending}>
            {isPending ? (
              <AutorenewIcon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
          </IconButton>
        ) : (
          <IconButton onClick={() => setIsEditingMeta(true)}>
            <EditIcon />
          </IconButton>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        {isEditingMeta ? (
          <>
            <TextField
              label="Nazwa ankiety"
              value={meta.name}
              onChange={(e) => {
                setMeta({ ...meta, name: e.target.value });
              }}
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submit();
                }
              }}
            />
            <TextField
              label="Opis ankiety"
              multiline
              value={meta.description}
              onChange={(e) => {
                setMeta({ ...meta, description: e.target.value });
              }}
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  submit();
                }
              }}
            />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">
              {poll?.name || "Bez nazwy"}
            </h1>
            <p className="whitespace-pre-wrap">{poll?.description}</p>
          </>
        )}
      </div>
    </div>
  );
};
