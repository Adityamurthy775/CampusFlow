import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn("overflow-hidden rounded-3xl border border-secondary bg-card text-card-foreground", className)} {...props} />;
});
const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 sm:p-9", className)} {...props} />;
});
const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
  return <h3 ref={ref} className={cn("font-heading text-2xl font-semibold leading-snug tracking-tight break-words", className)} {...props} />;
});
const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn("text-sm leading-relaxed break-words text-muted-foreground", className)} {...props} />;
});
const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn("p-6 sm:p-9", className)} {...props} />;
});
const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0 sm:p-9 sm:pt-0", className)} {...props} />;
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
