import { createFileRoute } from "@tanstack/react-router";
import { QrStudio } from "@/components/qr-studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-16 pt-6 lg:px-8 lg:pt-10">
      <QrStudio />
    </main>
  );
}
