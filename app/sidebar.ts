import { SidebarData } from "hasyx/components/sidebar";
import pckg from "@/package.json";
import en from "hasyx/i18n/en.json";
import ru from "hasyx/i18n/ru.json";

// Read public locale at build-time so the value is inlined in the client bundle
const LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en';
const NAV_MESSAGES = (LOCALE === 'ru' ? (ru as any) : (en as any)).nav as typeof en.nav;

const t = (key: keyof typeof en.nav) => NAV_MESSAGES[key];

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
          title: `🧪 ${t('diagnostics')}`,
          url: "/hasyx/diagnostics",
        },
        {
          title: `🛠️ ${t('config')}`,
          url: "/hasyx/config",
        },
        {
          title: `🎛️ ${t('pwaDiagnostics')}`,
          url: "/hasyx/pwa",
        },
        {
          title: `🏗️ ${t('constructor')}`,
          url: "/hasyx/constructor",
        },
        {
          title: `⛑️ ${t('aframe')}`,
          url: "/hasyx/aframe",
        },
        {
          title: `📐 ${t('cyto')}`,
          url: "/hasyx/cyto",
        },
        {
          title: `💸 ${t('payments')}`,
          url: "/hasyx/payments",
        },
        {
          title: `🪁 ${t('telegram')}`,
          url: "/hasyx/telegram-miniapp",
        },
        {
          title: `🏁 ${t('roadmap')}`,
          url: "/hasyx/roadmap",
        },
        {
          title: `🔍 ${t('validation')}`,
          url: "/hasyx/validation",
        },
        {
          title: `📁 ${t('files')}`,
          url: "/hasyx/files",
        },
        {
          title: `💬 ${t('messaging')}`,
          url: "/hasyx/messaging",
        },
        {
          title: "👥 Groups",
          url: "/hasyx/groups",
        },
        {
          title: `🃏 ${t('hoverCardDemo')}`,
          url: "/hasyx/hover-card",
        },
        {
          title: `💢 ${t('shockDemo')}`,
          url: "/hasyx/shock-hook",
        },
        {
          title: `🟦 ${t('columns')}`,
          url: "/hasyx/columns",
        },
      ],
    },
  ],
};

export default sidebar;