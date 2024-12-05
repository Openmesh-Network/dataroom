"use client"

import { ChartData, Properties } from "./charts/chart-types"
import { MultiLineChart } from "./charts/multi-line-chart"
import { StackedAreaChart } from "./charts/stacked-area-chart"
import { StackedBarChart } from "./charts/stacked-bar-chart"
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
  const dataValueIndex =
    cloudStorage * (config.web3DataPercentage / 100) * config.cost.web3Data

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
      <Category title="Network">
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
              color: "red",
            },
            memory: {
              label: "Memory (GB)",
              color: "orange",
            },
            storage: {
              label: "Storage (GB)",
              color: "green",
            },
            bandwidth: {
              label: "Bandwidth (GB)",
              color: "blue",
            },
          }}
        />
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
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Compute Cost"
          description="Monthly cost of per core at certain order sizes"
          tickFormatter={(xAxis) => xAxis.split(" ")[0]}
          chartData={[
            {
              xAxis: "1 Cores",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "10 Cores",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "100 Cores",
              data: {
                openmesh: 0.01,
                aws: 0.04,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "1k Cores",
              data: {
                openmesh: 0.01,
                aws: 0.03,
                gcp: 0.03,
                azure: 0.02,
              },
            },
            {
              xAxis: "100k Cores",
              data: {
                openmesh: 0.01,
                aws: 0.02,
                gcp: 0.02,
                azure: 0.01,
              },
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
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Memory Cost"
          description="Monthly cost of per GB of memory at certain order sizes"
          tickFormatter={(xAxis) => xAxis}
          chartData={[
            {
              xAxis: "1GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "10GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "100GB",
              data: {
                openmesh: 0.01,
                aws: 0.04,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "1TB",
              data: {
                openmesh: 0.01,
                aws: 0.03,
                gcp: 0.03,
                azure: 0.02,
              },
            },
            {
              xAxis: "100TB",
              data: {
                openmesh: 0.01,
                aws: 0.02,
                gcp: 0.02,
                azure: 0.01,
              },
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
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Storage Cost"
          description="Monthly cost of per GB of storage at certain order sizes"
          tickFormatter={(xAxis) => xAxis}
          chartData={[
            {
              xAxis: "1GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "100GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "1TB",
              data: {
                openmesh: 0.01,
                aws: 0.04,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "10TB",
              data: {
                openmesh: 0.01,
                aws: 0.03,
                gcp: 0.03,
                azure: 0.02,
              },
            },
            {
              xAxis: "1PB",
              data: {
                openmesh: 0.01,
                aws: 0.02,
                gcp: 0.02,
                azure: 0.01,
              },
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
        <MultiLineChart
          classname="max-xl:col-span-2 max-xl:row-span-2 content-center"
          title="Bandwidth Cost"
          description="Cost per GB of bandwidth at certain order sizes"
          tickFormatter={(xAxis) => xAxis}
          chartData={[
            {
              xAxis: "1GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "100GB",
              data: {
                openmesh: 0.01,
                aws: 0.05,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "1TB",
              data: {
                openmesh: 0.01,
                aws: 0.04,
                gcp: 0.04,
                azure: 0.03,
              },
            },
            {
              xAxis: "10TB",
              data: {
                openmesh: 0.01,
                aws: 0.03,
                gcp: 0.03,
                azure: 0.02,
              },
            },
            {
              xAxis: "1PB",
              data: {
                openmesh: 0.01,
                aws: 0.02,
                gcp: 0.02,
                azure: 0.01,
              },
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
        />
        <SingleNumber
          description="Data Value Index (DVI)"
          value={`${formatNumber(dataValueIndex)} USD`}
        />
      </Category>
      <Category title="Consensus">
        <StackedAreaChart
          classname="col-span-2 row-span-2 lg:max-xl:row-span-1 content-center"
          title="Network Health"
          description="Healthy Nodes vs Faulty Nodes"
          chartData={growth(config, (nodes) => {
            const faulty = Math.round((Math.random() * nodes) / 10)
            return {
              faulty: faulty,
              healthy: nodes - faulty,
            }
          })}
          chartConfig={{
            faulty: { label: "Faulty", color: "red" },
            healthy: { label: "Healthy", color: "green" },
          }}
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
          description="Staking Locked Value (SLV)"
          value={`${formatNumber(totalStakedValue)} USD`}
        />
        <SingleNumber
          description="Economic Breach Resistance (EBR)"
          value={`${formatNumber(economicBreachResistance)} USD`}
        />
        <SingleNumber
          description="Consensus Finalization Time (CFT)"
          value={`${formatNumber(consensusFinalizationTime)}s`}
        />
      </Category>
      <Category title="Tokennomics">
        <StackedAreaChart
          classname="col-span-2 row-span-2 lg:max-xl:row-span-1 content-center"
          title="Token Utilization Velocity"
          description="OPEN tokens part of transactions"
          chartData={growth(config, (nodes) => {
            const used = Math.min(
              nodes * config.blockchain.requirement.proofOfStake,
              config.blockchain.tokenSupply.circulating,
            )
            return {
              used: used,
              unused: config.blockchain.tokenSupply.circulating - used,
            }
          })}
          chartConfig={{
            used: {
              label: "Part of a transaction",
              color: "blue",
            },
            unused: {
              label: "Stale",
              color: "orange",
            },
          }}
        />
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
  title: string
  children: JSX.Element[] | JSX.Element
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="ml-1 text-lg font-semibold">{title}</span>
      <div className="grid w-full auto-rows-auto grid-cols-4 gap-1 max-lg:grid-cols-2">
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
    <Card className="content-center rounded-none px-10 py-10">
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
