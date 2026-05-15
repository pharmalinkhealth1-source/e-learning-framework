import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, content, category } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const VALID_CATEGORIES = ['general', 'clinical', 'regulatory', 'supply_chain', 'technology', 'careers']
    const resolvedCategory = VALID_CATEGORIES.includes(category) ? category : 'general'

    // 1. Find the author in Sanity based on Clerk userId
    const author = await writeClient.fetch(`*[_type == "author" && clerkId == $userId][0]._id`, { userId });

    if (!author) {
      return NextResponse.json({ error: "Author profile not found. Please complete onboarding." }, { status: 404 });
    }

    // 2. Generate slug
    const slug = slugify(title, { lower: true, strict: true });

    // 3. Create the post document
    const result = await writeClient.create({
      _type: 'forumPost',
      title,
      category: resolvedCategory,
      slug: {
        _type: 'slug',
        current: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
      },
      content: [
        {
          _type: 'block',
          _key: Math.random().toString(36).substring(2, 11),
          children: [
            {
              _type: 'span',
              _key: Math.random().toString(36).substring(2, 11),
              text: content,
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      publishedAt: new Date().toISOString(),
      author: {
        _type: 'reference',
        _ref: author,
      },
    });

    return NextResponse.json({ success: true, slug: result.slug.current });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
