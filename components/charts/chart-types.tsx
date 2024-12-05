export type Properties = {
  [property: string]: number
}

export type ChartData<T extends Properties> = {
  xAxis: string
  data: T
}[]

export type ChartConfig<T extends Properties> = {
  [property in keyof T]: {
    label: string
    color?: string
  }
}

export type ChartParams<T extends Properties> = {
  title: string
  description: string
  chartData: ChartData<T>
  chartConfig: ChartConfig<T>
  classname?: string
  tickFormatter?: (xAxis: string) => string
}
