import { deepEqual } from "@/lib/utils"

import { Label } from "./ui/label"
import { Slider } from "./ui/slider"

export interface ComboSliderOption<T> {
  label: string
  value: T
}

export function ComboSlider<T>({
  title,
  value,
  onChange,
  options,
}: {
  title: string
  value: T
  onChange: (newValue: T) => void
  options: ComboSliderOption<T>[]
}) {
  let selectedIndex = options.findIndex((o) => deepEqual(o.value, value))

  const optionsWithCustom = [...options]
  if (selectedIndex === -1) {
    selectedIndex =
      optionsWithCustom.push({
        label: "Custom",
        value: undefined as T,
      }) - 1
  }

  return (
    <div className="mx-1 flex flex-col gap-1">
      <div className="flex min-h-6 place-items-center">
        <Label className="grow" htmlFor={title.replace(" ", "")}>
          {title}
        </Label>
      </div>
      <Slider
        id={title.replace(" ", "")}
        value={[selectedIndex]}
        onValueChange={(v) => onChange(optionsWithCustom[v[0]].value)}
        min={0}
        max={optionsWithCustom.length - 1}
        step={1}
      />
      <div className="flex place-content-between">
        {optionsWithCustom.map((option, i) => (
          <span className="text-xs" key={i}>
            {option.label}
          </span>
        ))}
      </div>
    </div>
  )
}
