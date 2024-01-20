import IconButton from "@mui/material/IconButton";
import { FC, useCallback, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { trpc } from "@/app/_trpc/client";

interface Props {
  slug: string;
  attendeeId: string;
  attendeeName: string;
}

export const AttendeeDeleteButton: FC<Props> = ({
  slug,
  attendeeId,
  attendeeName,
}) => {
  const { mutateAsync, isPending } = trpc.attendee.delete.useMutation();
  const utils = trpc.useUtils();
  const delete_ = useCallback(async () => {
    handleClose();
    await mutateAsync(
      { id: attendeeId },
      {
        onSuccess: () => {
          utils.poll.get.setData({ slug }, (old) => {
            if (!old) return old;
            return {
              ...old,
              attendees: old.attendees.filter(
                (attendee) => attendee.id !== attendeeId,
              ),
            };
          });
        },
      },
    );
  }, [attendeeId, mutateAsync, slug, utils.poll.get]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton size="small" onClick={handleClickOpen} disabled={isPending}>
        {isPending ? (
          <AutorenewIcon className="animate-spin" />
        ) : (
          <DeleteOutlineIcon />
        )}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Czy na pewno chcesz usunąć uczestnika {attendeeName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button onClick={delete_} autoFocus>
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
