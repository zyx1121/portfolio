import { getPost } from "@/lib/getPost";

export default async function Home() {
  const post = await getPost("loki");

  return (
    <main className="w-[100dvw] p-4 mt-8">
      <article className="max-w-4xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </main>
  )
}
