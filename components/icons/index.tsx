import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const strokeDefaults = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({
  size = 20,
  className,
  children,
  viewBox = "0 0 24 24",
  ...props
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      {...strokeDefaults}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Icon>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3 10.5 9-7 9 7" />
      <path d="M5 9.5V20h14V9.5" />
    </Icon>
  );
}

export function IconMapPin(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function IconTrain(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </Icon>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s-7-4.5-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.5-7 10-7 10Z" />
    </Icon>
  );
}

export function IconHeartFilled(props: IconProps) {
  return (
    <svg
      width={props.size ?? 20}
      height={props.size ?? 20}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M12 20.5s-7-4.5-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.5-7 10-7 10Z" />
    </svg>
  );
}

export function IconPet(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8.5" cy="9" r="1.5" />
      <circle cx="15.5" cy="9" r="1.5" />
      <path d="M12 14c-3 0-5 2-5 4" />
      <path d="M7 6.5c-1.5 1-2 3-1.5 4.5" />
      <path d="M17 6.5c1.5 1 2 3 1.5 4.5" />
      <path d="M12 4c0 1.5-.5 3-1.5 4" />
    </Icon>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Icon {...props} strokeWidth={2}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Icon>
  );
}

export function IconInbox(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 13h4l2 3h4l2-3h4" />
    </Icon>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M9 20v-6h6v6" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </Icon>
  );
}

export function IconList(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </Icon>
  );
}
