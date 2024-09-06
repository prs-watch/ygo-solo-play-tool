import * as React from 'react'

type ScrollProps = {
  isVertical: boolean
  children: React.ReactNode
}

/**
 * スクロールコンポーネント.
 * 
 * @param isVertical - スクロール方向. デフォルトは縦方向
 * @param children - 入れ子されるコンポーネント
 * @returns スクロールコンポーネント
 */
export const Scroll = React.forwardRef<HTMLDivElement, ScrollProps>(({ isVertical = true, children }, ref) => {
  const overflowSetting = isVertical ? 'overflow-y-auto' : 'overflow-x-auto'
  const scrollClass = `${overflowSetting} whitespace-nowrap w-full`

  return <div ref={ref} className={scrollClass}>{children}</div>
})