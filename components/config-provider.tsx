"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@uidotdev/usehooks"

export type ConfigContextData = {
  nonce: number
  numberOfXnodes: number
  xnodeSize: {
    cpu: number
    memory: number
    storage: number
    bandwidth: number
    electricity: number
  }
  xnodeAllocation: number
  cost: {
    cpu: number
    memory: number
    storage: number
    bandwidth: number
    electricity: number
    open: number
    xnode: number
  }
  hardwareAmortization: number
  blockchain: {
    requirement: {
      proofOfStake: number
      proofOfResource: number
    }
    rewards: {
      validatorPercentage: number
      earlyValidatorBonus: number
    }
    tokenSupply: {
      circulating: number
      total: number
    }
  }
}
const defaultConfigContextData: ConfigContextData = {
  nonce: 0,
  numberOfXnodes: 30_000,
  xnodeSize: {
    cpu: 8, // cores
    memory: 16, // GB
    storage: 320, // GB
    bandwidth: 1000, // GB
    electricity: 30, // W
  },
  xnodeAllocation: 15, // %
  cost: {
    cpu: 132.0251, // USD per core per month
    memory: 43.9311, // USD per gb per month
    storage: 0.04, // USD per gb per month
    bandwidth: 0.09, // USD per gb
    electricity: 0.13, // USD per kWh
    open: 0.21, // USD
    xnode: 1500, // USD
  },
  hardwareAmortization: 12, // months
  blockchain: {
    requirement: {
      proofOfStake: 10_000, // OPEN
      proofOfResource: 15_000, // OPEN
    },
    rewards: {
      validatorPercentage: 20, // %
      earlyValidatorBonus: 2, // %
    },
    tokenSupply: {
      circulating: 30_000_000, // OPEN
      total: 1_000_000_000, // OPEN
    },
  },
}
const configContext = createContext<ConfigContextData>(defaultConfigContextData)
const SetConfigContext = createContext<(config: ConfigContextData) => void>(
  () => {},
)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigContextData>(
    defaultConfigContextData,
  )
  const debouncedConfig = useDebounce(config, 1000)
  const params = useSearchParams()
  const { replace } = useRouter()

  useEffect(() => {
    const paramsConfig = params.get("config")
    if (paramsConfig) {
      const decodedConfig = JSON.parse(
        Buffer.from(paramsConfig, "base64").toString(),
      ) as ConfigContextData
      if (decodedConfig.nonce > config.nonce) {
        console.log("Config loaded from url", decodedConfig)
        setConfig(decodedConfig)
        return
      }
    }

    if (config.nonce === debouncedConfig.nonce && config.nonce > 0) {
      const encodedConfig = Buffer.from(JSON.stringify(config)).toString(
        "base64",
      )
      if (paramsConfig !== encodedConfig) {
        console.log("Config pushed to url", config)
        replace(
          `${window.location.href.split("?")[0]}?config=${encodedConfig}`,
          {
            scroll: false,
          },
        )
      }
    }
  }, [config, params, replace, debouncedConfig])

  return (
    <configContext.Provider value={config}>
      <SetConfigContext.Provider
        value={(config) => setConfig({ ...config, nonce: config.nonce + 1 })}
      >
        {children}
      </SetConfigContext.Provider>
    </configContext.Provider>
  )
}

export function useConfig() {
  return useContext(configContext)
}

export function useSetConfig() {
  const setConfig = useContext(SetConfigContext)
  return setConfig
}
