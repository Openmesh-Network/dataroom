"use client"

import { useConfig } from "./config-provider"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function NetworkStats() {
  const config = useConfig()

  return (
    <div className="flex flex-wrap">
      <SingleNumber
        description="Total Network Compute"
        value={`${Math.round(config.numberOfXnodes * config.xnodeSize.cpu * (config.xnodeAllocation / 100))} cores`}
      />
      <SingleNumber
        description="Total Network Memory"
        value={`${Math.round(config.numberOfXnodes * config.xnodeSize.memory * (config.xnodeAllocation / 100))} GB`}
      />
      <SingleNumber
        description="Total Network Storage"
        value={`${Math.round(config.numberOfXnodes * config.xnodeSize.storage * (config.xnodeAllocation / 100))} GB`}
      />
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
    <Card className="rounded-none px-10 py-10">
      <CardHeader className="place-items-center">
        <CardTitle className="text-3xl">{value}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
