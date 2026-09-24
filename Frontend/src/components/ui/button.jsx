import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Button = forwardRef(function Button(
  { className, variant = "primary", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn("cf-button", `cf-button-${variant}`, className)}
      {...props}
    />
  );
});

export default Button;
