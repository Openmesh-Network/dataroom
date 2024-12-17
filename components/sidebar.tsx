"use client"

import { AdvancedConfig } from "./advanced-config"
import { ComboSlider } from "./combo-slider"
import { useConfig, useSetConfig } from "./config-provider"
import { NumericInput } from "./numeric-input"
import { NumericSlider } from "./numeric-slider"
import { Combobox } from "./ui/combobox"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"

export default function Sidebar() {
  const config = useConfig()
  const setConfig = useSetConfig()

  return (
    <aside className="sticky top-0 h-screen min-w-[350px] py-12 pt-5 max-md:relative max-md:h-auto">
      {config.page === "stats" && (
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
              value={config.xnodeSize}
              onChange={(v) => {
                setConfig({
                  ...config,
                  xnodeSize: v,
                })
              }}
              options={[
                {
                  label: "Small",
                  value: config.xnodeSizeSlider.small,
                },
                {
                  label: "Medium",
                  value: config.xnodeSizeSlider.medium,
                },
                {
                  label: "Large",
                  value: config.xnodeSizeSlider.large,
                },
                {
                  label: "X-Large",
                  value: config.xnodeSizeSlider.xLarge,
                },
              ]}
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
              value={
                config.cost.open * config.blockchain.tokenSupply.circulating
              }
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
      )}
      {config.page === "compare" && (
        <nav className="grid items-start gap-3 px-3 font-medium">
          <Category>
            <span>Select your use case</span>
          </Category>
          <Category>
            <NumericInput
              title="Compute (cores)"
              value={config.selectedUseCase.cpu}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    cpu: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Memory (GB)"
              value={config.selectedUseCase.memory}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    memory: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Storage (GB)"
              value={config.selectedUseCase.storage}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    storage: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Bandwidth (GB)"
              value={config.selectedUseCase.bandwidth}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    storage: v,
                  },
                })
              }
            />
          </Category>
          <Category>
            <AdvancedConfig />
          </Category>
        </nav>
      )}
      {config.page === "fraq-naas" && (
        <nav className="grid items-start gap-3 px-3 font-medium">
          <Combobox
            className="w-full"
            options={[{ label: "Xnode DVM", value: "Xnode DVM" }]}
            value="Xnode DVM"
            onChange={() => {}}
          />
          <Category>
            <NumericInput
              title="Compute (cores)"
              value={config.selectedUseCase.cpu}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    cpu: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Memory (GB)"
              value={config.selectedUseCase.memory}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    memory: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Storage (GB)"
              value={config.selectedUseCase.storage}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    storage: v,
                  },
                })
              }
            />
            <Separator />
            <NumericInput
              title="Bandwidth (GB)"
              value={config.selectedUseCase.bandwidth}
              onChange={(v) =>
                setConfig({
                  ...config,
                  selectedUseCase: {
                    ...config.selectedUseCase,
                    storage: v,
                  },
                })
              }
            />
          </Category>
          <Category>
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
      )}
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
