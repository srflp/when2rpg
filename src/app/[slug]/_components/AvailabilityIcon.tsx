import { RouterOutput } from "@/app/_trpc/client";
import { FC } from "react";
import CheckIcon from "@mui/icons-material/Check";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AutorenewIcon from "@mui/icons-material/Autorenew";

interface Props {
  // @ts-expect-error
  status: RouterOutput["availability"]["list"][number]["status"];
}

export const AvailabilityIcon: FC<Props> = ({ status }) => {
  switch (status) {
    case "yes":
      return <CheckIcon />;
    case "maybe":
      return <QuestionMarkIcon />;
    case "no":
      return <CloseIcon />;
    case "loading":
      return <AutorenewIcon className="animate-spin" />;
  }
  return <RemoveIcon style={{ fill: "#ccc" }} />;
};
