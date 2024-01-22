import { FC, useCallback } from "react";
import { AvailabilityIcon } from "./AvailabilityIcon";
import IconButton from "@mui/material/IconButton";
import { trpc } from "@/app/_trpc/client";

interface Props {
  slug: string;
  date: string;
  attendeeId: string;
  status: "yes" | "maybe" | "no" | undefined;
}

export const AvailabilityPicker: FC<Props> = ({
  slug,
  date,
  attendeeId,
  status,
}) => {
  const { mutateAsync, isPending, variables } =
    trpc.availability.set.useMutation();
  const utils = trpc.useUtils();
  const setAvailabilityStatus = useCallback(
    (status: "yes" | "maybe" | "no") => async () => {
      await mutateAsync(
        { status, date, attendeeId },
        {
          onSuccess() {
            utils.poll.get.setData({ slug }, (old) => {
              if (!old) return old;
              return {
                ...old,
                attendees: old.attendees.map((attendee) => {
                  if (attendee.id === attendeeId) {
                    const availabilities = [...attendee.availabilities];
                    const availabilityIdx = availabilities.findIndex(
                      (a) => a.date === date,
                    );
                    if (availabilityIdx === -1) {
                      availabilities.push({
                        date,
                        status,
                      });
                    } else {
                      availabilities[availabilityIdx] = {
                        date,
                        status,
                      };
                    }
                    return {
                      ...attendee,
                      availabilities,
                    };
                  }
                  return attendee;
                }),
              };
            });
          },
        },
      );
    },
    [attendeeId, date, mutateAsync, slug, utils.poll.get],
  );
  return (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <IconButton
        onClick={setAvailabilityStatus("yes")}
        disabled={isPending || status === "yes"}
      >
        <AvailabilityIcon
          status={isPending && variables.status === "yes" ? "loading" : "yes"}
          active={status === "yes"}
        />
      </IconButton>
      <IconButton
        onClick={setAvailabilityStatus("maybe")}
        disabled={isPending || status === "maybe"}
      >
        <AvailabilityIcon
          status={
            isPending && variables.status === "maybe" ? "loading" : "maybe"
          }
          active={status === "maybe"}
        />
      </IconButton>
      <IconButton
        onClick={setAvailabilityStatus("no")}
        disabled={isPending || status === "no"}
      >
        <AvailabilityIcon
          status={isPending && variables.status === "no" ? "loading" : "no"}
          active={status === "no"}
        />
      </IconButton>
    </div>
  );
};
