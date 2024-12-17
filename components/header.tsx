"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

import { ConfigContextData, useConfig, useSetConfig } from "./config-provider"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

const items: {
  page: ConfigContextData["page"]
  title: string
  disabled: boolean
}[] = [
  {
    page: "stats",
    title: "Network Utility",
    disabled: false,
  },
  {
    page: "compare",
    title: "Openmesh vs Others",
    disabled: false,
  },
  {
    page: "fraq-naas",
    title: "Fractionlize NaaS",
    disabled: false,
  },
  // {
  //   page: "viability",
  //   title: "Economic Viability",
  //   disabled: true,
  // },
  // {
  //   page: "cost",
  //   title: "Cost Calculator",
  //   disabled: true,
  // },
  // {
  //   page: "network",
  //   title: "Network Resources",
  //   disabled: true,
  // },
]

export function Header() {
  const config = useConfig()
  const setConfig = useSetConfig()

  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <div className="flex h-20 place-items-center gap-6 border-b-2 md:gap-10">
      <Link href="/" className="ml-5 flex items-center space-x-2">
        <Image alt="Logo" src="/icon.svg" width={40} height={40} />
        <span className="inline-block text-2xl font-bold">Openmesh</span>
      </Link>
      <div className="min-w-5 grow" />
      <nav className="flex gap-6 max-md:hidden">
        {items.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => setConfig({ ...config, page: item.page })}
            className={cn(
              "rounded-none px-6 py-2",
              item.disabled && "cursor-not-allowed opacity-80",
              config.page === item.page &&
                "border-b-2 border-blue-700 hover:border-blue-800",
            )}
          >
            <span
              className={cn(
                "flex items-center text-sm font-medium text-black hover:text-[#000000d0] dark:hover:text-[#ffffffdc]",
                config.page === item.page &&
                  "font-bold text-blue-700 hover:text-blue-800",
              )}
            >
              {item.title}
            </span>
          </Button>
        ))}
      </nav>
      <div className="w-20 min-w-2 shrink max-md:hidden" />

      <Popover open={navbarOpen} onOpenChange={setNavbarOpen}>
        <PopoverTrigger className="hidden max-md:block" asChild>
          <button id="navbarToggler" aria-label="Mobile Menu" className="pr-5">
            <span
              className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                navbarOpen ? "top-[7px] rotate-45" : " "
              }`}
            />
            <span
              className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                navbarOpen ? "opacity-0" : " "
              }`}
            />
            <span
              className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 ${
                navbarOpen ? "top-[-8px] -rotate-45" : " "
              }`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col place-items-end bg-white px-2 py-1">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => setConfig({ ...config, page: item.page })}
              className={cn(
                "rounded-none px-6 py-2",
                item.disabled && "cursor-not-allowed opacity-80",
                config.page === item.page &&
                  "border-b-2 border-blue-700 hover:border-blue-800",
              )}
            >
              <span
                className={cn(
                  "flex items-center text-sm font-medium text-black hover:text-[#000000d0] dark:hover:text-[#ffffffdc]",
                  config.page === item.page &&
                    "font-bold text-blue-700 hover:text-blue-800",
                )}
              >
                {item.title}
              </span>
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
