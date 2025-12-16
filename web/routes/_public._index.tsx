import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Link } from "react-router";

export default function () {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center">
        <div className="mx-auto max-w-4xl px-8 text-center flex flex-col gap-6">
          <h1 className="text-6xl font-bold tracking-tight text-center">👋 Hey, Developer!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {"This is your app's frontend. Start building it in the Gadget editor."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="w-auto">
              <Link to="/tutorial">Start the Tutorial</Link>
            </Button>
          <Button asChild className="w-auto self-center">
            <a href="/edit/files/web/routes/_public._index.tsx" target="_blank">
              <Pencil />
              Edit this page
            </a>
          </Button>
          </div>
        </div>
      </section>
    </div>
  );
}