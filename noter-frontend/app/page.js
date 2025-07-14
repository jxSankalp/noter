"use client";

import { Book, StickyNote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);


  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Welcome to NoteMark!</h1>
        </div>

        <p className="text-muted-foreground text-base sm:text-lg">
          Organize your thoughts and favorite links in one place. Easily manage
          notes and bookmarks using a fast and minimal interface.
        </p>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <a href="/notes">
              <StickyNote className="w-4 h-4 mr-2" />
              Go to Notes
            </a>
          </Button>

          <Button variant="secondary" asChild>
            <a href="/bookmarks">
              <Book className="w-4 h-4 mr-2" />
              Go to Bookmarks
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
