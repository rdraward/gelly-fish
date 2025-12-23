// --------------------------------------------------------------------------------------
// Public Layout (No Auth)
// --------------------------------------------------------------------------------------
// This file defines the layout for all public-facing routes that are accessible to logged out users.
// Typical pages using this layout include brochure pages, pricing, about, and other marketing or informational content.
// Structure:
//   - Navigation bar (imported from @/components/public/nav); extend this with navigation items as needed
//   - Main content area for routes (via <Outlet />)
//   - Footer that should be expanded with any content you think is relevant to your app
// To extend: update the Navigation component or replace footer content as needed.
// --------------------------------------------------------------------------------------

import { Link, Outlet, useLocation, useOutletContext } from "react-router";
import { useSignOut } from "@gadgetinc/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "@/components/shared/UserIcon";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Navigation } from "@/components/public/nav";
import type { Route } from "./+types/_public";
import type { RootOutletContext } from "../root";
import { ProgressProvider } from "@/lib/progress-context";

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { session, gadgetConfig } = context;

  const userId = session?.get("user");
  const user = userId ? await context.api.user.findOne(userId) : undefined;

  return {
    user,
  };
};

export default function ({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const context = useOutletContext<RootOutletContext>();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const signOut = useSignOut({ redirectToPath: "/" });

  return (
    <ProgressProvider userId={user?.id}>
      <div className="flex flex-col h-screen overflow-hidden">
        <nav className={`shrink-0`}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between pt-4 items-center">
              <Navigation />

              <div className="flex items-center space-x-2">
                <ThemeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="p-2 rounded-full text-white"
                      >
                        <UserIcon user={user} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem
                        onClick={signOut}
                        className="flex items-center text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/sign-in">Login</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link to="/sign-up">Get started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 overflow-hidden bg-transparent">
          {isHome ? (
            <Outlet context={context} />
          ) : (
            <div className="mx-auto px-2 h-full py-0">
              <Outlet context={context} />
            </div>
          )}
        </main>
      </div>
    </ProgressProvider>
  );
}
