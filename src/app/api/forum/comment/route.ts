import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { postId, content, parentCommentId } = await req.json();

    // 1. Find the author in Sanity based on Clerk userId
    const author = await writeClient.fetch(`*[_type == "author" && clerkId == $userId][0]._id`, { userId });

    if (!author) {
      return NextResponse.json({ error: "Author profile not found" }, { status: 404 });
    }

    // 2. Create the comment document
    const result = await writeClient.create({
      _type: 'comment',
      content,
      publishedAt: new Date().toISOString(),
      author: {
        _type: 'reference',
        _ref: author,
      },
      parentPost: {
        _type: 'reference',
        _ref: postId,
      },
      ...(parentCommentId && {
        parentComment: {
          _type: 'reference',
          _ref: parentCommentId,
        }
      })
    });

    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error("Comment submission error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
