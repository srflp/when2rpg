import { FC, useCallback, useState } from "react";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { RouterOutput, trpc } from "../../_trpc/client";

interface Props {
  poll: Exclude<Exclude<RouterOutput["poll"], undefined>["get"], undefined>;
  isPollEditMode: boolean;
}

export const Meta: FC<Props> = ({ poll, isPollEditMode }) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const [meta, setMeta] = useState({
    name: poll.name,
    description: poll.description,
  });
  const { mutateAsync, isPending } = trpc.poll.updateMetadata.useMutation();
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
          utils.poll.get.setData({ slug: poll.slug }, (old) => {
            if (!old) return old;
            return {
              ...old,
              ...meta,
            };
          });
        },
      },
    );
  }, [meta, mutateAsync, poll.slug, utils.poll.get]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full">
      {isPollEditMode && (
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
      )}

      <div className="flex flex-col gap-3 w-full">
        {isEditingMeta && isPollEditMode ? (
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
            <h1 className="text-3xl font-semibold">
              {poll?.name || "Ankieta bez nazwy"}
            </h1>
            {poll?.description && (
              <p className="whitespace-pre-wrap">{poll?.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
