"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  content: string;

  same_bro: number;
  dead: number;
  felt: number;

  colleges: {
    name: string;
  };

  categories: {
    name: string;
  };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        same_bro,
        dead,
        felt,

        colleges (
          name
        ),

        categories (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else if (data) {
      setPosts(data);
    }
  }

  async function reactToPost(
    postId: string,
    reaction: "same_bro" | "dead" | "felt",
    currentValue: number
  ) {
    const storageKey = `${postId}-${reaction}`;

    const alreadyReacted = localStorage.getItem(storageKey);

    if (alreadyReacted) {
      alert("You already reacted");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .update({
        [reaction]: currentValue + 1,
      })
      .eq("id", postId);

    if (error) {
      console.log(error);
    } else {
      localStorage.setItem(storageKey, "true");

      fetchPosts();
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              LastBench
            </h1>

            <p className="text-zinc-500 mt-2">
              For the thoughts that never reach the classroom.
            </p>
          </div>

          <Link
            href="/post"
            className="bg-white text-black px-5 py-3 rounded-xl font-medium"
          >
            Post
          </Link>
        </div>

        <div className="space-y-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                <span>{post.categories?.name}</span>
                <span>•</span>
                <span>{post.colleges?.name}</span>
              </div>

              <p className="text-lg leading-relaxed mb-6">
                {post.content}
              </p>

              <div className="flex gap-5 text-zinc-400 text-sm">

                <button
                  onClick={() =>
                    reactToPost(
                      post.id,
                      "same_bro",
                      post.same_bro
                    )
                  }
                  className="hover:text-white transition"
                >
                  🫂 {post.same_bro}
                </button>

                <button
                  onClick={() =>
                    reactToPost(
                      post.id,
                      "dead",
                      post.dead
                    )
                  }
                  className="hover:text-white transition"
                >
                  💀 {post.dead}
                </button>

                <button
                  onClick={() =>
                    reactToPost(
                      post.id,
                      "felt",
                      post.felt
                    )
                  }
                  className="hover:text-white transition"
                >
                  ❤️ {post.felt}
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}