import { useState } from "react"

import { useConfig, useSetConfig, XnodeSize } from "./config-provider"
import { NumericInput } from "./numeric-input"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"

export function AdvancedConfig() {
  const [open, setOpen] = useState<boolean>(false)
  const config = useConfig()
  const setConfig = useSetConfig()

  return (
    <>
      <Button onClick={() => setOpen(true)} className="text-white">
        Advanced Configuration
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Configuration</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="mx-3 flex flex-col gap-2 py-1">
              <NumericInput
                title="Number of Xnodes"
                value={config.numberOfXnodes}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    numberOfXnodes: v,
                  })
                }
              />
              <Separator />
              <XnodeSizeConfiguration
                prefix="Average"
                xnodeSize={config.xnodeSize}
                setXnodeSize={(xnodeSize) =>
                  setConfig({
                    ...config,
                    xnodeSize: xnodeSize,
                  })
                }
              />
              <Separator />
              <XnodeSizeConfiguration
                prefix="Small"
                xnodeSize={config.xnodeSizeSlider.small}
                setXnodeSize={(xnodeSize) =>
                  setConfig({
                    ...config,
                    xnodeSizeSlider: {
                      ...config.xnodeSizeSlider,
                      small: xnodeSize,
                    },
                  })
                }
              />
              <Separator />
              <XnodeSizeConfiguration
                prefix="Medium"
                xnodeSize={config.xnodeSizeSlider.medium}
                setXnodeSize={(xnodeSize) =>
                  setConfig({
                    ...config,
                    xnodeSizeSlider: {
                      ...config.xnodeSizeSlider,
                      medium: xnodeSize,
                    },
                  })
                }
              />
              <Separator />
              <XnodeSizeConfiguration
                prefix="Large"
                xnodeSize={config.xnodeSizeSlider.large}
                setXnodeSize={(xnodeSize) =>
                  setConfig({
                    ...config,
                    xnodeSizeSlider: {
                      ...config.xnodeSizeSlider,
                      large: xnodeSize,
                    },
                  })
                }
              />
              <Separator />
              <XnodeSizeConfiguration
                prefix="X-Large"
                xnodeSize={config.xnodeSizeSlider.xLarge}
                setXnodeSize={(xnodeSize) =>
                  setConfig({
                    ...config,
                    xnodeSizeSlider: {
                      ...config.xnodeSizeSlider,
                      xLarge: xnodeSize,
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Allocation Percentage"
                value={config.xnodeAllocationPercentage}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeAllocationPercentage: v,
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Cost of 1 core per month in USD"
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
                title="Cost of 1 GB of memory per month in USD"
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
                title="Cost of 1 GB of storage per month in USD"
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
                title="Cost of 1 GB of bandwidth in USD"
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
                title="Cost of 1 kWh in USD"
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
                title="Cost of 1 OPEN in USD"
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
                title="Cost of 1 TB of Web3 Data"
                value={config.cost.web3Data}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    cost: { ...config.cost, web3Data: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Hardware Amortization Months"
                value={config.hardwareAmortization}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    hardwareAmortization: v,
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Cloud Web3 Data Percentage"
                value={config.web3DataPercentage}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    web3DataPercentage: v,
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Proof of Stake requirement in OPEN"
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
                title="Proof of Resource requirement in OPEN"
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
                title="Validator Reward Percentage"
                value={config.blockchain.rewards.validatorPercentage}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      rewards: {
                        ...config.blockchain.rewards,
                        validatorPercentage: v,
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Early Validator Reward Bonus Percentage"
                value={config.blockchain.rewards.earlyValidatorBonus}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      rewards: {
                        ...config.blockchain.rewards,
                        earlyValidatorBonus: v,
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Circulation OPEN token supply"
                value={config.blockchain.tokenSupply.circulating}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      tokenSupply: {
                        ...config.blockchain.tokenSupply,
                        circulating: v,
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Total OPEN token supply"
                value={config.blockchain.tokenSupply.total}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      tokenSupply: {
                        ...config.blockchain.tokenSupply,
                        total: v,
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Consensus Halt Fault Tolerance Percentage"
                value={config.blockchain.consensus.faultTolerance.halt}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      consensus: {
                        ...config.blockchain.consensus,
                        faultTolerance: {
                          ...config.blockchain.consensus.faultTolerance,
                          halt: v,
                        },
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Consensus Takeover Fault Tolerance Percentage"
                value={config.blockchain.consensus.faultTolerance.takeover}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      consensus: {
                        ...config.blockchain.consensus,
                        faultTolerance: {
                          ...config.blockchain.consensus.faultTolerance,
                          takeover: v,
                        },
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Consensus Base Finalization Time"
                value={config.blockchain.consensus.finalizationTime.base}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      consensus: {
                        ...config.blockchain.consensus,
                        finalizationTime: {
                          ...config.blockchain.consensus.finalizationTime,
                          base: v,
                        },
                      },
                    },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Consensus Finalization Time Multiplier"
                value={
                  config.blockchain.consensus.finalizationTime.sqrtMultiplier
                }
                onChange={(v) =>
                  setConfig({
                    ...config,
                    blockchain: {
                      ...config.blockchain,
                      consensus: {
                        ...config.blockchain.consensus,
                        finalizationTime: {
                          ...config.blockchain.consensus.finalizationTime,
                          sqrtMultiplier: v,
                        },
                      },
                    },
                  })
                }
              />
              <Separator />
              <div className="flex flex-col gap-2">
                <span>Node Growth</span>
                <div className="ml-1 flex flex-col gap-1">
                  {[
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
                  ].map((month, i) => (
                    <NumericInput
                      key={i}
                      title={month}
                      value={
                        config.growth.nodes[
                          month.slice(0, 3).toLowerCase() as "jan"
                        ]
                      }
                      onChange={(v) =>
                        setConfig({
                          ...config,
                          growth: {
                            ...config.growth,
                            nodes: {
                              ...config.growth.nodes,
                              [month.slice(0, 3).toLowerCase() as "jan"]: v,
                            },
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

function XnodeSizeConfiguration({
  prefix,
  xnodeSize,
  setXnodeSize,
}: {
  prefix: string
  xnodeSize: XnodeSize
  setXnodeSize: (xnodeSize: XnodeSize) => void
}) {
  return (
    <>
      <NumericInput
        title={`${prefix} Xnode Core Count`}
        value={xnodeSize.cpu}
        onChange={(v) => setXnodeSize({ ...xnodeSize, cpu: v })}
      />
      <Separator />
      <NumericInput
        title={`${prefix} Xnode Memory in GB`}
        value={xnodeSize.memory}
        onChange={(v) => setXnodeSize({ ...xnodeSize, memory: v })}
      />
      <Separator />
      <NumericInput
        title={`${prefix} Xnode Storage in GB`}
        value={xnodeSize.storage}
        onChange={(v) => setXnodeSize({ ...xnodeSize, storage: v })}
      />
      <Separator />
      <NumericInput
        title={`${prefix} Xnode Bandwidth in GB`}
        value={xnodeSize.bandwidth}
        onChange={(v) => setXnodeSize({ ...xnodeSize, bandwidth: v })}
      />
      <Separator />
      <NumericInput
        title={`${prefix} Xnode Electricity usage in W`}
        value={xnodeSize.electricity}
        onChange={(v) => setXnodeSize({ ...xnodeSize, electricity: v })}
      />
    </>
  )
}
