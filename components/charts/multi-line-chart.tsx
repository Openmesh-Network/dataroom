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
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Info } from "lucide-react"
import { SimpleTooltip } from "../SimpleTooltip"
import { ChartParams, Properties } from "./chart-types"
import React from 'react'
import { SaveChart } from "@/components/charts/SaveChart"

const CLOUD_COLORS = {
  openmesh: "rgb(59, 130, 246)",
  aws: "rgb(34, 197, 94)",
  gcp: "rgb(234, 179, 8)",
  azure: "rgb(249, 115, 22)"
}

export function MultiLineChart<T extends Properties>(
  params: ChartParams<T> & {
    tooltip?: {
      explanation?: string
      formula?: string
    },
    yAxisLabel?: string,
    xAxisLabel?: string
  }
) {
  const getCloudColor = (property: string) => {
    const propertyLower = property.toLowerCase()
    if (propertyLower.includes('openmesh')) return CLOUD_COLORS.openmesh
    if (propertyLower.includes('aws')) return CLOUD_COLORS.aws
    if (propertyLower.includes('gcp')) return CLOUD_COLORS.gcp
    if (propertyLower.includes('azure')) return CLOUD_COLORS.azure
    return `hsl(var(--chart-1))`
  }

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
            .map((property) => ({
              property: property as keyof typeof params.chartConfig,
              value: {
                ...params.chartConfig[property],
                color: getCloudColor(property),
              },
            }))
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
            data={params.chartData.map((data) => ({
              xAxis: data.xAxis,
              ...data.data,
            }))}
            margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xAxis"
              tickLine={false}
              axisLine={{ stroke: '#000000' }}
              tickMargin={8}
              tickFormatter={(value) =>
                params.tickFormatter?.(value) ?? value.slice(0, 3)
              }
              label={{ value: params.xAxisLabel || 'X Axis', position: 'bottom', offset: 0 }}
            />
            <YAxis
              axisLine={{ stroke: '#000000' }}
              tickLine={false}
              tickFormatter={(value: number) => {
                if (value >= 1_000_000) {
                  const millions = value / 1_000_000;
                  return `${millions === Math.floor(millions) ? millions : millions.toFixed(1)}M`;
                } else if (value >= 1_000) {
                  const thousands = value / 1_000;
                  return `${thousands === Math.floor(thousands) ? thousands : thousands.toFixed(1)}K`;
                }
                return value.toLocaleString();
              }}
              label={{ value: params.yAxisLabel || 'Y Axis', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(params.chartConfig).length > 1 && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign="top"
              />
            )}
            {Object.keys(params.chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={getCloudColor(key)}
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

export default MultiLineChart