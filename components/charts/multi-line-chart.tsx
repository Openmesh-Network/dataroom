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

type BaseDataPoint = {
  xAxis: string;
  [key: string]: string | number;
}

type ExtendedChartDataPoint<T extends Properties> = BaseDataPoint & {
  [P in keyof T]: number;
}

const displayNameMapping: Record<string, string> = {
  xnodeProfitMargin: "Xnode Profit Margin",
  openmesh: "Openmesh Cloud",
  aws: "AWS",
  gcp: "GCP",
  azure: "Azure",
  dataValue: "Data Value ($)",
  xnodeAmortizedCost: "Xnode Amortized Cost ($)",
  xnodeElectricityCost: "Xnode Electricity Cost ($)",
  xnodeComputeRevenue: "Xnode Compute Revenue ($)",
  xnodeMemoryRevenue: "Xnode Memory Revenue ($)",
  xnodeStorageRevenue: "Xnode Storage Revenue ($)",
  xnodeBandwidthRevenue: "Xnode Bandwidth Revenue ($)",
  tokens: "$OPEN Tokens",
  validatorRevenue: "Validator Revenue ($)",
  earlyValidatorRevenue: "Early Validator Revenue ($)",
};

interface PayloadData {
  xAxis: string;
  [key: string]: number | string;
}

interface TooltipEntry {
  name: string;
  value: number;
  color?: string;
  payload: PayloadData;
}

interface CustomTooltipProps {
  active: boolean;
  payload: TooltipEntry[];
  xAxisLabel: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  xAxisLabel,
}) => {
  if (active && payload && payload.length) {
    const allValuesZero = payload.every((entry) => entry.value === 0);

    return (
      <div className="bg-white border border-gray-300 rounded shadow-lg p-2">
        <p className="font-bold">{`${xAxisLabel}: ${payload[0].payload.xAxis}`}</p>
        {payload.map((entry) => {
          const originalValue = entry.payload[entry.name];
          const valueToShow = allValuesZero ? 0 : originalValue;
          const color = entry.color || entry.payload.fill;
          const displayName = displayNameMapping[entry.name] || entry.name;
          return (
            <p key={entry.name} className="text-sm text-gray-700">
              <span style={{ color: String(color || 'defaultColor') }}>
                {`${displayName}: ${typeof valueToShow === 'number' ? valueToShow.toFixed(0) : valueToShow}`}
              </span>
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

interface ChartConfigItem {
  label: string;
  color?: string;
  [key: string]: string | undefined;
}

type ChartConfig = Record<string, ChartConfigItem>;

export function MultiLineChart<T extends Properties>(
  params: ChartParams<T> & {
    chartConfig: ChartConfig;
    tooltip?: {
      explanation?: string;
      formula?: string;
    };
    yAxisLabel?: string;
    xAxisLabel?: string;
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

  const isAllZeros = (key: keyof T): boolean => {
    return params.chartData.every(item => item.data[key] === 0)
  }

  const getMaxValue = (): number => {
    let max = 0
    Object.keys(params.chartConfig).forEach(key => {
      const seriesMax = Math.max(...params.chartData.map(item =>
        (item.data[key as keyof T] as number) || 0
      ))
      max = Math.max(max, seriesMax)
    })
    return max
  }

  const calculateOffset = (): number => {
    const maxValue = getMaxValue()
    return maxValue * ZERO_OFFSET_PERCENTAGE
  }

  const transformData = (data: Array<{ xAxis: string; data: T }>): ExtendedChartDataPoint<T>[] => {
    const offset = calculateOffset();
    return data.map(item => {
      const baseItem: BaseDataPoint = {
        xAxis: item.xAxis,
        ...item.data
      };

      Object.keys(params.chartConfig).forEach(key => {
        const typedKey = key as keyof T;
        const displayKey = `${String(typedKey)}_display`;
        if (isAllZeros(typedKey)) {
          baseItem[displayKey] = offset;
        } else {
          baseItem[displayKey] = item.data[typedKey] + offset;
        }
      });

      return baseItem as ExtendedChartDataPoint<T>;
    });
  };

  const transformedData = transformData(params.chartData.map(data => ({
    xAxis: data.xAxis,
    data: data.data,
  })))

  const config = Object.entries(params.chartConfig).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: {
        ...value,
        color: getCloudColor(key),
        name: value.label || (key === 'openmesh_display' ? 'Openmesh Cloud' : key),
      }
    };
  }, {} as ChartConfig);

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
          config={config}
        >
          <LineChart
            accessibilityLayer
            data={transformedData}
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
            <ChartTooltip
              cursor={false}
              content={(props) => <CustomTooltip {...props as CustomTooltipProps} xAxisLabel={params.xAxisLabel || 'X Axis'} />}
            />
            {Object.keys(params.chartConfig).length > 1 && (
              <ChartLegend
                content={({ payload }) => {
                  const legendItems = (payload || []).map(item => {
                    const key = item.dataKey as string;
                    const configItem = params.chartConfig[key];
                    return {
                      ...item,
                      color: item.color || CLOUD_COLORS[key as keyof typeof CLOUD_COLORS],
                      name: configItem?.label || (key === 'openmesh_display' ? 'Openmesh Cloud' : key),
                    };
                  });

                  return (
                    <ChartLegendContent payload={legendItems} />
                  );
                }}
                verticalAlign="top"
              />
            )}
            {Object.keys(params.chartConfig).map((key) => {
              const hasAllZeros = isAllZeros(key as keyof T);
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
                  hide={false}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MultiLineChart