import { useMediaQuery } from "@uidotdev/usehooks"

export function useIsLgXlDevice() {
  const isLgXlDevice = useMediaQuery(
    "(min-width : 1024px) and (max-width : 1280px)",
  )

  return isLgXlDevice
}
