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
import { useIsLgXlDevice } from "@/hooks/useIsLgXlDevice"
import { Pie, PieChart as RechartsPieChart } from "recharts"

import { ChartParams, Properties } from "./chart-types"

export function PieChart<T extends Properties>(params: ChartParams<T>) {
  const isLgXlDevice = useIsLgXlDevice()

  return (
    <Card className={params.classname}>
      <CardHeader className="p-1 pt-4">
        <CardTitle className="text-center text-xl max-xl:lg:text-lg">
          {params.title}
        </CardTitle>
        {params.description && (
          <CardDescription>{params.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
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
              innerRadius={isLgXlDevice ? 30 : 50}
              outerRadius={isLgXlDevice ? 40 : 70}
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
