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
} as const

const ZERO_OFFSET_PERCENTAGE = 0.02;

type ExtendedChartDataPoint<T extends Properties> = {
  xAxis: string;
} & {
  [K in keyof T]: number;
} & {
  [K in keyof T as `${string & K}_display`]?: number;
}

const displayNameMapping: Record<string, string> = {
  xnodeProfitMargin: "Xnode Profit Margin",
  openmesh: "Openmesh",
  aws: "AWS",
  gcp: "GCP",
  azure: "Azure",
  dataValue: "Data Value (USD)",
  xnodeAmortizedCost: "Xnode Amortized Cost (USD)",
  xnodeElectricityCost: "Xnode Electricity Cost (USD)",
  xnodeComputeRevenue: "Xnode Compute Revenue (USD)",
  xnodeMemoryRevenue: "Xnode Memory Revenue (USD)",
  xnodeStorageRevenue: "Xnode Storage Revenue (USD)",
  xnodeBandwidthRevenue: "Xnode Bandwidth Revenue (USD)",
  tokens: "$OPEN Tokens",
  validatorRevenue: "Validator Revenue (USD)",
  earlyValidatorRevenue: "Early Validator Revenue (USD)",
};

const CustomTooltip = ({ active, payload, xAxisLabel }: { active: boolean; payload: any; xAxisLabel: string }) => {
  if (active && payload && payload.length) {
    const allValuesZero = payload.every((entry: any) => entry.value === 0);

    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="font-bold">{`${xAxisLabel}: ${payload[0].payload.xAxis}`}</p>
        {payload.map((entry: any) => {
          const originalValue = entry.payload[entry.name];
          const valueToShow = allValuesZero ? 0 : originalValue;
          const color = entry.color || entry.payload.fill;
          const displayName = displayNameMapping[entry.name] || entry.name;
          return (
            <p key={entry.name} className="text-sm text-gray-700">
              <span style={{ color }}>{`${displayName}: ${valueToShow.toFixed(0)}`}</span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

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

  // Function to check if a line has all zero values
  const isAllZeros = (key: keyof T): boolean => {
    return params.chartData.every(item => item.data[key] === 0)
  }

  // Calculate the maximum value across all series to determine the scale
  const getMaxValue = (): number => {
    let max = 0
    Object.keys(params.chartConfig).forEach(key => {
      const seriesMax = Math.max(...params.chartData.map(item =>
        item.data[key as keyof T] || 0
      ))
      max = Math.max(max, seriesMax)
    })
    return max
  }

  // Calculate the offset based on the maximum value
  const calculateOffset = (): number => {
    const maxValue = getMaxValue()
    return maxValue * ZERO_OFFSET_PERCENTAGE
  }

  // Custom data transformer that adds offset to zero lines while preserving original values
  const transformData = (data: Array<{ xAxis: string; data: T }>): ExtendedChartDataPoint<T>[] => {
    const offset = calculateOffset();
    return data.map(item => {
      const baseItem: ExtendedChartDataPoint<T> = {
        xAxis: item.xAxis,
        ...item.data
      };

      // Add display properties for zero lines without affecting the original data
      Object.keys(params.chartConfig).forEach(key => {
        const typedKey = key as keyof T;
        if (isAllZeros(typedKey)) {
          // Set the display value to the offset for plotting purposes
          (baseItem as Record<string, number | undefined>)[`${String(typedKey)}_display`] = offset; // Apply offset for plotting
        } else {
          // For non-zero values, apply the offset
          (baseItem as Record<string, number | undefined>)[`${String(typedKey)}_display`] = item.data[typedKey] + offset; // Apply offset for plotting
        }
      });

      return baseItem;
    });
  };

  const transformedData = transformData(params.chartData.map(data => ({
    xAxis: data.xAxis,
    data: data.data,
  })))

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
                ...params.chartConfig[property as keyof T],
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
            data={transformedData}
            margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
          >
            {console.log('Chart data:', transformedData)} {/* Debug log */}
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
                  const millions = value / 1_000_000
                  return `${millions === Math.floor(millions) ? millions : millions.toFixed(1)}M`
                } else if (value >= 1_000) {
                  const thousands = value / 1_000
                  return `${thousands === Math.floor(thousands) ? thousands : thousands.toFixed(1)}K`
                }
                return value.toLocaleString()
              }}
              label={{ value: params.yAxisLabel || 'Y Axis', angle: -90, position: 'insideLeft', offset: 10 }}
            />
            <ChartTooltip cursor={false} content={<CustomTooltip xAxisLabel={params.xAxisLabel || 'X Axis'} />} />
            {Object.keys(params.chartConfig).length > 1 && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign="top"
              />
            )}
            {Object.keys(params.chartConfig).map((key) => {
              const hasAllZeros = isAllZeros(key as keyof T)
              return (
                <Line
                  key={key}
                  dataKey={hasAllZeros ? `${key}_display` : key}
                  type="monotone"
                  stroke={getCloudColor(key)}
                  strokeWidth={2}
                  dot={true}
                  name={key}
                  fill={getCloudColor(key)}
                />
              )
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MultiLineChart