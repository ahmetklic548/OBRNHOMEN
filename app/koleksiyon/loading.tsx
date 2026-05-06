export default function KoleksiyonLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      {/* Header skeleton */}
      <div className="pt-36 pb-8 px-6 text-center" style={{ background: "#F5F5F7" }}>
        <div className="h-3 w-20 rounded mx-auto mb-4 animate-pulse" style={{ background: "#e0e0e0" }} />
        <div className="h-8 w-48 rounded mx-auto mb-3 animate-pulse" style={{ background: "#e0e0e0" }} />
        <div className="h-3 w-32 rounded mx-auto animate-pulse" style={{ background: "#e0e0e0" }} />
      </div>

      {/* Grid skeleton */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Filtre çubuğu */}
        <div className="flex gap-3 mb-8 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-full animate-pulse flex-shrink-0"
              style={{ background: "#F5F5F7" }}
            />
          ))}
        </div>

        {/* Ürün kartları */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div
                className="aspect-square rounded-lg animate-pulse"
                style={{ background: "#F5F5F7", animationDelay: `${i * 50}ms` }}
              />
              <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: "#F5F5F7", animationDelay: `${i * 50}ms` }} />
              <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "#F5F5F7", animationDelay: `${i * 50}ms` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
