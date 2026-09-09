"use client";

import NextLink, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";
import { createPortal } from "react-dom";

function Pending() {
  const { pending } = useLinkStatus();
  return pending
    ? createPortal(
        <span className="route-status" role="status">
          Loading…
        </span>,
        document.body,
      )
    : null;
}

export default function SiteLink({
  children,
  ...props
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <Pending />
    </NextLink>
  );
}
