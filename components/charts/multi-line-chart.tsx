"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { ChartParams, Properties } from "./chart-types"

export function MultiLineChart<T extends Properties>(params: ChartParams<T>) {
  return (
    <Card className={params.classname}>
      <CardHeader>
        <CardTitle>{params.title}</CardTitle>
        <CardDescription>{params.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={params.chartConfig}>
          <LineChart
            accessibilityLayer
            data={params.chartData.map((data) => {
              return { xAxis: data.xAxis, ...data.data }
            })}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xAxis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(params.chartConfig).map((key, i) => (
              <Line
                key={i}
                dataKey={`${key}`}
                type="monotone"
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
