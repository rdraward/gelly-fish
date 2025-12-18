// --------------------------------------------------------------------------------------
// Navigation Bar System (Mobile + Desktop)
// --------------------------------------------------------------------------------------
// This file defines a data-driven navigation bar for both mobile and desktop layouts.
// To extend: update the `navigationItems` array with new links or sections.
// Components:
//   - Navigation: Root bar with logo, mobile, and desktop nav.
//   - MobileNav: Hamburger menu for small screens.
//   - DesktopNav: Horizontal menu for larger screens.
// --------------------------------------------------------------------------------------

import { Link, useMatches } from "react-router";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { NavDrawer } from "@/components/shared/NavDrawer";
import { GellyLogo } from "@/components/shared/GellyLogo";
import { NumberedCircle } from "@/components/shared/NumberedCircle";

interface NavItem {
  type: "item";
  title: string;
  href: string;
  description?: string; // (optional, shown in desktop dropdowns)
}
interface NavSection {
  type: "section";
  title: string;
  items: NavItem[];
}
type NavItems = (NavItem | NavSection)[];

// Main navigation data. Extend this array to add links/sections.
// Example:
// const navigationItems: NavItems = [
//   { type: "item", title: "Docs", href: "/docs", description: "Documentation" },
//   {
//     type: "section",
//     title: "More",
//     items: [
//       { type: "item", title: "About", href: "/about" },
//       { type: "item", title: "Contact", href: "/contact" },
//     ],
//   },
// ];
const navigationItems: NavItems = [];

// Root navigation bar: logo, mobile, and desktop nav
export const Navigation = () => {
  const matches = useMatches();
  
  // Get challenge data from the challenge route if we're on a challenge page
  const challengeMatch = matches.find((match: any) => match.pathname?.startsWith("/challenge/"));
  const challengeData = challengeMatch?.data as { 
    levels?: Array<{ id: string; number: number }>; 
    challenge?: { id: string } 
  } | undefined;
  const levels = challengeData?.levels;
  const currentChallengeId = challengeData?.challenge?.id;
  const isChallengePage = !!levels && levels.length > 0;

  return (
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <MobileNav />
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center" aria-label="Home">
          <GellyLogo height={32} className="block" />
        </Link>
      </div>
      {isChallengePage && (
        <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap min-w-0 flex-1 ml-4">
          {levels.map((lvl) => {
            const isActive = lvl.id === currentChallengeId;
            return (
              <Link
                key={lvl.id}
                to={`/challenge/${lvl.id}`}
                aria-current={isActive ? "page" : undefined}
                className="inline-block shrink-0"
              >
                <NumberedCircle number={lvl.number} isActive={isActive} />
              </Link>
            );
          })}
        </nav>
      )}
      <DesktopNav />
    </div>
  );
};

// Mobile hamburger menu, uses Sheet for slide-out drawer
const MobileNav = () => {
  return (
    <div className="md:hidden">
      <NavDrawer>
        {({ close }) => (
          <nav className="flex flex-col gap-4 px-6 pt-16 pb-8">
            {navigationItems.map((item) =>
              item.type === "section" ? (
                <div key={item.title}>
                  <p className="text-sm font-medium">{item.title}</p>
                  <div className="mt-2 flex flex-col gap-2 pl-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={close}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.title}
                  to={item.href}
                  className="text-sm font-medium hover:text-gray-900"
                  onClick={close}
                >
                  {item.title}
                </Link>
              )
            )}
          </nav>
        )}
      </NavDrawer>
    </div>
  );
};

// Desktop horizontal nav, supports dropdown sections
const DesktopNav = () => (
  <NavigationMenu className="hidden md:flex px-4">
    <NavigationMenuList className="flex gap-1">
      {navigationItems.map((item) => (
        <NavigationMenuItem key={item.title}>
          {item.type === "item" ? (
            <NavigationMenuLink asChild>
              <Button className="px-3" variant="ghost">
                <Link to={item.href}>{item.title}</Link>
              </Button>
            </NavigationMenuLink>
          ) : (
            <>
              <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium transition-colors hover:text-accent-foreground">
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[200px] p-2">
                <div className="p-2">
                  <div className="grid grid-cols-1">
                    {item.items.map((subItem) => (
                      <NavigationMenuLink key={subItem.title} asChild>
                        <Link
                          to={subItem.href}
                          className="block flex flex-col gap-1 rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium">{subItem.title}</div>
                          {subItem.description && (
                            <p className="text-sm text-muted-foreground">{subItem.description}</p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </>
          )}
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
    <NavigationMenuViewport />
  </NavigationMenu>
);

// --------------------------------------------------------------------------------------
// To extend: add to navigationItems. For custom rendering, edit MobileNav/DesktopNav.
// --------------------------------------------------------------------------------------