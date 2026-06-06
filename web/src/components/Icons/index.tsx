interface IconI {
  width?: string;
  height?: string;
  iconColor?: string;
}

export const EyeIcon = ({
  width = "24",
  height = "24",
  iconColor = "#fff",
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const EyeCloseIcon = ({
  width = "24",
  height = "24",
  iconColor = "#fff",
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-.722-3.25"></path>
    <path d="M2 8a10.645 10.645 0 0 0 20 0"></path>
    <path d="m20 15-1.726-2.05"></path>
    <path d="m4 15 1.726-2.05"></path>
    <path d="m9 18 .722-3.25"></path>
  </svg>
);
