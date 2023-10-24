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
    <main className="w-[20rem] p-4">
      <form className="flex gap-4" onSubmit={handleSubmit} >
        <Input ref={inputRef} type="text" placeholder="name" />
        <Button type="submit">
          start
        </Button>
      </form>
    </main>
  )
}