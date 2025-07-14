"use client";

import { BookOpen, Bookmark, LogIn, UserPlus, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Notes",
    url: "/notes",
    icon: BookOpen,
  },
  {
    title: "Bookmarks",
    url: "/bookmarks",
    icon: Bookmark,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on load and on token change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  const getNavClasses = (path) => {
    const active = isActive(path);
    return `flex items-center justify-start w-full transition-colors rounded-md px-2 py-2 ${
      active
        ? "bg-primary text-primary-foreground font-medium hover:bg-primary"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <SidebarPrimitive
      className={`${
        collapsed ? "w-16" : "w-64"
      } border-r border-border bg-card transition-all duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-bold text-lg text-foreground">
                Notes & Bookmarks
              </h1>
              <p className="text-sm text-muted-foreground">Personal Manager</p>
            </div>
          )}
        </div>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              {!collapsed && "Navigation"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={getNavClasses(item.url)}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-muted-foreground">
              {!collapsed && "Account"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {!isLoggedIn ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/login" className={getNavClasses("/login")}>
                          <LogIn className="h-5 w-5" />
                          {!collapsed && <span className="ml-3">Login</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link
                          href="/sign-up"
                          className={getNavClasses("/signup")}
                        >
                          <UserPlus className="h-5 w-5" />
                          {!collapsed && <span className="ml-3">Sign Up</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                      <div className={getNavClasses("/logout")}>
                        <LogOut className="h-5 w-5" />
                        {!collapsed && <span className="ml-3">Logout</span>}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </SidebarPrimitive>
  );
}
