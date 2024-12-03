"use client"

import { AdvancedConfig } from "./advanced-config"
import { useConfig, useSetConfig } from "./config-provider"
import { NumericInput } from "./numeric-input"
import { NumericSlider } from "./numeric-slider"
import { Separator } from "./ui/separator"

export default function Sidebar() {
  const config = useConfig()
  const setConfig = useSetConfig()
  return (
    <aside className="sticky top-0 h-screen min-w-[350px] py-12 pt-5">
      <nav className="grid items-start gap-3 px-3 font-medium">
        <Category title="Network Configuration">
          <NumericSlider
            title="Number of Xnodes"
            value={config.numberOfXnodes}
            onChange={(v) => setConfig({ ...config, numberOfXnodes: v })}
            intervals={[10, 100, 1000, 10_000, 100_000]}
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Cores"
            value={config.xnodeSize.cpu}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeSize: { ...config.xnodeSize, cpu: v },
              })
            }
            intervals={[1, 2, 4, 8, 16]}
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Memory"
            value={config.xnodeSize.memory}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeSize: { ...config.xnodeSize, memory: v },
              })
            }
            intervals={[2, 4, 8, 16, 32]}
            postfix="GB"
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Storage"
            value={config.xnodeSize.storage}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeSize: { ...config.xnodeSize, storage: v },
              })
            }
            intervals={[128, 512, 1024, 2048, 4098]}
            postfix="GB"
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Bandwidth"
            value={config.xnodeSize.bandwidth}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeSize: { ...config.xnodeSize, bandwidth: v },
              })
            }
            intervals={[100, 1000, 10_000]}
            postfix="GB"
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Allocation"
            value={config.xnodeAllocation}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeAllocation: v,
              })
            }
            intervals={[0, 25, 50, 75, 100]}
            postfix="%"
          />
        </Category>
        <Category title="Cost Configuration (USD)">
          <NumericInput
            title="1 core (monthly)"
            value={config.cost.cpu}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, cpu: v },
              })
            }
          />
          <Separator />
          <NumericInput
            title="1GB memory (monthly)"
            value={config.cost.memory}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, memory: v },
              })
            }
          />
          <Separator />
          <NumericInput
            title="1GB storage (monthly)"
            value={config.cost.storage}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, storage: v },
              })
            }
          />
          <Separator />
          <NumericInput
            title="1GB bandwidth"
            value={config.cost.bandwidth}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, bandwidth: v },
              })
            }
          />
          <Separator />
          <NumericInput
            title="1 kWh"
            value={config.cost.electricity}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, electricity: v },
              })
            }
          />
          <Separator />
          <NumericInput
            title="1 OPEN"
            value={config.cost.open}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, open: v },
              })
            }
          />
        </Category>
        <Category>
          <AdvancedConfig />
        </Category>
      </nav>
    </aside>
  )
}

function Category({
  title,
  children,
}: {
  title?: string
  children: JSX.Element[] | JSX.Element
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border bg-white p-2">
      {title && (
        <>
          <span className="pl-1 text-lg">{title}</span>
          <Separator />
        </>
      )}
      {children}
    </div>
  )
}
