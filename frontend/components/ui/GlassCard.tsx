import React from "react";

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-card p-6 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
