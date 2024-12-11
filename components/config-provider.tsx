"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@uidotdev/usehooks"

export interface XnodeSize {
  cpu: number
  memory: number
  storage: number
  bandwidth: number
  electricity: number
}

export type ConfigContextData = {
  nonce: number
  numberOfXnodes: number
  xnodeSize: XnodeSize
  xnodeSizeSlider: {
    small: XnodeSize
    medium: XnodeSize
    large: XnodeSize
    xLarge: XnodeSize
  }
  xnodeAllocationPercentage: number
  cost: {
    cpu: number
    memory: number
    storage: number
    bandwidth: number
    electricity: number
    open: number
    xnode: number
    web3Data: number
  }
  hardwareAmortization: number
  web3DataPercentage: number
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
    consensus: {
      faultTolerance: {
        halt: number
        takeover: number
      }
      finalizationTime: {
        base: number
        sqrtMultiplier: number
      }
    }
  }
  growth: {
    nodes: {
      jan: number
      feb: number
      mar: number
      apr: number
      may: number
      jun: number
      jul: number
      aug: number
      sep: number
      oct: number
      nov: number
      dec: number
    }
  }
}
const defaultConfigContextData: ConfigContextData = {
  nonce: 0,
  numberOfXnodes: 3000,
  xnodeSize: {
    cpu: 8, // cores
    memory: 16, // GB
    storage: 320, // GB
    bandwidth: 1000, // GB
    electricity: 30, // W
  },
  xnodeSizeSlider: {
    small: {
      cpu: 2,
      memory: 4,
      storage: 80,
      bandwidth: 10,
      electricity: 30,
    },
    medium: {
      cpu: 4,
      memory: 8,
      storage: 160,
      bandwidth: 100,
      electricity: 30,
    },
    large: {
      cpu: 8,
      memory: 16,
      storage: 320,
      bandwidth: 1000,
      electricity: 30,
    },
    xLarge: {
      cpu: 12,
      memory: 24,
      storage: 640,
      bandwidth: 10_000,
      electricity: 30,
    },
  },
  xnodeAllocationPercentage: 15, // %
  cost: {
    cpu: 20, // USD per core per month
    memory: 10, // USD per gb per month
    storage: 0.25, // USD per gb per month
    bandwidth: 0.1, // USD per gb
    electricity: 0.13, // USD per kWh
    open: 0.21, // USD
    xnode: 1500, // USD
    web3Data: 304.95, // USD per tb
  },
  hardwareAmortization: 12, // months
  web3DataPercentage: 10, // %
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
    consensus: {
      faultTolerance: {
        halt: 33, // %
        takeover: 66, //%
      },
      finalizationTime: {
        base: 1, // seconds
        sqrtMultiplier: 0.15, // factor
      },
    },
  },
  growth: {
    nodes: {
      jan: 3000,
      feb: 800,
      mar: 1200,
      apr: 500,
      may: 25,
      jun: 600,
      jul: 50,
      aug: 200,
      sep: 40,
      oct: 500,
      nov: 100,
      dec: 200,
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
        setConfig({ ...config, ...decodedConfig })
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
