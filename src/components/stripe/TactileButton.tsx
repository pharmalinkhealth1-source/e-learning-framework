"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import styles from "./TactileButton.module.css";
import { cn } from "@/lib/utils";

interface BaseProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export type TactileButtonProps = BaseProps & (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

export function TactileButton({
  className,
  variant = "primary",
  size = "md",
  children,
  asChild = false,
  ...props
}: TactileButtonProps) {
  const combinedClasses = cn(
    styles.tactileButton,
    styles[variant],
    styles[size],
    className
  );

  const content = (
    <>
      {children}
      {(variant === "primary" || variant === "secondary") && (
        <svg
          className={styles.icon}
          width="12"
          height="10"
          viewBox="0 0 12 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 5h9" />
          <path d="M2 1.5l4 3.5-4 3.5" />
        </svg>
      )}
    </>
  );

  if (asChild) {
    return (
      <Slot className={combinedClasses} {...(props as any)}>
        {children}
      </Slot>
    );
  }

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <Link href={href} className={combinedClasses} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={combinedClasses} {...buttonProps}>
      {content}
    </button>
  );
}
