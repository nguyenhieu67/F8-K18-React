import { Tooltip } from "@mui/material";

interface Props {
  children: React.ReactElement;
  title: string;
  describeChild?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  arrow?: boolean;
  placement?:
    | "auto-end"
    | "auto-start"
    | "auto"
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  offset?: number[];
}

export default function CustomTooltip({
  children,
  title,
  enterDelay = 100,
  leaveDelay = 30,
  arrow = false,
  placement = "bottom",
  offset = [0, -5],
}: Props) {
  return (
    <Tooltip
      describeChild
      title={title}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      arrow={arrow}
      placement={placement}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: offset,
              },
            },
          ],
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
