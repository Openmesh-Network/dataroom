"use client"

import { useConfig } from "./config-provider"
import { FractionalizeNaas } from "./fraq-naas"
import { NetworkStats } from "./network-stats"
import { UsecaseCompare } from "./usecase-compare"

export default function PageContent() {
  const config = useConfig()

  switch (config.page) {
    case "stats":
      return <NetworkStats />
    case "compare":
      return <UsecaseCompare />
    case "fraq-naas":
      return <FractionalizeNaas />
    default:
      return <NetworkStats />
  }
}
