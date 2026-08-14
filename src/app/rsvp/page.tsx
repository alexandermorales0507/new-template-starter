import { loadEvent } from "@/platform/load-event";
import { RSVPSection } from "@/template/sections/RSVP";
import { Navbar } from "@/template/components/Navbar";
import { Footer } from "@/template/components/Footer";

export type RsvpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RsvpPage({ searchParams }: RsvpPageProps) {
  const query = await searchParams;
  const result = await loadEvent(query);

  if (result.status === "available") {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        <Navbar data={result.data} />
        <main className="flex-1 py-8">
          <RSVPSection
            data={result.data.rsvp}
            eventSlug={result.data.eventSlug}
            apiBaseUrl={result.env.apiBaseUrl}
            accessToken={query.access ? String(query.access) : null}
            isDemoMode={result.env.designMode}
          />
        </main>
        <Footer data={result.data} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
        <p className="text-sm text-gray-600">{result.message}</p>
      </div>
    </div>
  );
}
