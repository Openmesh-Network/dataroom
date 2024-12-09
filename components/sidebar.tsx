"use client"

import { AdvancedConfig } from "./advanced-config"
import { ComboSlider, ComboSliderOption } from "./combo-slider"
import { useConfig, useSetConfig } from "./config-provider"
import { NumericInput } from "./numeric-input"
import { NumericSlider } from "./numeric-slider"
import { Combobox } from "./ui/combobox"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

interface XnodeSize {
  cpu: number
  memory: number
  storage: number
  bandwidth: number
}

export default function Sidebar() {
  const config = useConfig()
  const setConfig = useSetConfig()

  const xnodeSizes: ComboSliderOption<XnodeSize>[] = [
    {
      label: "Small",
      value: {
        cpu: 2,
        memory: 4,
        storage: 80,
        bandwidth: 10,
      },
    },
    {
      label: "Medium",
      value: {
        cpu: 4,
        memory: 8,
        storage: 160,
        bandwidth: 100,
      },
    },
    {
      label: "Large",
      value: {
        cpu: 8,
        memory: 16,
        storage: 320,
        bandwidth: 1000,
      },
    },
    {
      label: "X-Large",
      value: {
        cpu: 12,
        memory: 24,
        storage: 640,
        bandwidth: 10_000,
      },
    },
  ]

  return (
    <aside className="sticky top-0 h-screen min-w-[350px] py-12 pt-5 max-md:relative max-md:h-auto">
      <nav className="grid items-start gap-3 px-3 font-medium">
        <Category title="Network Configuration">
          <NumericSlider
            title="Number of Xnodes"
            value={config.numberOfXnodes}
            onChange={(v) => setConfig({ ...config, numberOfXnodes: v })}
            intervals={[10, 100, 1000, 10_000, 100_000]}
          />
          <Separator />
          <ComboSlider
            title="Avg. Xnode Size"
            value={{
              cpu: config.xnodeSize.cpu,
              memory: config.xnodeSize.memory,
              storage: config.xnodeSize.storage,
              bandwidth: config.xnodeSize.bandwidth,
            }}
            onChange={(v) => {
              setConfig({
                ...config,
                xnodeSize: {
                  ...config.xnodeSize,
                  ...v,
                },
              })
            }}
            options={xnodeSizes}
          />
          <Separator />
          <NumericSlider
            title="Avg. Xnode Allocation"
            value={config.xnodeAllocationPercentage}
            onChange={(v) =>
              setConfig({
                ...config,
                xnodeAllocationPercentage: v,
              })
            }
            intervals={[0, 25, 50, 75, 100]}
            postfix="%"
          />
        </Category>
        <Category title="Token Configuration">
          <div className="flex place-items-center">
            <Label className="grow" htmlFor="currency">
              Currency
            </Label>
            <Combobox
              id="currency"
              className="h-auto w-28 px-3 py-0.5"
              options={[{ label: "USD", value: "USD" }]}
              value="USD"
              onChange={() => {}}
            />
          </div>
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
          <Separator />
          <NumericInput
            title="Marketcap"
            value={config.cost.open * config.blockchain.tokenSupply.circulating}
            onChange={(v) =>
              setConfig({
                ...config,
                blockchain: {
                  ...config.blockchain,
                  tokenSupply: {
                    ...config.blockchain.tokenSupply,
                    circulating: v / config.cost.open,
                  },
                },
              })
            }
          />
          <Separator />
          <NumericInput
            title="PoS Requirement"
            value={config.blockchain.requirement.proofOfStake}
            onChange={(v) =>
              setConfig({
                ...config,
                blockchain: {
                  ...config.blockchain,
                  requirement: {
                    ...config.blockchain.requirement,
                    proofOfStake: v,
                  },
                },
              })
            }
          />
          <Separator />
          <NumericInput
            title="PoR Requirement"
            value={config.blockchain.requirement.proofOfResource}
            onChange={(v) =>
              setConfig({
                ...config,
                blockchain: {
                  ...config.blockchain,
                  requirement: {
                    ...config.blockchain.requirement,
                    proofOfResource: v,
                  },
                },
              })
            }
          />
          <Separator />
          <NumericInput
            title="Electricity Cost (1 kWh)"
            value={config.cost.electricity}
            onChange={(v) =>
              setConfig({
                ...config,
                cost: { ...config.cost, electricity: v },
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
