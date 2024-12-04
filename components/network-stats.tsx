"use client"

import { Info } from "lucide-react"

import { ChartData, Properties } from "./charts/chart-types"
import { MultiLineChart } from "./charts/multi-line-chart"
import { StackedBarChart } from "./charts/stacked-bar-chart"
import { ConfigContextData, useConfig } from "./config-provider"
import { SimpleTooltip } from "./SimpleTooltip"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function NetworkStats() {
  const config = useConfig()

  const networkCompute = totalNetwork(config, config.xnodeSize.cpu)
  const networkMemory = totalNetwork(config, config.xnodeSize.memory)
  const networkStorage = totalNetwork(config, config.xnodeSize.storage)
  const networkBandwidth = totalNetwork(config, config.xnodeSize.bandwidth)
  // const networkElectricity = totalNetwork(config, config.xnodeSize.electricity)

  const networkValue =
    (networkCompute * config.cost.cpu +
      networkMemory * config.cost.memory +
      networkStorage * config.cost.storage +
      networkBandwidth * config.cost.bandwidth) *
    12

  const cloudCompute = totalCloud(config, networkCompute)
  const cloudMemory = totalCloud(config, networkMemory)
  const cloudStorage = totalCloud(config, networkStorage)
  const cloudBandwidth = totalCloud(config, networkBandwidth)

  const cloudValue =
    (cloudCompute * config.cost.cpu +
      cloudMemory * config.cost.memory +
      cloudStorage * config.cost.storage +
      cloudBandwidth * config.cost.bandwidth) *
    12

  const totalTokensStaked = totalNetwork(
    config,
    config.blockchain.requirement.proofOfStake +
      config.blockchain.requirement.proofOfResource,
  )
  const totalStakedValue = config.cost.open * totalTokensStaked

  const totalNetworkValue = networkValue + totalStakedValue

  const marketcap = config.blockchain.tokenSupply.circulating * config.cost.open
  const fullyDilutedMarketcap =
    config.blockchain.tokenSupply.total * config.cost.open

  const marketcapToNetworkValue = marketcap / totalNetworkValue

  const xnodeAmortizedCost = config.cost.xnode / config.hardwareAmortization
  const xnodeElectricityCost =
    ((config.xnodeSize.electricity * 24 * 30) / 1000) * config.cost.electricity
  const xnodeComputeRevenue = config.xnodeSize.cpu * config.cost.cpu
  const xnodeMemoryRevenue = config.xnodeSize.memory * config.cost.memory
  const xnodeStorageRevenue = config.xnodeSize.storage * config.cost.storage
  const xnodeBandwidthRevenue =
    config.xnodeSize.bandwidth * config.cost.bandwidth
  const xnodeProfitMargin =
    (xnodeComputeRevenue +
      xnodeMemoryRevenue +
      xnodeStorageRevenue +
      xnodeBandwidthRevenue) /
    (xnodeAmortizedCost + xnodeElectricityCost)

  return (
    <div className="flex flex-col gap-3">
      <Category title="Growth">
        <div className="flex w-full gap-1">
          <StackedBarChart
            title="Total Network Resources"
            description="Network Resource Change Over Time"
            chartData={[
              {
                xAxis: "January",
                data: {
                  cpu: 300000,
                  memory: 600000,
                  storage: 75000,
                  bandwidth: 174338,
                },
              },
              {
                xAxis: "February",
                data: {
                  cpu: 285000,
                  memory: 570000,
                  storage: 71250,
                  bandwidth: 174338,
                },
              },
              {
                xAxis: "March",
                data: {
                  cpu: 290700,
                  memory: 581400,
                  storage: 72675,
                  bandwidth: 174338,
                },
              },
              {
                xAxis: "April",
                data: {
                  cpu: 299421,
                  memory: 598842,
                  storage: 74855,
                  bandwidth: 374276,
                },
              },
              {
                xAxis: "May",
                data: {
                  cpu: 314392,
                  memory: 628784,
                  storage: 78598,
                  bandwidth: 374276,
                },
              },
              {
                xAxis: "June",
                data: {
                  cpu: 342687,
                  memory: 685375,
                  storage: 85672,
                  bandwidth: 428359,
                },
              },
              {
                xAxis: "July",
                data: {
                  cpu: 335834,
                  memory: 671667,
                  storage: 83958,
                  bandwidth: 419792,
                },
              },
              {
                xAxis: "August",
                data: {
                  cpu: 369417,
                  memory: 738834,
                  storage: 92354,
                  bandwidth: 461771,
                },
              },
              {
                xAxis: "September",
                data: {
                  cpu: 421135,
                  memory: 842271,
                  storage: 105284,
                  bandwidth: 526419,
                },
              },
              {
                xAxis: "October",
                data: {
                  cpu: 484306,
                  memory: 968611,
                  storage: 121076,
                  bandwidth: 605382,
                },
              },
              {
                xAxis: "November",
                data: {
                  cpu: 576324,
                  memory: 1152647,
                  storage: 144081,
                  bandwidth: 720405,
                },
              },
              {
                xAxis: "December",
                data: {
                  cpu: 697352,
                  memory: 1394703,
                  storage: 174338,
                  bandwidth: 871690,
                },
              },
            ]}
            chartConfig={{
              cpu: {
                label: "Cores",
                color: "blue",
              },
              memory: {
                label: "Memory (GB)",
                color: "green",
              },
              storage: {
                label: "Storage (GB)",
                color: "orange",
              },
              bandwidth: {
                label: "Bandwidth (GB)",
                color: "red",
              },
            }}
          />
          <MultiLineChart
            title="Kill the Cloud Cabal"
            description="Storage Growth of Major Players"
            chartData={[
              {
                xAxis: "January",
                data: { openmesh: 0, aws: 65, gcp: 29, azure: 55 },
              },
              {
                xAxis: "February",
                data: { openmesh: 0, aws: 65, gcp: 30, azure: 55 },
              },
              {
                xAxis: "March",
                data: { openmesh: 0, aws: 66, gcp: 30, azure: 54 },
              },
              {
                xAxis: "April",
                data: { openmesh: 1, aws: 67, gcp: 31, azure: 55 },
              },
              {
                xAxis: "May",
                data: { openmesh: 1, aws: 66, gcp: 32, azure: 53 },
              },
              {
                xAxis: "June",
                data: { openmesh: 3, aws: 68, gcp: 31, azure: 53 },
              },
              {
                xAxis: "July",
                data: { openmesh: 5, aws: 69, gcp: 31, azure: 54 },
              },
              {
                xAxis: "August",
                data: { openmesh: 10, aws: 70, gcp: 30, azure: 53 },
              },
              {
                xAxis: "September",
                data: { openmesh: 25, aws: 71, gcp: 31, azure: 52 },
              },
              {
                xAxis: "October",
                data: { openmesh: 45, aws: 70, gcp: 31, azure: 51 },
              },
              {
                xAxis: "November",
                data: { openmesh: 60, aws: 70, gcp: 30, azure: 50 },
              },
              {
                xAxis: "December",
                data: { openmesh: 75, aws: 69, gcp: 29, azure: 49 },
              },
            ]}
            chartConfig={{
              openmesh: {
                label: "Openmesh",
                color: "blue",
              },
              aws: {
                label: "AWS",
                color: "Orange",
              },
              gcp: {
                label: "GCP",
                color: "Red",
              },
              azure: {
                label: "Azure",
                color: "Green",
              },
            }}
          />
        </div>
      </Category>
      <Category title="Network">
        <SingleNumber
          description="Total Network Compute (TNC)"
          value={`${formatNumber(networkCompute)} cores`}
        />
        <SingleNumber
          description="Total Network Memory (TNM)"
          value={`${formatNumber(networkMemory, "GB")}`}
        />
        <SingleNumber
          description="Total Network Storage (TNS)"
          value={`${formatNumber(networkStorage, "GB")}`}
        />
        <SingleNumber
          description="Total Network Bandwidth (TNB)"
          value={`${formatNumber(networkBandwidth, "GB")}`}
        />
        <SingleNumber
          description="Total Network Value (TVN)"
          value={`${formatNumber(totalNetworkValue)} USD/yr`}
          info="The total economic value of running the network for one year, based on current market rates from AWS/Azure/GCP, plus total staked tokens."
        />
        <SingleNumber
          description="Marketcap to Network Value ratio (MC/TVN)"
          value={`${formatNumber(marketcapToNetworkValue)}`}
        />
        <SingleNumber
          description="Economic Viability of Node Operators (EVNO)"
          value={`${formatNumber(xnodeProfitMargin * 100, "ratio")}%`}
        />
      </Category>
      <Category title="Cloud">
        <SingleNumber
          description="Total Cloud Compute (TCC)"
          value={`${formatNumber(cloudCompute)} cores`}
        />
        <SingleNumber
          description="Total Cloud Memory (TCM)"
          value={`${formatNumber(cloudMemory, "GB")}`}
        />
        <SingleNumber
          description="Total Cloud Storage (TCS)"
          value={`${formatNumber(cloudStorage, "GB")}`}
        />
        <SingleNumber
          description="Total Cloud Bandwidth (TCB)"
          value={`${formatNumber(cloudBandwidth, "GB")}`}
        />
        <SingleNumber
          description="Total Cloud Revenue (TCR)"
          value={`${formatNumber(cloudValue)} USD/yr`}
          info="The total economic value of the allocated network resources, based on current market rates from AWS/Azure/GCP."
        />
      </Category>
      <Category title="Consensus">
        <SingleNumber
          description="Token Price"
          value={`${formatNumber(config.cost.open)} USD`}
        />
        <SingleNumber
          description="Marketcap (MC)"
          value={`${formatNumber(marketcap)} USD`}
        />
        <SingleNumber
          description="Fully Diluted Marketcap (FDM)"
          value={`${formatNumber(fullyDilutedMarketcap)} USD`}
        />
      </Category>
      <Category title="Tokennomics">
        <SingleNumber
          description="Token Price"
          value={`${formatNumber(config.cost.open)} USD`}
        />
        <SingleNumber
          description="Marketcap (MC)"
          value={`${formatNumber(marketcap)} USD`}
        />
        <SingleNumber
          description="Fully Diluted Marketcap (FDM)"
          value={`${formatNumber(fullyDilutedMarketcap)} USD`}
        />
      </Category>
    </div>
  )
}

