"use client"

import { cn, formatNumber } from "@/lib/utils"
import {
  BrainCircuit,
  Camera,
  Cloud,
  Cpu,
  Database,
  Gamepad2,
  Globe,
  Grape,
  Server,
} from "lucide-react"

import { Gauge } from "./charts/gauge"
import { PieChart } from "./charts/pie-chart"
import { CloudCabal } from "./cloud-cabal"
import { CloudVisualizer } from "./cloud-visualizer"
import { ConfigContextData, useConfig } from "./config-provider"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { UseCase } from "./use-case"

export function NetworkStats() {
  const config = useConfig()

  const networkCompute = totalNetwork(config, config.xnodeSize.cpu)
  const networkMemory = totalNetwork(config, config.xnodeSize.memory)
  const networkStorage = totalNetwork(config, config.xnodeSize.storage)
  const networkBandwidth = totalNetwork(config, config.xnodeSize.bandwidth)

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

  const marketcapToNetworkValue = marketcap / totalNetworkValue

  const economicBreachResistance =
    totalStakedValue *
    (config.blockchain.consensus.faultTolerance.takeover / 100)

  const minimumViableDecentralization =
    100_000_000 /
    (config.cost.open *
      config.blockchain.requirement.proofOfStake *
      (config.blockchain.consensus.faultTolerance.takeover / 100))

  return (
    <div className="flex flex-col gap-1">
      <Category>
        <SingleNumber
          description="Total Network Value (TVN)"
          value={`${formatNumber(totalNetworkValue)} USD`}
        />
        <SingleNumber
          description="Marketcap to Network Value ratio (MC/TVN)"
          value={`${formatNumber(marketcapToNetworkValue)}`}
        />
        <SingleNumber
          description="Network Revenue (NR)"
          value={`${formatNumber(cloudValue)} USD/yr`}
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
        <div className="col-span-4 max-lg:col-span-2">
          <CloudVisualizer />
        </div>
        <div className="col-span-2 grid grid-cols-3 rounded-md border bg-white max-lg:col-span-2">
          <UseCase
            title="HD Movies"
            icon={(className) => <Camera className={className} />}
            cpu={0}
            memory={0}
            storage={30.5}
          />
          <UseCase
            title="Web3 Nodes"
            icon={(className) => <Server className={className} />}
            cpu={8}
            memory={32}
            storage={2000}
          />
          <UseCase
            title="Minecraft Servers"
            icon={(className) => <Gamepad2 className={className} />}
            cpu={2}
            memory={4}
            storage={30}
          />
          <UseCase
            title="Websites"
            icon={(className) => <Globe className={className} />}
            cpu={1}
            memory={1}
            storage={1}
          />
          <UseCase
            title="Large Language Models"
            icon={(className) => <BrainCircuit className={className} />}
            cpu={8}
            memory={16}
            storage={50}
          />
          <UseCase
            title="Startup Clouds"
            icon={(className) => <Cloud className={className} />}
            cpu={8}
            memory={32}
            storage={500}
          />
          <UseCase
            title="K8s workers"
            icon={(className) => <Cpu className={className} />}
            cpu={0.5}
            memory={0.7}
            storage={0}
          />
          <UseCase
            title="Raspberry Pi 5s"
            icon={(className) => <Grape className={className} />}
            cpu={4}
            memory={8}
            storage={0}
          />
          <UseCase
            title="Databases"
            icon={(className) => <Database className={className} />}
            cpu={2}
            memory={4}
            storage={100}
          />
        </div>
        <Gauge
          classname="max-lg:col-span-2"
          title="Economic Breach Resistance (EBR)"
          chartData={[
            {
              xAxis: "USD",
              data: {
                value: economicBreachResistance,
              },
            },
          ]}
          chartConfig={{
            value: {
              label: "USD",
            },
          }}
          max={100_000_000}
        />
        <Gauge
          classname="max-lg:col-span-2"
          title="Minimum Viable Decentralization (MVD)"
          chartData={[
            {
              xAxis: "nodes",
              data: {
                value: minimumViableDecentralization,
              },
            },
          ]}
          chartConfig={{
            value: {
              label: "nodes",
            },
          }}
          max={100_000}
        />
        <div className="col-span-2 max-lg:col-span-2">
          <CloudCabal />
        </div>
        <SingleNumber
          className="max-lg:col-span-2"
          description="Staking Locked Value (SLV)"
          value={`${formatNumber(totalStakedValue)} USD`}
        />
        <PieChart
          classname="content-center max-lg:col-span-2"
          title="Total Cloud Resources"
          chartData={[
            {
              xAxis: "Compute (10 Cores)",
              data: {
                value: cloudCompute / 10,
              },
            },
            {
              xAxis: "Memory (100 GB)",
              data: {
                value: cloudMemory / 100,
              },
            },
            {
              xAxis: "Storage (500 GB)",
              data: {
                value: cloudStorage / 500,
              },
            },
            {
              xAxis: "Bandwidth (1 TB)",
              data: {
                value: cloudBandwidth / 1000,
              },
            },
          ]}
          chartConfig={{
            value: {
              label: "Resources",
            },
          }}
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
      <div className="grid w-full auto-rows-auto grid-cols-6 gap-1 max-lg:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

function SingleNumber({
  value,
  description,
  className,
}: {
  value: string
  description: string
  className?: string
}) {
  return (
    <Card className={cn("content-center px-2 py-8", className)}>
      <CardHeader className="place-items-center">
        <CardTitle className="flex gap-1 text-center text-2xl">
          {value}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
