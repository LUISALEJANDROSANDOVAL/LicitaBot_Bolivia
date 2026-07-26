function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`skeleton-shimmer ${className || ""}`}
      {...props}
    />
  )
}
export { Skeleton }
