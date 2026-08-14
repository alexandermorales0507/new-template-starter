import { loadEvent } from "@/platform/load-event";
import { TemplateRenderer } from "@/template/TemplateRenderer";

export type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const result = await loadEvent(query);

  if (result.status === "available") {
    return (
      <TemplateRenderer
        data={result.data}
        apiBaseUrl={result.env.apiBaseUrl}
        accessToken={query.access ? String(query.access) : null}
        isDemoMode={result.env.designMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200 shadow-xs space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          {result.status === "setup_error"
            ? "Starter Configuration Required"
            : "Website Unavailable"}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">{result.message}</p>

        {result.status === "setup_error" && (
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 text-left space-y-2 bg-gray-50 p-4 rounded border">
            <p className="font-semibold text-gray-800">To enable Design / Demo Mode:</p>
            <code className="block font-mono text-gray-700 bg-white p-2 rounded border">
              NEXT_PUBLIC_DESIGN_MODE=true
            </code>
            <p className="font-semibold text-gray-800 pt-2">To connect a real event:</p>
            <code className="block font-mono text-gray-700 bg-white p-2 rounded border">
              NEXT_PUBLIC_WEBSERBISYO_API_URL=https://...
              <br />
              NEXT_PUBLIC_EVENT_SLUG=your-event-slug
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
