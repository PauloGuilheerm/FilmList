export default function Rating({ rating, className }: { rating: number, className?: string }) {
  const classes = `items-center justify-start rounded-full bg-[#f59e0b]
    px-1 py-[3px] text-[11px] font-semibold text-black/90 ${className}`;
    
  return (
    <span
      className={classes}
      title="Nota"
    >
      {rating.toFixed(2)}
    </span>
  );
}