function formatNumber(number: number, type?: "GB" | "ratio") {
  const thresholds = [1_000_000_000, 1_000_000, 1_000]
  const postFixes = type === "GB" ? [" EB", " PB", " TB"] : ["B", "M", "K"]
  let postFix = type === "GB" ? " GB" : ""
  if (type !== "ratio") {
    for (let i = 0; i < thresholds.length; i++) {
      if (number > thresholds[i]) {
        number /= thresholds[i]
        postFix = postFixes[i]
        break
      }
    }
  }
  return `${Number(number.toPrecision(3))}${postFix}`
}

function totalNetwork(config: ConfigContextData, perNode: number) {
  return config.numberOfXnodes * perNode
}

function totalCloud(config: ConfigContextData, totalNetwork: number) {
  return totalNetwork * (config.xnodeAllocation / 100)
}

function growth<T extends Properties>(
  config: ConfigContextData,
  datapoint: (nodes: number) => T,
): ChartData<T> {
  return [
    {
      xAxis: "January",
      nodes: config.growth.nodes.jan,
    },
    {
      xAxis: "February",
      nodes: config.growth.nodes.feb,
    },
    {
      xAxis: "March",
      nodes: config.growth.nodes.mar,
    },
    {
      xAxis: "April",
      nodes: config.growth.nodes.apr,
    },
    {
      xAxis: "May",
      nodes: config.growth.nodes.may,
    },
    {
      xAxis: "June",
      nodes: config.growth.nodes.jun,
    },
    {
      xAxis: "July",
      nodes: config.growth.nodes.jul,
    },
    {
      xAxis: "August",
      nodes: config.growth.nodes.aug,
    },
    {
      xAxis: "September",
      nodes: config.growth.nodes.sep,
    },
    {
      xAxis: "October",
      nodes: config.growth.nodes.oct,
    },
    {
      xAxis: "November",
      nodes: config.growth.nodes.nov,
    },
    {
      xAxis: "December",
      nodes: config.growth.nodes.dec,
    },
  ].map((month) => {
    return { xAxis: month.xAxis, data: datapoint(month.nodes) }
  })
}

function Category({
  title,
  children,
}: {
  title: string
  children: JSX.Element[] | JSX.Element
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="ml-1 text-lg font-semibold">{title}</span>
      <div className="flex flex-wrap">{children}</div>
    </div>
  )
}

function SingleNumber({
  value,
  description,
  info,
}: {
  value: string
  description: string
  info?: string
}) {
  return (
    <Card className="rounded-none px-10 py-10">
      <SimpleTooltip tooltip={info}>
        <CardHeader className="place-items-center">
          <CardTitle className="flex gap-1 text-3xl">
            {value}
            {info && <Info className="size-4" />}
          </CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </SimpleTooltip>
    </Card>
  )
}
