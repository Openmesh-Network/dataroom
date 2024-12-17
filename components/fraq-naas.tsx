"use client"

import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatNumber } from "@/lib/utils"

import { useConfig, XnodeSize } from "./config-provider"

interface TableItem {
  logo: (className: string) => React.ReactNode
  name: string
  tokenPrice: number
  marketcap: number
  averageReward: number
  ticker: string
}

export function FractionalizeNaas() {
  const config = useConfig()

  const providers: TableItem[] = new Array(10).fill({
    logo: (className) => (
      <Image
        src="/icon.png"
        alt="Openmesh Logo"
        className={className}
        width={40}
        height={40}
      />
    ),
    name: "Openmesh",
    tokenPrice: 7.11,
    marketcap: 121_000_000,
    averageReward: 26,
    ticker: "OPEN",
  } as TableItem)

  return (
    <div>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <CustomTableHead className="text-primary">Provider</CustomTableHead>
            <CustomTableHead>Token Price</CustomTableHead>
            <CustomTableHead className="max-md:hidden">
              Marketcap
            </CustomTableHead>
            <CustomTableHead className="max-md:hidden">
              Reward Ratio
            </CustomTableHead>
            <CustomTableHead className="max-md:hidden">
              Est. reward
            </CustomTableHead>
            <CustomTableHead className="max-md:hidden">Cost</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Net 24h</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Net 7D</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Net 30D</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Net 1Y</CustomTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider, i) => (
            <TableRow key={i}>
              <CustomTableCell className="flex place-items-center gap-4">
                {provider.logo("size-8")}
                <span className="font-semibold">{provider.name}</span>
              </CustomTableCell>
              <CustomTableCell>
                <span>${provider.tokenPrice}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>${formatNumber(provider.marketcap)}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>110.52%</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>
                  {provider.averageReward} {provider.ticker}
                </span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>~18m</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>$0.13</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>$34.43</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>$34.43</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>$34.43</span>
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function CustomTableHead({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <TableHead
      className={cn(
        "place-items-center py-8 text-center font-semibold",
        className,
      )}
    >
      {children}
    </TableHead>
  )
}

function CustomTableCell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <TableCell className={cn("place-content-center text-center", className)}>
      {children}
    </TableCell>
  )
}
