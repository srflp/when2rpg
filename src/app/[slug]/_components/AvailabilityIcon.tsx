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
  active?: boolean;
}

export const AvailabilityIcon: FC<Props> = ({ status, active }) => {
  switch (status) {
    case "yes":
      return <CheckIcon style={active ? { fill: "#00B512" } : undefined} />;
    case "maybe":
      return (
        <QuestionMarkIcon style={active ? { fill: "#DBAB00" } : undefined} />
      );
    case "no":
      return <CloseIcon style={active ? { fill: "#D00000" } : undefined} />;
    case "loading":
      return <AutorenewIcon className="animate-spin" />;
  }
  return <RemoveIcon style={{ fill: "#ccc" }} />;
};
