"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

const chartData = [
  { month: "January", openmesh: 0, aws: 65, gcp: 29, azure: 55 },
  { month: "February", openmesh: 0, aws: 65, gcp: 30, azure: 55 },
  { month: "March", openmesh: 0, aws: 66, gcp: 30, azure: 54 },
  { month: "April", openmesh: 1, aws: 67, gcp: 31, azure: 55 },
  { month: "May", openmesh: 1, aws: 66, gcp: 32, azure: 53 },
  { month: "June", openmesh: 3, aws: 68, gcp: 31, azure: 53 },
  { month: "July", openmesh: 5, aws: 69, gcp: 31, azure: 54 },
  { month: "August", openmesh: 10, aws: 70, gcp: 30, azure: 53 },
  { month: "September", openmesh: 25, aws: 71, gcp: 31, azure: 52 },
  { month: "October", openmesh: 45, aws: 70, gcp: 31, azure: 51 },
  { month: "November", openmesh: 60, aws: 70, gcp: 30, azure: 50 },
  { month: "December", openmesh: 75, aws: 69, gcp: 29, azure: 49 },
]
const chartConfig = {
  openmesh: {
    label: "Openmesh",
    color: "blue",
  },
  aws: {
    label: "AWS",
    color: "Orange",
  },
  gcp: {
    label: "GCP",
    color: "Red",
  },
  azure: {
    label: "Azure",
    color: "Green",
  },
} satisfies ChartConfig
export function MultiLineChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kill the Cloud Cabal</CardTitle>
        <CardDescription>Storage Growth of Major Players</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="openmesh"
              type="monotone"
              stroke="var(--color-openmesh)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="aws"
              type="monotone"
              stroke="var(--color-aws)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="gcp"
              type="monotone"
              stroke="var(--color-gcp)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="azure"
              type="monotone"
              stroke="var(--color-azure)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
