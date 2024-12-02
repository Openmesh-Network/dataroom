"use client"

import { useConfig, useSetConfig } from "./config-provider"
import { NumericSlider } from "./numeric-slider"

export default function Sidebar() {
  const config = useConfig()
  const setConfig = useSetConfig()
  return (
    <aside className="sticky top-0 h-screen min-w-[300px] border-r py-12 pt-5">
      <nav className="grid items-start gap-3 px-2 font-medium lg:px-4">
        <NumericSlider
          title="Number of Xnodes"
          value={config.numberOfXnodes}
          onChange={(v) => setConfig({ ...config, numberOfXnodes: v })}
          intervals={[10, 100, 1000, 10_000, 100_000]}
        />
        <NumericSlider
          title="Avg. Xnode Cores"
          value={config.xnodeSize.cpu}
          onChange={(v) =>
            setConfig({ ...config, xnodeSize: { ...config.xnodeSize, cpu: v } })
          }
          intervals={[1, 2, 4, 8, 16]}
        />
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
      </nav>
    </aside>
  )
}
