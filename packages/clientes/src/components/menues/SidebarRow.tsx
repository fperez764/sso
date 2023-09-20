"use client";
import { SVGProps, useState } from "react";

interface Props {
  Icon: any;
  title: string;
  disabled?: boolean;
  hideTitle?: boolean;
  redirectTo: string;
  badge?: number;
}

function SidebarRow({
  Icon,
  title,
  disabled,
  redirectTo,
  badge,
  hideTitle = true,
}: Props) {
  return (
    <div
      className={`${!disabled ? "text-gray-600" : "text-gray-300"} ${
        hideTitle ? "justify-start" : "justify-center"
      } bg-white flex items-center space-x-3 xl:px-1 mx-3 px-3 text-lg hoverEffect`}
    >
      <Icon className="w-6 h-6" />
      {hideTitle && <span className="">{title}</span>}
    </div>
  );
}

export default SidebarRow;
