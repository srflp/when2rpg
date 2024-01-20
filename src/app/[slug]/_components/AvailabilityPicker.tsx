import { FC, useCallback } from "react";
import { AvailabilityIcon } from "./AvailabilityIcon";
import IconButton from "@mui/material/IconButton";
import { trpc } from "@/app/_trpc/client";
import { cn } from "@/cn";

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
        className={cn(status === "yes" && "!bg-zinc-200")}
        onClick={setAvailabilityStatus("yes")}
        disabled={isPending}
      >
        <AvailabilityIcon
          status={isPending && variables.status === "yes" ? "loading" : "yes"}
        />
      </IconButton>
      <IconButton
        className={cn(status === "maybe" && "!bg-zinc-200")}
        onClick={setAvailabilityStatus("maybe")}
        disabled={isPending}
      >
        <AvailabilityIcon
          status={
            isPending && variables.status === "maybe" ? "loading" : "maybe"
          }
        />
      </IconButton>
      <IconButton
        className={cn(status === "no" && "!bg-zinc-200")}
        onClick={setAvailabilityStatus("no")}
        disabled={isPending}
      >
        <AvailabilityIcon
          status={isPending && variables.status === "no" ? "loading" : "no"}
        />
      </IconButton>
    </div>
  );
};
