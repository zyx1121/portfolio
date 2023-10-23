import { getPostData } from "@/lib/getPostData";

export default async function Home() {
  const content = await getPostData();

  return (
    <main className="relative h-auto w-[100dvw] p-4">
      <article className="relative font-mono max-w-4xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </main>
  )
}
