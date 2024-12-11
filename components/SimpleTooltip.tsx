import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SimpleTooltip({
  children,
  tooltip,
}: {
  children: JSX.Element
  tooltip?: string | {
    explanation?: string
    formula?: string
  }
}) {
  if (!tooltip) {
    return children
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          {typeof tooltip === 'string' ? (
            <p>{tooltip}</p>
          ) : (
            <>
              {tooltip?.explanation && (
                <div>
                  <div className="font-medium">Explanation</div>
                  <div className="mt-1">{tooltip.explanation}</div>
                </div>
              )}
              {tooltip?.formula && (
                <div className="mt-2">
                  <div className="font-medium">Formula</div>
                  <div className="mt-1">{tooltip.formula}</div>
                </div>
              )}
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}