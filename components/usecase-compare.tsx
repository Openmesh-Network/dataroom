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
import { cn } from "@/lib/utils"

import { useConfig, XnodeSize } from "./config-provider"
import { Button } from "./ui/button"

interface TableItem {
  logo: (className: string) => React.ReactNode
  name: string
  cost: (specs: XnodeSize) => number
  setupTime: string
  kycRequired: "Required"
  paymentAccepted: "Fiat only"
  type: "Centralized" | "Decentralized"
  access: "Permission"
}

export function UsecaseCompare() {
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
    name: "Xnode One",
    cost: (specs) => 7.11,
    setupTime: "~18m",
    kycRequired: "Required",
    paymentAccepted: "Fiat only",
    type: "Centralized",
    access: "Permission",
  } as TableItem)

  return (
    <div className="flex flex-col gap-8">
      <div className="ml-4 flex flex-wrap gap-5">
        <TimeSelectButton label="H" selected={true} />
        <TimeSelectButton label="D" selected={false} />
        <TimeSelectButton label="M" selected={false} />
        <TimeSelectButton label="Y" selected={false} />
      </div>
      <Table className="rounded-md border bg-white">
        <TableHeader>
          <TableRow>
            <CustomTableHead className="text-primary">Provider</CustomTableHead>
            <CustomTableHead>Cost</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Savings</CustomTableHead>
            <CustomTableHead className="max-md:hidden">
              Savings%
            </CustomTableHead>
            <CustomTableHead className="max-md:hidden">
              Setup time
            </CustomTableHead>
            <CustomTableHead className="max-md:hidden">KYC</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Paid in</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Type</CustomTableHead>
            <CustomTableHead className="max-md:hidden">Access</CustomTableHead>
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
                <span>${provider.cost(config.selectedUseCase)}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>-${provider.cost(config.selectedUseCase)}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>110.52%</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>{provider.setupTime}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>{provider.kycRequired}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>{provider.paymentAccepted}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>{provider.type}</span>
              </CustomTableCell>
              <CustomTableCell className="max-md:hidden">
                <span>{provider.access}</span>
              </CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TimeSelectButton({
  label,
  selected,
}: {
  label: string
  selected: boolean
}) {
  return (
    <Button
      variant="outline"
      className={cn(
        "px-10",
        selected && "border-2 border-primary font-semibold text-primary",
      )}
    >
      {label}
    </Button>
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
