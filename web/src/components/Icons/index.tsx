interface IconI {
  width?: string;
  height?: string;
  iconColor?: string;
  fillColor?: string;
  iconClass?: string;
}

export const LogoIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <rect width="3" height="9" x="7" y="7"></rect>
    <rect width="3" height="5" x="14" y="7"></rect>
  </svg>
);

export const EyeIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
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
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
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

export const StarIcon = ({
  width = "20",
  height = "20",
  iconColor = "#ff0",
  iconClass,
  fillColor = "none",
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill={fillColor}
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const BellIcon = ({
  width = "20",
  height = "20",
  iconColor = "#fff",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

export const EllipsisIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

export const CloseIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

export const SearchIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7.5"></circle>
    <path d="m21 21-4.3-4.3"></path>
  </svg>
);

export const ShareIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" x2="12" y1="2" y2="15"></line>
  </svg>
);

export const PlusIcon = ({
  width = "20",
  height = "20",
  iconColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke={iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  </svg>
);

export const ChevronRightLeftIcon = ({
  width = "20",
  height = "20",
  fillColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      fill={fillColor}
      d="M6.25 8.75H0v-1.5h6.25zm3.5-1.5H16v1.5H9.75z"
    ></path>
    <path
      fill={fillColor}
      d="M5.19 8 2.22 5.03l1.06-1.06 3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5-1.06-1.06zm4.03-.53 3.5-3.5 1.06 1.06L10.81 8l2.97 2.97-1.06 1.06-3.5-3.5a.75.75 0 0 1 0-1.06"
    ></path>
  </svg>
);

export const ChevronLeftRightIcon = ({
  width = "20",
  height = "20",
  fillColor = "#000",
  iconClass,
}: IconI) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    className={`cursor-pointer ${iconClass}`}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      fill={fillColor}
      d="m.22 7.47 3.5-3.5 1.06 1.06-2.22 2.22H7v1.5H2.56l2.22 2.22-1.06 1.06-3.5-3.5a.75.75 0 0 1 0-1.06m13.22-.22-2.22-2.22 1.06-1.06 3.5 3.5a.75.75 0 0 1 0 1.06l-3.5 3.5-1.06-1.06 2.22-2.22H9v-1.5z"
    ></path>
  </svg>
);
export const TrelloIcon = ({
  width = "24",
  height = "24",
  iconColor = "#fff",
}: IconI) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill={iconColor}
        d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2m-8.8 15.2a1.2 1.2 0 0 1-1.2 1.2H5.8c-.66 0-1.2-.54-1.2-1.2V5.8a1.2 1.2 0 0 1 1.2-1.2h3.7c.66 0 1.2.54 1.2 1.2zm8.7-5c0 .66-.54 1.2-1.2 1.2h-3.7c-.66 0-1.2-.54-1.2-1.2V5.8c0-.66.54-1.2 1.2-1.2h3.7c.66 0 1.2.54 1.2 1.2z"
      />
    </svg>
  );
};
