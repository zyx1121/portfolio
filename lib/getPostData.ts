import { readFileSync } from "fs";
import matter from "gray-matter";
import path, { join } from "path";
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), "_posts");

export async function getPostData() {
  const fullPath = path.join(postsDirectory, `test.md`);
  const fileContents = readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return contentHtml;
}