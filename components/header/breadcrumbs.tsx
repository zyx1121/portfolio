"use client"

import { Label } from "@/components/ui/label"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const path = usePathname().split('/').filter(Boolean)
  if (usePathname().replace('/', '')) return (
    <Label className="my-auto px-2 text-base" >
      {path.at(0)}
    </Label>
  )
}