"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-white",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 flex items-center justify-center"
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <IoSunnySharp className="absolute text-yellow-500 transition-opacity duration-200 peer-data-[state=checked]:opacity-100" />
        <IoMoonSharp className="absolute text-blue-500 transition-opacity duration-200 peer-data-[state=unchecked]:opacity-100" />
      </div>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
