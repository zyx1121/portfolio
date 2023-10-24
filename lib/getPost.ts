import { readFileSync } from "fs";
import matter from "gray-matter";
import { join } from "path";
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), "posts");

export type postProps = {
  title: string,
  contentHtml: string
}

export async function getPost(post: string) {
  const fullPath = join(postsDirectory, `${post}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {contentHtml, ...matterResult.data};
}
