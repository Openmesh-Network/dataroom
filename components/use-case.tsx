import { formatNumber } from "@/lib/utils"

import { useConfig } from "./config-provider"

export interface UseCaseParams {
  title: string
  icon: (className: string) => JSX.Element
  cpu: number
  memory: number
  storage: number
}

export function UseCase({ title, icon, cpu, memory, storage }: UseCaseParams) {
  const config = useConfig()

  const instances =
    Math.min(
      config.xnodeSize.cpu / cpu,
      config.xnodeSize.memory / memory,
      config.xnodeSize.storage / storage,
    ) *
    config.numberOfXnodes *
    (config.xnodeAllocationPercentage / 100)

  return (
    <div className="flex flex-col place-content-center place-items-center gap-1">
      <div className="flex place-items-center gap-1">
        {icon("size-4")}
        <span className="text-2xl font-semibold max-xl:lg:text-base">
          {formatNumber(instances)}
        </span>
      </div>
      <span className="text-center text-base max-xl:lg:text-xs">{title}</span>
    </div>
  )
}
