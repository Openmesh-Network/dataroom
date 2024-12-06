"use client"

import { formatNumber } from "@/lib/utils"

import { ChartData, Properties } from "./charts/chart-types"
import { MultiLineChart } from "./charts/multi-line-chart"
import { StackedBarChart } from "./charts/stacked-bar-chart"
import { CloudVisualizer } from "./cloud-visualizer"
import { ConfigContextData, useConfig } from "./config-provider"
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
  const totalCloudValue =
    cloudValue +
    totalNetwork(
      config,
      config.cost.open * config.blockchain.requirement.proofOfResource,
    )
  const dataValueIndex =
    cloudStorage * (config.web3DataPercentage / 100) * config.cost.web3Data

  const marketcap = config.blockchain.tokenSupply.circulating * config.cost.open

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

  const networkHaltNodeThreshold = Math.round(
    config.numberOfXnodes *
      (config.blockchain.consensus.faultTolerance.halt / 100),
  )
  const networkTakeoverNodeThreshold = Math.round(
    config.numberOfXnodes *
      (config.blockchain.consensus.faultTolerance.takeover / 100),
  )
  const consensusFinalizationTime =
    config.blockchain.consensus.finalizationTime.base +
    config.blockchain.consensus.finalizationTime.sqrtMultiplier *
      Math.sqrt(config.numberOfXnodes)

  const economicBreachResistance =
    totalStakedValue *
    (config.blockchain.consensus.faultTolerance.takeover / 100)

  return (
    <div className="flex flex-col gap-3">
      <CloudVisualizer />
      <Category>
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
        <StackedBarChart
          classname="col-span-2 row-span-2 lg:max-xl:row-span-1 content-center"
          title="Total Cloud Resources"
          description="Cloud Resource Change Over Time"
          chartData={growth(config, (nodes) => {
            return {
              cpu:
                nodes *
                config.xnodeSize.cpu *
                (config.xnodeAllocationPercentage / 100),
              memory:
                nodes *
                config.xnodeSize.memory *
                (config.xnodeAllocationPercentage / 100),
              storage:
                nodes *
                config.xnodeSize.storage *
                (config.xnodeAllocationPercentage / 100),
              bandwidth:
                nodes *
                config.xnodeSize.bandwidth *
                (config.xnodeAllocationPercentage / 100),
            }
          })}
          chartConfig={{
            cpu: {
              label: "Cores",
            },
            memory: {
              label: "Memory (GB)",
            },
            storage: {
              label: "Storage (GB)",
            },
            bandwidth: {
              label: "Bandwidth (GB)",
            },
          }}
        />
        <SingleNumber
          description="Economic Breach Resistance (EBR)"
          value={`${formatNumber(economicBreachResistance)} USD`}
        />
        <SingleNumber
          description="Staking Locked Value (SLV)"
          value={`${formatNumber(totalStakedValue)} USD`}
        />
        <SingleNumber
          description="Total Network Value (TVN)"
          value={`${formatNumber(totalNetworkValue)} USD`}
        />
        <SingleNumber
          description="Total Cloud Value (TCV)"
          value={`${formatNumber(totalCloudValue)} USD`}
        />
        <SingleNumber
          description="Data Value Index (DVI)"
          value={`${formatNumber(dataValueIndex)} USD`}
        />
        <SingleNumber
          description="Network Revenue (NR)"
          value={`${formatNumber(cloudValue)} USD/yr`}
        />
        <StackedBarChart
          classname="col-span-2 row-span-2 lg:max-xl:row-span-1 content-center"
          title="Total Network Resources"
          description="Network Resource Change Over Time"
          chartData={growth(config, (nodes) => {
            return {
              cpu: nodes * config.xnodeSize.cpu,
              memory: nodes * config.xnodeSize.memory,
              storage: nodes * config.xnodeSize.storage,
              bandwidth: nodes * config.xnodeSize.bandwidth,
            }
          })}
          chartConfig={{
            cpu: {
              label: "Cores",
            },
            memory: {
              label: "Memory (GB)",
            },
            storage: {
              label: "Storage (GB)",
            },
            bandwidth: {
              label: "Bandwidth (GB)",
            },
          }}
        />
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Storage Cost"
          description="Monthly cost in USD per TB of storage at certain order sizes"
          tickFormatter={(xAxis) => xAxis}
          chartData={[
            {
              xAxis: "1GB",
              data: {
                openmesh: 0.006,
                aws: 0.023,
                gcp: 0.03,
                azure: 0.018,
              },
            },
            {
              xAxis: "100GB",
              data: {
                openmesh: 0.006,
                aws: 0.023,
                gcp: 0.03,
                azure: 0.018,
              },
            },
            {
              xAxis: "50TB",
              data: {
                openmesh: 0.006,
                aws: 0.023,
                gcp: 0.03,
                azure: 0.018,
              },
            },
            {
              xAxis: "500TB",
              data: {
                openmesh: 0.006,
                aws: 0.022,
                gcp: 0.03,
                azure: 0.018,
              },
            },
          ].map((datapoint) => {
            return {
              ...datapoint,
              data: {
                openmesh: datapoint.data.openmesh * 1000,
                aws: datapoint.data.aws * 1000,
                gcp: datapoint.data.gcp * 1000,
                azure: datapoint.data.azure * 1000,
              },
            }
          })}
          chartConfig={{
            openmesh: {
              label: "Openmesh",
            },
            aws: {
              label: "AWS",
            },
            gcp: {
              label: "GCP",
            },
            azure: {
              label: "Azure",
            },
          }}
        />
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Compute Cost"
          description="Monthly cost per core at certain order sizes (single machine)"
          tickFormatter={(xAxis) => xAxis.split(" ")[0]}
          chartData={[
            {
              xAxis: "1 Cores",
              data: {
                openmesh: 2.5,
                aws: 3.89,
                gcp: 61.24,
                azure: 7.3,
              },
            },
            {
              xAxis: "4 Cores",
              data: {
                openmesh: 14 / 4,
                aws: 124.42 / 4,
                gcp: 122.47 / 4,
                azure: 124.1 / 4,
              },
            },
            {
              xAxis: "16 Cores",
              data: {
                openmesh: 102 / 16,
                aws: 570.24 / 16,
                gcp: 489.89 / 16,
                azure: 494.94 / 16,
              },
            },
            {
              xAxis: "96 Cores",
              data: {
                openmesh: 3840.0 / 96,
                aws: 3856.9 / 96,
                gcp: 2939.34 / 96,
                azure: 3539.04 / 96,
              },
            },
          ]}
          chartConfig={{
            openmesh: {
              label: "Openmesh",
            },
            aws: {
              label: "AWS",
            },
            gcp: {
              label: "GCP",
            },
            azure: {
              label: "Azure",
            },
          }}
        />
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Data Retrieval Cost"
          description="Cost in USD per TB of bandwidth at certain order sizes"
          tickFormatter={(xAxis) => xAxis}
          chartData={[
            {
              xAxis: "1GB",
              data: {
                openmesh: 0.0,
                aws: 0.02,
                gcp: 0.0,
                azure: 0.0,
              },
            },
            {
              xAxis: "100GB",
              data: {
                openmesh: 0.0,
                aws: 0.02,
                gcp: 0.0,
                azure: 0.0,
              },
            },
            {
              xAxis: "50TB",
              data: {
                openmesh: 0.0,
                aws: 0.02,
                gcp: 0.0,
                azure: 0.0,
              },
            },
            {
              xAxis: "500TB",
              data: {
                openmesh: 0.0,
                aws: 0.02,
                gcp: 0.0,
                azure: 0.0,
              },
            },
          ].map((datapoint) => {
            return {
              ...datapoint,
              data: {
                openmesh: datapoint.data.openmesh * 1000,
                aws: datapoint.data.aws * 1000,
                gcp: datapoint.data.gcp * 1000,
                azure: datapoint.data.azure * 1000,
              },
            }
          })}
          chartConfig={{
            openmesh: {
              label: "Openmesh",
            },
            aws: {
              label: "AWS",
            },
            gcp: {
              label: "GCP",
            },
            azure: {
              label: "Azure",
            },
          }}
        />
        <SingleNumber
          description="Marketcap to Network Value ratio (MC/TVN)"
          value={`${formatNumber(marketcapToNetworkValue)}`}
        />
        <SingleNumber
          description="Economic Viability of Node Operators (EVNO)"
          value={`${formatNumber(xnodeProfitMargin * 100, "ratio")}%`}
        />
        <SingleNumber
          description="Network Halt Node Threshold (NHNT)"
          value={`${formatNumber(networkHaltNodeThreshold)}`}
        />
        <SingleNumber
          description="Network Takeover Node Threshold (NTNT)"
          value={`${formatNumber(networkTakeoverNodeThreshold)}`}
        />
        <SingleNumber
          description="Consensus Finalization Time (CFT)"
          value={`${formatNumber(consensusFinalizationTime)}s`}
        />
      </Category>
    </div>
  )
}

