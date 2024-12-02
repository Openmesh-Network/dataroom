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
  }
  xnodeAllocation: number
}
const defaultConfigContextData: ConfigContextData = {
  nonce: 0,
  numberOfXnodes: 30_000,
  xnodeSize: {
    cpu: 8,
    memory: 16,
    storage: 320,
  },
  xnodeAllocation: 15,
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
