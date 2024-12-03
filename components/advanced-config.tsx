import { useState } from "react"

import { useConfig, useSetConfig } from "./config-provider"
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
      <Button onClick={() => setOpen(true)}>Advanced Configuration</Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Configuration</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="mx-3 flex flex-col gap-2">
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
              <NumericInput
                title="Average Xnode Core Count"
                value={config.xnodeSize.cpu}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeSize: { ...config.xnodeSize, cpu: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Memory in GB"
                value={config.xnodeSize.memory}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeSize: { ...config.xnodeSize, memory: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Storage in GB"
                value={config.xnodeSize.storage}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeSize: { ...config.xnodeSize, storage: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Bandwidth in GB"
                value={config.xnodeSize.bandwidth}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeSize: { ...config.xnodeSize, bandwidth: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Electricity usage in W"
                value={config.xnodeSize.electricity}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeSize: { ...config.xnodeSize, electricity: v },
                  })
                }
              />
              <Separator />
              <NumericInput
                title="Average Xnode Allocation Percentage"
                value={config.xnodeAllocation}
                onChange={(v) =>
                  setConfig({
                    ...config,
                    xnodeAllocation: v,
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
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
