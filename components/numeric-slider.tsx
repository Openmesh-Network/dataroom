import { NumericInput } from "./numeric-input"
import { Slider } from "./ui/slider"

export function NumericSlider({
  title,
  value,
  onChange,
  intervals,
  postfix,
}: {
  title: string
  value: number
  onChange: (newValue: number) => void
  intervals: number[]
  postfix?: string
}) {
  return (
    <div className="mx-1 flex flex-col gap-1">
      <NumericInput title={title} value={value} onChange={onChange} />
      <Slider
        id={title.replace(" ", "")}
        value={[toIntervalSlider(value, intervals)]}
        onValueChange={(v) => onChange(fromIntervalSlider(v[0], intervals))}
        min={0}
        max={1}
        step={0.01}
      />
      <div className="flex place-content-between">
        {intervals.map((number, i) => (
          <span className="text-xs" key={i}>
            {number}
            {postfix}
          </span>
        ))}
      </div>
    </div>
  )
}

function toIntervalSlider(value: number, intervals: number[]) {
  const upperBound = intervals.findIndex((i) => value <= i)
  const difference = intervals[upperBound] - value
  if (difference === 0) {
    return upperBound / (intervals.length - 1)
  }
  const fraqRange =
    (value - intervals[upperBound - 1]) /
    (intervals[upperBound] - intervals[upperBound - 1])
  return (upperBound - 1 + fraqRange) / (intervals.length - 1)
}

function fromIntervalSlider(value: number, intervals: number[]) {
  const partial = value * (intervals.length - 1)
  if (partial % 1 === 0) {
    return intervals[partial]
  }
  const lowerBound = Math.floor(partial)
  return (
    intervals[lowerBound] +
    (partial % 1) * (intervals[lowerBound + 1] - intervals[lowerBound])
  )
}
