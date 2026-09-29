function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "bg-[#902D41]",
  iconStyle = "bg-red-50 text-[#902D41]",
  valueStyle = "text-slate-900",
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute left-0 right-0 top-0 h-1 ${accent}`} />

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <p className={`mt-3 text-3xl font-extrabold ${valueStyle}`}>
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;