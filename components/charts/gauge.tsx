"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber } from "@/lib/utils"
import { useMediaQuery } from "@uidotdev/usehooks"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartParams } from "./chart-types"

export function Gauge<T extends { value: number }>(
  params: ChartParams<T> & { max: number },
) {
  const lgXlDevice = useMediaQuery(
    "(min-width : 1024px) and (max-width : 1280px)",
  )

  return (
    <Card className={params.classname}>
      <CardHeader className="p-1 pt-4">
        <CardTitle className="text-center text-xl max-xl:lg:text-base">
          {params.title}
        </CardTitle>
        {params.description && (
          <CardDescription>{params.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={params.chartConfig}
          className="mx-auto lg:aspect-square"
        >
          <RadialBarChart
            data={params.chartData.map((data, i) => {
              return {
                xAxis: data.xAxis,
                ...data.data,
                fill: `hsl(var(--chart-${i + 1}))`,
              }
            })}
            startAngle={90}
            endAngle={90 - (360 * params.chartData[0].data.value) / params.max}
            innerRadius={lgXlDevice ? 40 : 60}
            outerRadius={lgXlDevice ? 80 : 100}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold max-xl:lg:text-lg"
                        >
                          {formatNumber(params.chartData[0].data.value)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {params.chartData[0].xAxis}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
