import { RouterOutput, trpc } from "@/app/_trpc/client";
import IconButton from "@mui/material/IconButton";
import { FC, useCallback, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface Props {
  attendee: RouterOutput["attendee"]["list"][number];
}

export const Attendee: FC<Props> = ({ attendee }) => {
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
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
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
      </div>
      <span>{attendee.name}</span>
    </div>
  );
};
