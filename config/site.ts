export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "RentEase",
  description: "Find your perfect rental property with ease. Browse thousands of listings and connect with landlords seamlessly.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Listings",
      href: "/listings",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "My Bookings",
      href: "/bookings",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help",
      href: "/help",
    },
    {
      label: "Sign out",
      href: "/signout",
    },
  ],
      
  
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
