"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

export interface ComboboxOption<T> {
  label: string
  value: T
  hidden?: boolean
}

export interface ComboboxProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: ComboboxOption<T>[]
  value: T
  onChange: (value: T) => void
}

const Combobox = React.forwardRef(
  <T,>(
    { options, value, onChange, className, ...props }: ComboboxProps<T>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div ref={ref} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn("justify-between", className)}
            >
              <span>
                {options.find((o) => o.value === value)?.label ??
                  "UNKNOWN VALUE"}
              </span>
              <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-40 p-0">
            {options.map((option, i) => {
              if (option.hidden) {
                return <></>
              }

              return (
                <Button
                  key={i}
                  onClick={() => onChange(option.value)}
                  variant="outline"
                  className="flex w-full gap-2"
                >
                  <span>{option.label}</span>
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </Button>
              )
            })}
          </PopoverContent>
        </Popover>
      </div>
    )
  },
)
Combobox.displayName = "Combobox"

export { Combobox }
