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
import { Info } from "lucide-react"
import { SimpleTooltip } from "../SimpleTooltip"
import { ChartParams, Properties } from "./chart-types"

export function MultiLineChart<T extends Properties>(
  params: ChartParams<T> & {
    tooltip?: {
      explanation?: string
      formula?: string
    }
  }
) {
  return (
    <Card className={params.classname}>
      <CardHeader className="pt-4 relative">
      <CardTitle className="max-xl:lg:text-lg">{params.title}</CardTitle>
        {params.tooltip && (
          <SimpleTooltip tooltip={params.tooltip}>
            <div className="absolute right-2 top-2 z-50">
              <Info className="h-4 w-4 text-[#DDDDDD]" />
            </div>
          </SimpleTooltip>
        )}
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
              tickFormatter={(value) =>
                params.tickFormatter?.(value) ?? value.slice(0, 3)
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(params.chartConfig).length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
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
