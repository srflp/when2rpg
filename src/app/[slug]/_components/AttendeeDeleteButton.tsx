import IconButton from "@mui/material/IconButton";
import { FC, useCallback, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { RouterOutput, trpc } from "@/app/_trpc/client";

interface Props {
  attendee: RouterOutput["attendee"]["list"][number];
}

export const AttendeeDeleteButton: FC<Props> = ({ attendee }) => {
  const { mutateAsync, isPending } = trpc.attendee.delete.useMutation();
  const utils = trpc.useUtils();
  const delete_ = useCallback(async () => {
    handleClose();
    await mutateAsync({ id: attendee.id });
    utils.attendee.list.invalidate({ pollId: attendee.pollId });
  }, [attendee.id, attendee.pollId, mutateAsync, utils.attendee.list]);
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
            Czy na pewno chcesz usunąć uczestnika {attendee.name}?
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
