"use client"

import {
  Card,
  CardContent,
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
import { Info } from "lucide-react"
import { SimpleTooltip } from "../SimpleTooltip"
import { ChartParams, Properties } from "./chart-types"

export function PieChart<T extends Properties>(
  params: ChartParams<T> & {
    tooltip?: {
      explanation?: string
      formula?: string
    }
  }
) {
  const isLgXlDevice = useIsLgXlDevice()

  return (
    <Card className={`h-full ${params.classname}`}>
      <CardHeader className="p-1 pt-4 relative flex flex-row items-start justify-between">
        <CardTitle className="text-center text-lg max-xl:lg:text-base w-full">
          {params.title}
        </CardTitle>
        {params.tooltip && (
          <SimpleTooltip tooltip={params.tooltip}>
            <div className="ml-2">
              <Info className="h-4 w-4 text-[#DDDDDD]" />
            </div>
          </SimpleTooltip>
        )}
      </CardHeader>
      <CardContent className="p-0 flex items-center justify-center h-[calc(100%-4rem)]">
        <ChartContainer
          config={params.chartConfig}
          className="w-full h-full flex items-center justify-center"
        >
          <RechartsPieChart width={isLgXlDevice ? 200 : 300} height={isLgXlDevice ? 200 : 300}>
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
              cy="50%"
              cx="50%"
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}