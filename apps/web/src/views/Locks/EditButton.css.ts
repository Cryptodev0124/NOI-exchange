import { atoms } from "@pancakeswap/ui/css/atoms";
import { style } from "@vanilla-extract/css";

export const editButtonClass = style([
  atoms({}),
  style({
    backgroundColor: "primary",
    borderRadius: "25px !important",
  }),
]);

export const editIconClass = style({
  selectors: {
    [`${editButtonClass}:hover &`]: {
      display: "none",
      fill: "white",
    },
  },
});