import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function NumericInput({
  title,
  value,
  onChange,
}: {
  title: string
  value: number
  onChange: (newValue: number) => void
}) {
  return (
    <div className="flex place-items-center">
      <Label className="grow" htmlFor={title.replace(" ", "")}>
        {title}
      </Label>
      <Input
        className="h-auto max-w-28 px-1 py-0.5 text-right"
        type="number"
        value={Number(value.toPrecision(12))}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}
