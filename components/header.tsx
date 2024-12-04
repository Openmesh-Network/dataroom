"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  {
    href: "/",
    title: "Network Utility",
    disabled: false,
  },
  {
    href: "/compare",
    title: "Openmesh vs Others",
    disabled: true,
  },
  {
    href: "/fraq-naas",
    title: "Fractionlize NaaS",
    disabled: true,
  },
  {
    href: "/viability",
    title: "Economic Viability",
    disabled: true,
  },
  {
    href: "/cost",
    title: "Cost Calculator",
    disabled: true,
  },
  {
    href: "/network",
    title: "Network Resources",
    disabled: true,
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <div className="flex h-20 place-items-center gap-6 border-b-2 md:gap-10">
      <Link href="/" className="ml-5 flex items-center space-x-2">
        <Image alt="Logo" src="/icon.svg" width={40} height={40} />
        <span className="inline-block text-2xl font-bold">Openmesh</span>
      </Link>
      <div className="min-w-5 grow" />
      <nav className="flex gap-6">
        {items.slice(0, 0).map((item, index) => (
          <Link
            key={index}
            href={item.disabled ? "#" : item.href}
            className={cn(
              "px-6 py-2",
              item.disabled && "cursor-not-allowed opacity-80",
              pathname === item.href.split("?")[0] &&
                "border-b-2 border-blue-700 hover:border-blue-800",
            )}
          >
            <span
              className={cn(
                "flex items-center text-sm font-medium text-black hover:text-[#000000d0] dark:hover:text-[#ffffffdc]",
                pathname === item.href.split("?")[0] &&
                  "font-bold text-blue-700 hover:text-blue-800",
              )}
            >
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
      <div className="w-20 min-w-2 shrink" />
    </div>
  )
}
