import { cn, formatNumber } from "@/lib/utils"

import { useConfig } from "./config-provider"

export function CloudCabal() {
  const config = useConfig()

  const providers = [
    {
      xAxis: "Openmesh",
      color: "bg-blue-500",
      data: {
        value: config.numberOfXnodes * config.xnodeSize.storage,
      },
    },
    {
      xAxis: "AWS",
      color: "bg-green-500",
      data: {
        value: 70_000_000,
      },
    },
    {
      xAxis: "GCP",
      color: "bg-yellow-500",
      data: {
        value: 30_000_000,
      },
    },
    {
      xAxis: "Azure",
      color: "bg-orange-500",
      data: {
        value: 50_000_000,
      },
    },
  ]
  const max = Math.max(...providers.map((p) => p.data.value))

  return (
    <div className="flex h-full w-full flex-col rounded-md border bg-white">
      <span className="pt-4 text-center text-xl font-semibold tracking-tighter">
        Kill the Cloud Cabal
      </span>
      <div className="grow place-content-center">
        <div className="grid grid-cols-4 gap-2">
          {providers.map((provider, i) => (
            <div
              key={i}
              className="w-full place-content-center place-items-center"
            >
              <div
                className={cn(
                  "rounded-full border border-black",
                  provider.color,
                )}
                style={{
                  width: (100 * provider.data.value) / max,
                  height: (100 * provider.data.value) / max,
                }}
              />
            </div>
          ))}
          {providers.map((provider, i) => (
            <div
              key={i}
              className="flex flex-col place-content-center place-items-center"
            >
              <span className="text-xl">
                {formatNumber(provider.data.value, "GB")}
              </span>
              <span>{provider.xAxis}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
