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
import { Pie, PieChart as RechartsPieChart } from "recharts"

import { ChartParams, Properties } from "./chart-types"

export function PieChart<T extends Properties>(params: ChartParams<T>) {
  return (
    <Card className={params.classname}>
      <CardHeader className="pb-0">
        <CardTitle className="text-center text-xl">{params.title}</CardTitle>
        {params.description && (
          <CardDescription>{params.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={params.chartConfig}
          className="mx-auto aspect-square"
        >
          <RechartsPieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={params.chartData.map((data, i) => {
                return {
                  xAxis: data.xAxis,
                  ...data.data,
                  fill: `hsl(var(--chart-${i + 1}))`,
                }
              })}
              dataKey="value"
              nameKey="xAxis"
              innerRadius={40}
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
