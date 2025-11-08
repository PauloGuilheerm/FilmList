export default function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  const classes = `bg-ocean text-white px-2 py-1 rounded-md text-sm font-medium rounded-xl ${className}`;
  return (
    <span className={classes}>
      {children}
    </span>
  )
}