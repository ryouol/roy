"use client";

import NextLink, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";

function Pending() {
  const { pending } = useLinkStatus();
  return pending ? (
    <span className="route-status" role="status">
      Loading…
    </span>
  ) : null;
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
