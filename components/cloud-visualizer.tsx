"use client"

import { useEffect, useState } from "react"
import { formatNumber } from "@/lib/utils"

import { useConfig } from "./config-provider"

interface Node {
  x: number
  y: number
  z: number
  id: number
}

const round = (num: number) => Number(num.toFixed(4))

const generateNodes = (
  count: number,
  radius: number,
  yOffset: number,
  scale = 0.3,
): Node[] => {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI
    return {
      x: round(CENTER_X + radius * Math.cos(angle)),
      y: round(CENTER_Y + yOffset + radius * Math.sin(angle) * scale),
      z: round(radius * Math.sin(angle)),
      id: i,
    }
  })
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800
const NODE_SIZE = 12
const CENTER_X = CANVAS_WIDTH / 2
const CENTER_Y = CANVAS_HEIGHT / 2

export function CloudVisualizer() {
  const config = useConfig()

  // const nodeCount = Math.max(
  //   1,
  //   Math.min(Math.round(10 * Math.log(config.numberOfXnodes)), 150),
  // )
  const nodeCount = Math.min(config.numberOfXnodes, 100)
  const allocation = config.xnodeAllocationPercentage

  const ringThickness = round(20 + (nodeCount * allocation) / 100)

  const baseRadius = 300
  const xNodes = generateNodes(nodeCount, baseRadius, 50)
  const vmNodes = generateNodes(
    Math.floor(nodeCount * 0.6),
    baseRadius * 0.75,
    -50,
  )

  const [viewBox, setViewBox] = useState(
    `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT - 200}`,
  )

  useEffect(() => {
    const handleResize = () => {
      setViewBox(
        window.innerWidth < 768
          ? `200 0 800 600`
          : `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT - 200}`,
      )
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-white px-0">
      <svg
        width="100%"
        height="100%"
        className="max-h-full w-full"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="resourceGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="33%" stopColor="#22c55e" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Connection lines */}
        <g>
          {xNodes.map((xNode, i) =>
            vmNodes.map((vm, j) => {
              if ((i + j) % 3 === 0) {
                const opacity = round((xNode.z + vm.z) / (baseRadius * 4) + 0.1)
                return (
                  <line
                    key={`connection-${i}-${j}`}
                    x1={round(xNode.x)}
                    y1={round(xNode.y)}
                    x2={round(vm.x)}
                    y2={round(vm.y)}
                    stroke="#3b82f6"
                    strokeWidth={0.5}
                    opacity={opacity}
                  />
                )
              }
              return null
            }),
          )}
        </g>

        {/* Resource ring */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y + 20}
          r={round(baseRadius * 0.75)}
          fill="none"
          strokeWidth={ringThickness}
          stroke="url(#resourceGradient)"
          transform={`scale(1, 0.3)`}
          className="opacity-90"
        />

        {/* VM nodes */}
        {vmNodes.map((node) => (
          <rect
            key={`vm-${node.id}`}
            x={round(node.x - NODE_SIZE / 2)}
            y={round(node.y - NODE_SIZE / 2)}
            width={NODE_SIZE}
            height={NODE_SIZE}
            className="fill-blue-400"
            style={{
              opacity: round((node.z + baseRadius) / (baseRadius * 2)),
            }}
          />
        ))}

        {/* XNodes */}
        {xNodes.map((node) => (
          <rect
            key={`xnode-${node.id}`}
            x={round(node.x - NODE_SIZE / 2)}
            y={round(node.y - NODE_SIZE / 2)}
            width={NODE_SIZE}
            height={NODE_SIZE}
            className="fill-blue-600"
            style={{
              opacity: round((node.z + baseRadius) / (baseRadius * 2)),
            }}
          />
        ))}

        {/* Desktop Labels with pointer lines */}
        <g className="hidden md:block">
          <g className="label-group">
            <line
              x1={CENTER_X + baseRadius * 0.75}
              y1={CENTER_Y - 290}
              x2={CENTER_X + baseRadius * 1.1}
              y2={CENTER_Y - 340}
              stroke="#666666"
              strokeWidth={1}
            />
            <text
              x={CENTER_X + baseRadius * 1.1}
              y={CENTER_Y - 350}
              className="fill-gray-600 text-sm"
              textAnchor="start"
            >
              Openmesh Cloud
              <tspan
                x={CENTER_X + baseRadius * 1.1}
                y={CENTER_Y - 330}
                className="fill-gray-500 text-xs"
              >
                {`${formatNumber(allocation, "ratio")}% Resources Allocated`}
              </tspan>
            </text>
          </g>

          <g className="label-group">
            <line
              x1={CENTER_X - baseRadius * 0.75}
              y1={CENTER_Y - 30}
              x2={CENTER_X - baseRadius * 1.1}
              y2={CENTER_Y - 50}
              stroke="#666666"
              strokeWidth={1}
            />
            <text
              x={CENTER_X - baseRadius * 1.1}
              y={CENTER_Y - 60}
              className="fill-gray-600 text-sm"
              textAnchor="end"
            >
              Virtual Machine Layer
              <tspan
                x={CENTER_X - baseRadius * 1.1}
                y={CENTER_Y - 40}
                className="fill-gray-500 text-xs"
              >
                {`${formatNumber(Math.floor(config.numberOfXnodes * 0.6))} VMs`}
              </tspan>
            </text>
          </g>

          <g className="label-group">
            <line
              x1={CENTER_X + baseRadius}
              y1={CENTER_Y + 50}
              x2={CENTER_X + baseRadius * 1.2}
              y2={CENTER_Y + 80}
              stroke="#666666"
              strokeWidth={1}
            />
            <text
              x={CENTER_X + baseRadius * 1.2}
              y={CENTER_Y + 70}
              className="fill-gray-600 text-sm"
              textAnchor="start"
            >
              XNode Infrastructure
              <tspan
                x={CENTER_X + baseRadius * 1.2}
                y={CENTER_Y + 90}
                className="fill-gray-500 text-xs"
              >
                {`${formatNumber(config.numberOfXnodes)} Nodes`}
              </tspan>
            </text>
          </g>
        </g>

        {/* Mobile Labels - Centered without pointer lines */}
        <g className="md:hidden">
          <text
            x={CENTER_X}
            y={CENTER_Y - 280}
            className="fill-gray-600 text-sm"
            textAnchor="middle"
          >
            Openmesh Cloud
            <tspan x={CENTER_X} dy="20" className="fill-gray-500 text-xs">
              {`${formatNumber(allocation, "ratio")}% Resources Allocated`}
            </tspan>
          </text>

          <text
            x={CENTER_X}
            y={CENTER_Y - 50}
            className="fill-gray-600 text-sm"
            textAnchor="middle"
          >
            Virtual Machine Layer
            <tspan x={CENTER_X} dy="20" className="fill-gray-500 text-xs">
              {`${formatNumber(Math.floor(config.numberOfXnodes * 0.6))} VMs`}
            </tspan>
          </text>

          <text
            x={CENTER_X}
            y={CENTER_Y + 70}
            className="fill-gray-600 text-sm"
            textAnchor="middle"
          >
            XNode Infrastructure
            <tspan x={CENTER_X} dy="20" className="fill-gray-500 text-xs">
              {`${formatNumber(config.numberOfXnodes)} Nodes`}
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  )
}
