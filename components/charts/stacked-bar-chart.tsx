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
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartParams, Properties } from "./chart-types"

export function StackedBarChart<T extends Properties>(params: ChartParams<T>) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{params.title}</CardTitle>
        <CardDescription>{params.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={params.chartConfig}>
          <BarChart
            accessibilityLayer
            data={params.chartData.map((data) => {
              return { xAxis: data.xAxis, ...data.data }
            })}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xAxis"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(params.chartConfig).map((key, i) => (
              <Bar
                key={i}
                dataKey={`${key}`}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={
                  i === 0
                    ? [0, 0, 4, 4]
                    : i === Object.keys(params.chartConfig).length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                }
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