function totalNetwork(config: ConfigContextData, perNode: number) {
  return config.numberOfXnodes * perNode
}

function totalCloud(config: ConfigContextData, totalNetwork: number) {
  return totalNetwork * (config.xnodeAllocationPercentage / 100)
}

function growth<T extends Properties>(
  config: ConfigContextData,
  datapoint: (nodes: number) => T,
): ChartData<T> {
  const growSize = [
    config.growth.nodes.jan,
    config.growth.nodes.feb,
    config.growth.nodes.mar,
    config.growth.nodes.apr,
    config.growth.nodes.may,
    config.growth.nodes.jun,
    config.growth.nodes.jul,
    config.growth.nodes.aug,
    config.growth.nodes.sep,
    config.growth.nodes.oct,
    config.growth.nodes.nov,
    config.growth.nodes.dec,
  ]
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return labels
    .map((label, i) => {
      return {
        xAxis: label,
        nodes: growSize
          .slice(0, i + 1)
          .reduce((prev, cur) => prev + cur, config.numberOfXnodes),
      }
    })
    .map((month) => {
      return { xAxis: month.xAxis, data: datapoint(month.nodes) }
    })
}

function Category({
  title,
  children,
}: {
  title?: string
  children: JSX.Element[] | JSX.Element
}) {
  return (
    <div className="flex flex-col gap-1">
      {title && <span className="ml-1 text-lg font-semibold">{title}</span>}
      <div className="grid w-full auto-rows-auto grid-cols-4 gap-4 max-lg:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

function SingleNumber({
  value,
  description,
}: {
  value: string
  description: string
}) {
  return (
    <Card className="content-center px-10 py-10">
      <CardHeader className="place-items-center">
        <CardTitle className="flex gap-1 text-center text-3xl">
          {value}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
