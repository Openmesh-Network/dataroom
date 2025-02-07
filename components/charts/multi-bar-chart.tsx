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
import { Info } from "lucide-react"
import { SimpleTooltip } from "../SimpleTooltip"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartParams, Properties } from "./chart-types"
import React from 'react'
import { SaveChart } from "@/components/charts/SaveChart"

export function MultiBarChart<T extends Properties>(
  params: ChartParams<T> & {
    tooltip?: {
      explanation?: string
      formula?: string
    }
  }
) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <Card className={params.classname}>
      <CardHeader className="pt-4 relative">
        <CardTitle className="max-xl:lg:text-lg">{params.title}</CardTitle>
        <div className="absolute right-8 top-4 z-50 flex items-center gap-1.5">
          <SaveChart chartRef={containerRef} title={params.title} />
          {params.tooltip && (
            <SimpleTooltip tooltip={params.tooltip}>
              <Info className="h-4 w-4 text-muted-foreground" />
            </SimpleTooltip>
          )}
        </div>
        {params.description && (
          <CardDescription>{params.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={containerRef}
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