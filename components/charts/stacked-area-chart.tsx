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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Line, XAxis } from "recharts"

import { ChartParams, Properties } from "./chart-types"

export function StackedAreaChart<T extends Properties>(params: ChartParams<T>) {
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
          <AreaChart
            accessibilityLayer
            data={params.chartData.map((data) => {
              return { xAxis: data.xAxis, ...data.data }
            })}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xAxis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                params.tickFormatter?.(value) ?? value.slice(0, 3)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {Object.keys(params.chartConfig).map((key, i) => (
              <Area
                key={i}
                dataKey={`${key}`}
                type="natural"
                fill={`var(--color-${key})`}
                fillOpacity={0.4}
                stroke={`var(--color-${key})`}
                stackId="a"
              />
            ))}
            <Line
              dataKey={"threshold"}
              type="monotone"
              stroke={`var(--color-threshold)`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
