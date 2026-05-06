export default function ProductLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 pt-36 pb-4">
        <div className="h-3 w-64 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pb-16">
        <div className="lg:grid lg:grid-cols-[3fr_2fr] lg:gap-16 xl:gap-24 items-start">
          {/* Görsel skeleton */}
          <div className="mb-12 lg:mb-0 space-y-3">
            <div className="aspect-square w-full rounded-lg animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
              ))}
            </div>
          </div>

          {/* Bilgi skeleton */}
          <div className="space-y-4">
            <div className="h-3 w-32 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-8 w-3/4 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-8 w-1/2 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-10 w-1/3 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-px w-full" style={{ background: "#F5F5F7" }} />
            <div className="h-3 w-full rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-3 w-5/6 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-3 w-4/6 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            <div className="h-12 w-full rounded-full animate-pulse mt-4" style={{ background: "#F5F5F7" }} />
            <div className="h-12 w-full rounded-full animate-pulse" style={{ background: "#F5F5F7" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
