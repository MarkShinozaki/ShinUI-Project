export const primaryNav = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/browse", label: "Browse", icon: "Compass" },
  { href: "/components", label: "Components", icon: "Blocks" },
  { href: "/categories", label: "Categories", icon: "LayoutGrid" },
  { href: "/about", label: "About", icon: "Info" },
] as const;

/** The bottom bar drops "About" — five targets is already tight on a phone. */
export const mobileTabs = primaryNav.filter((item) => item.href !== "/about");
