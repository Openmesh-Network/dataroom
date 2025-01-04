"use client"

import React from 'react'
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import html2canvas from 'html2canvas'

interface SaveChartProps {
  chartRef: React.RefObject<HTMLDivElement>
  title?: string
}

export function SaveChart({ chartRef, title = 'chart' }: SaveChartProps) {
    const downloadChart = async () => {
        const container = chartRef.current
        if (!container) return
    
        // Set up temporary container for export
        const exportContainer = document.createElement('div')
        exportContainer.style.position = 'absolute'
        exportContainer.style.left = '-9999px'
        exportContainer.style.backgroundColor = 'white'
        exportContainer.style.width = '1000px'
        document.body.appendChild(exportContainer)

        // Clone the chart content
        const contentClone = container.cloneNode(true) as HTMLElement
        exportContainer.appendChild(contentClone)

        // Configure the chart SVG for export to PNG
        const svg = contentClone.querySelector('svg')
        if (!svg) {
          document.body.removeChild(exportContainer)
          return
        }

        // Set export dimensions
        svg.setAttribute('width', '1000')
        svg.setAttribute('height', '600')
        
        // Add chart title
        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        titleText.setAttribute('x', '20')
        titleText.setAttribute('y', '30')
        titleText.setAttribute('font-family', 'Arial')
        titleText.setAttribute('font-size', '12')
        titleText.textContent = title
        svg.appendChild(titleText)

        // Configure font styles for chart elements
        contentClone.querySelectorAll('.recharts-text').forEach(text => {
            if (text instanceof SVGElement) {
                text.style.fontSize = '10px'
                text.style.fontFamily = 'Arial'
            }
        })

        // Generate filename
        const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.png`

        try {
            // Convert to PNG using html2canvas
            const canvas = await html2canvas(contentClone, {
                backgroundColor: 'white',
                scale: 2,
                useCORS: true,
                logging: false,
                width: 1000,
                height: 600,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.body.firstChild as HTMLElement
                    if (clonedElement) {
                        clonedElement.style.width = '1000px'
                        clonedElement.style.height = '600px'
                        // Ensure legend text is Arial and smaller
                        clonedElement.querySelectorAll('.recharts-legend-item-text').forEach(item => {
                            if (item instanceof HTMLElement) {
                                item.style.fontFamily = 'Arial'
                                item.style.fontSize = '10px'
                            }
                        })
                    }
                }
            })

            // Trigger PNG download
            const link = document.createElement('a')
            link.download = filename
            link.href = canvas.toDataURL('image/png')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Error generating PNG:', error)
        } finally {
            document.body.removeChild(exportContainer)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={downloadChart}
        >
            <Download className="h-4 w-4 text-muted-foreground" />
        </Button>
    )
}

export default SaveChart