export default function KategoriLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto px-6 pt-36 pb-2">
        <div className="h-3 w-48 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
      </div>
      <div className="pb-8 px-6 pt-4 text-center" style={{ background: "#F5F5F7", marginTop: "1rem" }}>
        <div className="h-3 w-16 rounded mx-auto mb-4 animate-pulse" style={{ background: "#e0e0e0" }} />
        <div className="h-8 w-40 rounded mx-auto mb-3 animate-pulse" style={{ background: "#e0e0e0" }} />
        <div className="h-3 w-56 rounded mx-auto animate-pulse" style={{ background: "#e0e0e0" }} />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-square rounded-lg animate-pulse" style={{ background: "#F5F5F7", animationDelay: `${i * 50}ms` }} />
              <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
              <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "#F5F5F7" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
