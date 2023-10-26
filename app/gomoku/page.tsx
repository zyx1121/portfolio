'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Page() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      router.push(`/gomoku/${inputRef.current.value}`);
    }
  }

  return (
    <main className="w-[100dvw] h-[calc(100dvh-8rem)] p-4 flex items-center justify-center">
      <form className="grid gap-4" onSubmit={handleSubmit} >
        <Input className="text-center" ref={inputRef} type="text" placeholder="name" />
        <Button type="submit">
          start
        </Button>
      </form>
    </main>
  )
}