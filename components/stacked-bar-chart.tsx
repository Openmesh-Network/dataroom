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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
  {
    month: "January",
    cpu: 300000,
    memory: 600000,
    storage: 75000,
    bandwidth: 174338,
  },
  {
    month: "February",
    cpu: 285000,
    memory: 570000,
    storage: 71250,
    bandwidth: 174338,
  },
  {
    month: "March",
    cpu: 290700,
    memory: 581400,
    storage: 72675,
    bandwidth: 174338,
  },
  {
    month: "April",
    cpu: 299421,
    memory: 598842,
    storage: 74855,
    bandwidth: 374276,
  },
  {
    month: "May",
    cpu: 314392,
    memory: 628784,
    storage: 78598,
    bandwidth: 374276,
  },
  {
    month: "June",
    cpu: 342687,
    memory: 685375,
    storage: 85672,
    bandwidth: 428359,
  },
  {
    month: "July",
    cpu: 335834,
    memory: 671667,
    storage: 83958,
    bandwidth: 419792,
  },
  {
    month: "August",
    cpu: 369417,
    memory: 738834,
    storage: 92354,
    bandwidth: 461771,
  },
  {
    month: "September",
    cpu: 421135,
    memory: 842271,
    storage: 105284,
    bandwidth: 526419,
  },
  {
    month: "October",
    cpu: 484306,
    memory: 968611,
    storage: 121076,
    bandwidth: 605382,
  },
  {
    month: "November",
    cpu: 576324,
    memory: 1152647,
    storage: 144081,
    bandwidth: 720405,
  },
  {
    month: "December",
    cpu: 697352,
    memory: 1394703,
    storage: 174338,
    bandwidth: 871690,
  },
]
const chartConfig = {
  cpu: {
    label: "Cores",
    color: "blue",
  },
  memory: {
    label: "Memory (GB)",
    color: "green",
  },
  storage: {
    label: "Storage (GB)",
    color: "orange",
  },
  bandwidth: {
    label: "Bandwidth (GB)",
    color: "red",
  },
} satisfies ChartConfig
export function StackedBarChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total Network Resources</CardTitle>
        <CardDescription>Network Resource Change Over Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="cpu"
              stackId="a"
              fill="var(--color-cpu)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="memory"
              stackId="a"
              fill="var(--color-memory)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="storage"
              stackId="a"
              fill="var(--color-storage)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="bandwidth"
              stackId="a"
              fill="var(--color-bandwidth)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
