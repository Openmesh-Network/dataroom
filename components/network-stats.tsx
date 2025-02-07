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
  Info,
  Server,
} from "lucide-react"

import { ChartData, Properties } from "./charts/chart-types"
import { Gauge } from "./charts/gauge"
import { MultiBarChart } from "./charts/multi-bar-chart"
import { MultiLineChart } from "./charts/multi-line-chart"
import { PieChart } from "./charts/pie-chart"
import { CloudCabal } from "./cloud-cabal"
import { CloudVisualizer } from "./cloud-visualizer"
import { ConfigContextData, useConfig } from "./config-provider"
import { SimpleTooltip } from "./SimpleTooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
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

  const xnodeAmortizedCost = config.cost.xnode / config.hardwareAmortization
  const xnodeElectricityCost =
    ((config.xnodeSize.electricity * 24 * 30) / 1000) * config.cost.electricity
  const xnodeComputeRevenue = config.xnodeSize.cpu * config.cost.cpu
  const xnodeMemoryRevenue = config.xnodeSize.memory * config.cost.memory
  const xnodeStorageRevenue = config.xnodeSize.storage * config.cost.storage
  const xnodeBandwidthRevenue =
    config.xnodeSize.bandwidth * config.cost.bandwidth

  const economicBreachResistance =
    totalStakedValue *
    (config.blockchain.consensus.faultTolerance.takeover / 100)

  const minimumViableDecentralization =
    config.blockchain.requirement.minimumDecentralizedBreachResistance /
    (config.cost.open *
      config.blockchain.requirement.proofOfStake *
      (config.blockchain.consensus.faultTolerance.takeover / 100))

  return (
    <div className="flex flex-col gap-2">
      <Category>
        <SingleNumber
          description="Total Network Value (TVN)"
          value={`${formatNumber(totalNetworkValue)} USD`}
          tooltip={{
            explanation:
              "Total Network Value represents the combined value of all network resources and staked tokens in the system.",
            formula:
              "TVN = Staked Tokens + Data Storage + Compute Capacity + Contributions",
          }}
        />
        <SingleNumber
          description="Marketcap to Network Value ratio (MC/TVN)"
          value={`${formatNumber(marketcapToNetworkValue)}`}
          tooltip={{
            explanation:
              "The ratio of Openmesh market cap to its total network value.",
            formula: "MC/TVN = Marketcap / TVN",
          }}
        />
        <SingleNumber
          description="Network Revenue (NR)"
          value={`${formatNumber(cloudValue)} USD/yr`}
          tooltip={{
            explanation:
              "Total revenue generated based on donated resources and equivalent prices.",
            formula: "NR = Donated Resources × Equivalent Price",
          }}
        />
        <SingleNumber
          description="Total Network Compute (TNC)"
          value={`${formatNumber(networkCompute)} cores`}
          tooltip={{
            explanation: "Total compute capacity available in the network.",
            formula: "TNC = Sum of all compute resources",
          }}
        />
        <SingleNumber
          description="Total Network Memory (TNM)"
          value={`${formatNumber(networkMemory, "GB")}`}
          tooltip={{
            explanation: "Total memory capacity available in the network.",
            formula: "TNM = Sum of available memory resources",
          }}
        />
        <SingleNumber
          description="Total Network Storage (TNS)"
          value={`${formatNumber(networkStorage, "GB")}`}
          tooltip={{
            explanation: "Total storage capacity available in the network.",
            formula: "TNS = Sum of available storage resources",
          }}
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
          classname="content-center max-lg:col-span-2"
          title="Economic Breach Resistance (EBR)"
          tooltip={{
            explanation:
              "Cost required to compromise 51% of the network based on staked tokens and resources.",
            formula: "Value of 51% of staked tokens and resources",
          }}
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
          classname="content-center max-lg:col-span-2"
          title="Minimum Viable Decentralization (MVD)"
          tooltip={{
            explanation:
              "Minimum number of nodes required for decentralized operation.",
            formula: "Total Nodes / Minimum Nodes Required",
          }}
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
          tooltip={{
            explanation:
              "Total value of tokens locked for governance, validation and resource provisioning.",
            formula: "SLV = Staked tokens × Token price",
          }}
        />
        <PieChart
          classname="content-center max-lg:col-span-2"
          title="Total Cloud Resources"
          tooltip={{
            explanation:
              "Distribution of compute, memory, storage, and bandwidth resources available in the cloud.",
            formula: "Resources allocated per category / Total resources",
          }}
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
      <Accordion
        type="multiple"
        className="flex flex-col gap-2"
        defaultValue={[
          "Openmesh vs Others",
          "Economical",
          "Sustainability & Security",
        ]}
      >
        <Section title="Openmesh vs Others">
          <MultiLineChart
            classname="content-center border-0"
            title="Storage Cost"
            description="Monthly cost in USD per TB of storage at certain order sizes"
            tickFormatter={(xAxis) => xAxis}
            xAxisLabel="Storage (TB)"
            yAxisLabel="Cost ($)"
            tooltip={{
              explanation: "Cost of storing 1TB on Openmesh vs competitors.",
              formula: "AWS S3 Price, GCP Price, Azure Price vs Openmesh Price",
            }}
            chartData={[
              {
                xAxis: "1GB",
                data: {
                  openmesh: 0,
                  baremetal: 0.006,
                  aws: 0.023,
                  gcp: 0.03,
                  azure: 0.018,
                },
              },
              {
                xAxis: "100GB",
                data: {
                  openmesh: 0,
                  baremetal: 0.006,
                  aws: 0.023,
                  gcp: 0.03,
                  azure: 0.018,
                },
              },
              {
                xAxis: "50TB",
                data: {
                  openmesh: 0,
                  baremetal: 0.006,
                  aws: 0.023,
                  gcp: 0.03,
                  azure: 0.018,
                },
              },
              {
                xAxis: "500TB",
                data: {
                  openmesh: 0,
                  baremetal: 0.006,
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
                  baremetal: datapoint.data.baremetal * 1000,
                  aws: datapoint.data.aws * 1000,
                  gcp: datapoint.data.gcp * 1000,
                  azure: datapoint.data.azure * 1000,
                },
              }
            })}
            chartConfig={{
              openmesh: {
                label: "Openmesh Cloud",
              },
              baremetal: {
                label: "Openmesh Baremetal",
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
            classname="content-center border-0"
            title="Compute Cost"
            description="Monthly cost per core at certain order sizes (single machine)"
            xAxisLabel="Compute (Cores)"
            yAxisLabel="Cost ($)"
            tooltip={{
              explanation:
                "Cost of 1 compute core on Openmesh vs centralized clouds.",
              formula: "CC = Openmesh Cost / Compute Hour",
            }}
            tickFormatter={(xAxis) => xAxis.split(" ")[0]}
            chartData={[
              {
                xAxis: "1 Cores",
                data: {
                  openmesh: 0,
                  baremetal: 2.5,
                  aws: 3.89,
                  gcp: 61.24,
                  azure: 7.3,
                },
              },
              {
                xAxis: "4 Cores",
                data: {
                  openmesh: 0,
                  baremetal: 14 / 4,
                  aws: 124.42 / 4,
                  gcp: 122.47 / 4,
                  azure: 124.1 / 4,
                },
              },
              {
                xAxis: "16 Cores",
                data: {
                  openmesh: 0,
                  baremetal: 102 / 16,
                  aws: 570.24 / 16,
                  gcp: 489.89 / 16,
                  azure: 494.94 / 16,
                },
              },
              {
                xAxis: "96 Cores",
                data: {
                  openmesh: 0,
                  baremetal: 3840.0 / 96,
                  aws: 3856.9 / 96,
                  gcp: 2939.34 / 96,
                  azure: 3539.04 / 96,
                },
              },
            ]}
            chartConfig={{
              openmesh: {
                label: "Openmesh Cloud",
              },
              baremetal: {
                label: "Openmesh Baremetal",
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
            classname="content-center border-0"
            title="Data Retrieval Cost"
            description="Cost in USD per TB of bandwidth at certain order sizes"
            xAxisLabel="Bandwidth (TB)"
            yAxisLabel="Cost ($)"
            tooltip={{
              explanation:
                "The cost of retrieving 1TB of data from Openmesh versus competitors.",
              formula:
                "AWS Data Retrieval Cost, GCP Data Retrieval Cost, Azure Data Retrieval Cost vs Openmesh Cost",
            }}
            tickFormatter={(xAxis) => xAxis}
            chartData={[
              {
                xAxis: "1GB",
                data: {
                  openmesh: 0,
                  baremetal: 0.002,
                  aws: 0.004,
                  gcp: 0.05,
                  azure: 0.002,
                },
              },
              {
                xAxis: "100GB",
                data: {
                  openmesh: 0,
                  baremetal: 0.002,
                  aws: 0.004,
                  gcp: 0.05,
                  azure: 0.002,
                },
              },
              {
                xAxis: "50TB",
                data: {
                  openmesh: 0,
                  baremetal: 0.002,
                  aws: 0.004,
                  gcp: 0.05,
                  azure: 0.002,
                },
              },
              {
                xAxis: "500TB",
                data: {
                  openmesh: 0,
                  baremetal: 0.002,
                  aws: 0.004,
                  gcp: 0.05,
                  azure: 0.002,
                },
              },
            ].map((datapoint) => {
              return {
                ...datapoint,
                data: {
                  openmesh: datapoint.data.openmesh * 1000,
                  baremetal: datapoint.data.baremetal * 1000,
                  aws: datapoint.data.aws * 1000,
                  gcp: datapoint.data.gcp * 1000,
                  azure: datapoint.data.azure * 1000,
                },
              }
            })}
            chartConfig={{
              openmesh: {
                label: "Openmesh Cloud",
              },
              baremetal: {
                label: "Openmesh Baremetal",
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
            description="Cloud Cost Displacement Ratio (CCDR)"
            value={`${formatNumber((27 - 9) / 27, "ratio")}`}
          />
        </Section>
        <Section title="Economical">
          <MultiLineChart
            classname="content-center"
            title="Token Utilization Velocity"
            description="OPEN tokens part of transactions"
            xAxisLabel="Time (Months)"
            yAxisLabel="$OPEN Tokens"
            tooltip={{
              explanation: "Frequency of OPEN tokens within the network.",
              formula: "TUV = Transaction Volume / Circulating Supply",
            }}
            chartData={growth(config, (nodes) => {
              const tokens = nodes * config.blockchain.requirement.proofOfStake

              return {
                tokens: tokens,
              }
            })}
            chartConfig={{
              tokens: {
                label: "OPEN tokens",
              },
            }}
          />
          <MultiLineChart
            classname="content-center"
            title="Data Value Index (DVI)"
            description="Valuation of data stored in the network (in USD)"
            xAxisLabel="Time (Months)"
            yAxisLabel="Value ($)"
            tooltip={{
              explanation:
                "Economic worth of stored data based on usage frequency and type.",
              formula: "Sum(Data worth per type)",
            }}
            chartData={growth(config, (nodes) => {
              const dataValue =
                nodes *
                config.xnodeSize.storage *
                (config.xnodeAllocationPercentage / 100) *
                (config.web3DataPercentage / 100) *
                config.cost.web3Data
              return {
                dataValue: dataValue,
              }
            })}
            chartConfig={{
              dataValue: { label: "Data Value" },
            }}
          />
          <MultiLineChart
            classname="content-center"
            title="Economic Viability of Node Operators (EVNO)"
            description="Monthly profit percentage achieved by purchasing an Xnode"
            xAxisLabel="Time (Months)"
            yAxisLabel="Profit (%)"
            tooltip={{
              explanation:
                "Comparison of node operators' underlying costs (hardware, electricity) versus earnings in OPEN tokens.",
              formula:
                "Monthly Token Earnings (MTE) / Monthly Operating Costs (MOC)",
            }}
            chartData={growth(config, (nodes) => {
              const validatorRevenue =
                (config.blockchain.tokenSupply.total / nodes) *
                (config.blockchain.rewards.validator.percentage /
                  100 /
                  config.blockchain.rewards.validator.period)
              const earlyValidatorRevenue =
                (config.blockchain.tokenSupply.total / nodes) *
                (config.blockchain.rewards.earlyValidator.percentage /
                  100 /
                  config.blockchain.rewards.earlyValidator.period)
              const xnodeProfitMargin =
                (validatorRevenue +
                  earlyValidatorRevenue +
                  xnodeComputeRevenue +
                  xnodeMemoryRevenue +
                  xnodeStorageRevenue +
                  xnodeBandwidthRevenue) /
                (xnodeAmortizedCost + xnodeElectricityCost)
              return {
                xnodeProfitMargin: xnodeProfitMargin * 100,
              }
            })}
            chartConfig={{
              xnodeProfitMargin: { label: "Profit Percentage" },
            }}
          />
        </Section>
        <Section title="Sustainability & Security">
          <MultiLineChart
            classname="content-center"
            title="Fault Tolerance Threshold (FTT)"
            description="Nodes required to attack the network"
            xAxisLabel="Time (Months)"
            yAxisLabel="Nodes"
            tooltip={{
              explanation:
                "Percentage of nodes that can fail while maintaining full functionality.",
              formula: "Failed nodes / Total nodes",
            }}
            chartData={growth(config, (nodes) => {
              const networkTakeoverNodeThreshold = Math.round(
                nodes *
                  (config.blockchain.consensus.faultTolerance.takeover / 100),
              )
              const networkHaltNodeThreshold = Math.round(
                nodes * (config.blockchain.consensus.faultTolerance.halt / 100),
              )
              return {
                networkTakeoverNodeThreshold: networkTakeoverNodeThreshold,
                networkHaltNodeThreshold: networkHaltNodeThreshold,
              }
            })}
            chartConfig={{
              networkTakeoverNodeThreshold: { label: "Takeover Threshold" },
              networkHaltNodeThreshold: { label: "Halt Threshold" },
            }}
          />
          <MultiLineChart
            classname="content-center"
            title="Consensus Finalization Time (CFT)"
            description="Time it takes the network to reach consensus (in seconds)"
            xAxisLabel="Time (Months)"
            yAxisLabel="Time (s)"
            tooltip={{
              explanation:
                "Time taken to finalize a consensus decision in network consensus.",
              formula: "Consensus for finality (s) * Total Network Nodes",
            }}
            chartData={growth(config, (nodes) => {
              const cft =
                config.blockchain.consensus.finalizationTime.base +
                config.blockchain.consensus.finalizationTime.sqrtMultiplier *
                  Math.sqrt(nodes)
              return {
                cft: cft,
              }
            })}
            chartConfig={{
              cft: { label: "Finalization Time" },
            }}
          />
          <MultiBarChart
            classname="content-center"
            title="Resource Contribution Equality Index (RCEI)"
            tickFormatter={(x) => x}
            description="Amount of nodes allocating a certain percentage"
            tooltip={{
              explanation:
                "Variance in resource contributions across nodes, indicating decentralization fairness.",
              formula: "RCEI = Variance / Mean resource contributions",
            }}
            chartData={[
              {
                xAxis: "0-5%",
                data: {
                  xnodes: config.numberOfXnodes * 0.02,
                },
              },
              {
                xAxis: "5-7%",
                data: {
                  xnodes: config.numberOfXnodes * 0.04,
                },
              },
              {
                xAxis: "7-9%",
                data: {
                  xnodes: config.numberOfXnodes * 0.12,
                },
              },
              {
                xAxis: "9-10%",
                data: {
                  xnodes: config.numberOfXnodes * 0.18,
                },
              },
              {
                xAxis: "10-11%",
                data: {
                  xnodes: config.numberOfXnodes * 0.18,
                },
              },
              {
                xAxis: "11-13%",
                data: {
                  xnodes: config.numberOfXnodes * 0.12,
                },
              },
              {
                xAxis: "13-15%",
                data: {
                  xnodes: config.numberOfXnodes * 0.04,
                },
              },
              {
                xAxis: "15-20%",
                data: {
                  xnodes: config.numberOfXnodes * 0.02,
                },
              },
              {
                xAxis: "20-30%",
                data: {
                  xnodes: config.numberOfXnodes * 0.015,
                },
              },
              {
                xAxis: "30-40%",
                data: {
                  xnodes: config.numberOfXnodes * 0.01,
                },
              },
              {
                xAxis: "40-50%",
                data: {
                  xnodes: config.numberOfXnodes * 0.008,
                },
              },
              {
                xAxis: "50-60%",
                data: {
                  xnodes: config.numberOfXnodes * 0.007,
                },
              },
              {
                xAxis: "60-70%",
                data: {
                  xnodes: config.numberOfXnodes * 0.005,
                },
              },
              {
                xAxis: "70-80%",
                data: {
                  xnodes: config.numberOfXnodes * 0.005,
                },
              },
              {
                xAxis: "80-90%",
                data: {
                  xnodes: config.numberOfXnodes * 0.1,
                },
              },
              {
                xAxis: "90-100%",
                data: {
                  xnodes: config.numberOfXnodes * 0.12,
                },
              },
            ]}
            chartConfig={{
              xnodes: { label: "Xnodes" },
            }}
          />
        </Section>
      </Accordion>
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
      <div className="grid w-full auto-rows-auto grid-cols-6 gap-1 max-lg:grid-cols-2">
        {children}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: JSX.Element[] | JSX.Element
}) {
  return (
    <AccordionItem value={title} className="rounded-md border bg-white px-4">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <Separator />
        <div className="grid grid-cols-2 gap-5 pt-2 max-lg:grid-cols-1">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function SingleNumber({
  value,
  description,
  className,
  tooltip,
}: {
  value: string
  description: string
  className?: string
  tooltip?:
    | string
    | {
        explanation?: string
        formula?: string
      }
}) {
  return (
    <Card className={cn("relative content-center px-2 py-8", className)}>
      {tooltip && (
        <SimpleTooltip tooltip={tooltip}>
          <div className="absolute right-2 top-2">
            <Info className="h-4 w-4 text-[#DDDDDD]" />
          </div>
        </SimpleTooltip>
      )}
      <CardHeader className="place-items-center">
        <CardTitle className="flex gap-1 text-center text-2xl max-xl:lg:text-lg">
          {value}
        </CardTitle>
        <CardDescription className="text-center text-base max-xl:lg:text-sm">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
