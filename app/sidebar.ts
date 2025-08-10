import { SidebarData } from "hasyx/components/sidebar";
import pckg from "@/package.json";

// Import static documentation navigation
let docNavigation: any = null;
try {
  docNavigation = require("./hasyx/doc/md.json");
} catch (error) {
  console.warn("Documentation navigation not found, will be populated dynamically");
}

export const sidebar: SidebarData = {
  name: pckg.name,
  version: pckg.version,
  logo: "logo.svg",
  navMain: [
    {
      title: "😈 Hasyx",
      url: "#",
      items: [
        {
          title: "🧪 Diagnostics",
          url: "/hasyx/diagnostics",
        },
        {
          title: "🛠️ Config",
          url: "/hasyx/config",
        },
        {
          title: "🟡 PWA Diagnostics",
          url: "/hasyx/pwa",
        },
        {
          title: "🟢 Constructor",
          url: "/hasyx/constructor",
        },
        {
          title: "🟠 A-Frame",
          url: "/hasyx/aframe",
        },
        {
          title: "🟢 Cyto",
          url: "/hasyx/cyto",
        },
        {
          title: "🟡 Payments",
          url: "/hasyx/payments",
        },
        {
          title: "🟢 Telegram",
          url: "/hasyx/telegram-miniapp",
        },
        {
          title: "🟠 Roadmap",
          url: "/hasyx/roadmap",
        },
        {
          title: "🔍 Validation",
          url: "/hasyx/validation",
        },
        {
          title: "📁 Files",
          url: "/hasyx/files",
        },
        {
          title: "💬 Messaging",
          url: "/hasyx/messaging",
        },
        {
          title: "🃏 Hover Card Demo",
          url: "/hasyx/hover-card",
        },
        {
          title: "💢 Shock Demo",
          url: "/hasyx/shock-hook",
        },
      ],
    },
    // Add documentation section with collapse functionality
    {
      title: "📚 Documentation",
      url: "/hasyx/doc",
      items: docNavigation?.items || [],
    },
  ],
};

export default sidebar;