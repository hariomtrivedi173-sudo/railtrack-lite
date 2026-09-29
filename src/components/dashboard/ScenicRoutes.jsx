import { ArrowRight, Sparkles } from "lucide-react";

const scenicRoutes = [
  {
    id: 1,
    from: "Zürich HB",
    to: "Bern",
    description: "Fast InterCity line",
  },
  {
    id: 2,
    from: "Genève",
    to: "Lausanne",
    description: "Lake Geneva shoreline",
  },
  {
    id: 3,
    from: "Basel SBB",
    to: "Luzern",
    description: "Central Swiss connection",
  },
];

function ScenicRoutes({ onSearchRoute }) {
  const handleSearch = (route) => {
    if (onSearchRoute) {
      onSearchRoute(route);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-extrabold text-slate-900">
          Scenic Routes
        </h2>

        <Sparkles size={17} className="text-amber-500" />
      </div>

      <p className="mt-1 text-xs text-slate-500">
        Popular Swiss rail lines to explore
      </p>

      <div className="mt-4 space-y-2.5">
        {scenicRoutes.map((route) => (
          <button
            key={route.id}
            type="button"
            onClick={() => handleSearch(route)}
            className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left text-xs transition hover:border-red-200 hover:bg-red-50/40"
          >
            <div>
              <p className="font-bold text-slate-800 transition group-hover:text-[#902D41]">
                {route.from} → {route.to}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-400">
                {route.description}
              </p>
            </div>

            <span className="flex items-center gap-1 font-bold text-[#902D41]">
              Search
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ScenicRoutes;