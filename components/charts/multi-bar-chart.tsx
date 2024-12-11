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

export function MultiBarChart<T extends Properties>(params: ChartParams<T>) {
  return (
    <Card className={params.classname}>
      <CardHeader className="pt-4">
        <CardTitle className="max-xl:lg:text-lg">{params.title}</CardTitle>
        {params.description && (
          <CardDescription>{params.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={Object.keys(params.chartConfig)
            .map((property, i) => {
              return {
                property: property as keyof typeof params.chartConfig,
                value: {
                  ...params.chartConfig[property],
                  color:
                    params.chartConfig[property].color ??
                    `hsl(var(--chart-${i + 1}))`,
                },
              }
            })
            .reduce(
              (prev, cur) => {
                prev[cur.property] = cur.value
                return prev
              },
              {} as typeof params.chartConfig,
            )}
        >
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
              tickFormatter={(value) =>
                params.tickFormatter?.(value) ?? value.slice(0, 3)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {Object.keys(params.chartConfig).length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {Object.keys(params.chartConfig).map((key, i) => (
              <Bar
                key={i}
                dataKey={`${key}`}
                fill={`var(--color-${key})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
