"use client"

import { Info } from "lucide-react"

import { ConfigContextData, useConfig } from "./config-provider"
import { MultiLineChart } from "./multi-line-chart"
import { SimpleTooltip } from "./SimpleTooltip"
import { StackedBarChart } from "./stacked-bar-chart"
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

  const marketcap = config.blockchain.tokenSupply.circulating * config.cost.open
  const fullyDilutedMarketcap =
    config.blockchain.tokenSupply.total * config.cost.open

  const marketcapToNetworkValue = marketcap / networkValue

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
          <StackedBarChart />
          <MultiLineChart />
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
          value={`${formatNumber(networkValue)} USD/yr`}
          info="The total economic value/cost of running the network for one year, based on current market rates from AWS/Azure/GCP."
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
          description="Total Cloud Value (TVN)"
          value={`${formatNumber(cloudValue)} USD/yr`}
          info="The total economic value/cost of the allocated network resources, based on current market rates from AWS/Azure/GCP."
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
