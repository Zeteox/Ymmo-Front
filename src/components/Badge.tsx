export function Badge({ icon, label, value, color = "slate" }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: "slate" | "blue" | "emerald" | "amber";
}) {
  const colors = {
    slate:   "bg-slate-100 text-slate-700",
    blue:    "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber:   "bg-amber-50 text-amber-700",
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${colors[color]}`}>
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-xs opacity-60 font-medium uppercase tracking-wider leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold leading-none">{value}</p>
      </div>
    </div>
  );
}