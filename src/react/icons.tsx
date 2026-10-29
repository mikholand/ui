import type { SVGProps } from "react";

function Svg(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />;
}
export const ChevronDown = () => <Svg><path d="m6 9 6 6 6-6" /></Svg>;
export const XIcon = () => <Svg><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>;
export const MenuIcon = () => <Svg><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" /></Svg>;
export const CheckIcon = () => <Svg><path d="M20 6 9 17l-5-5" /></Svg>;
export const DotIcon = () => <Svg><circle cx="12" cy="12" r="3" /></Svg>;
