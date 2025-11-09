export default function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  const baseClasses = 'bg-ocean text-white px-2 py-1 rounded-md text-sm font-medium rounded-xl';
  const classes = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <span className={classes}>
      {children}
    </span>
  )
}