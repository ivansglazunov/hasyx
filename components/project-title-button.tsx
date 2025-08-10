"use client"


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "hasyx/components/ui/sidebar";

import Image from "next/image"
import { Button } from "./ui/button";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function ProjectAndVersion({
  name,
  logo,
  version,
}: {
  name: string;
  logo?: string;
  version: string;
}) {
  return (
    <Button
      size="lg" variant="ghost" asChild
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-start p-3 px-3"
    >
      <Link href="/">
        <div className="flex size-8 items-center justify-center">
          <Image src={`${basePath}/${logo || 'logo.svg'}`} alt="Hasyx Logo" width={32} height={32} />
        </div>
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-semibold">{name}</span>
          <span className="">v{version}</span>
        </div>
      </Link>
    </Button>
  )
}
