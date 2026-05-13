"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import AmbientBackground from "@/components/AmbientBackground";

type Comment = {
    id: string;
    content: string;
    anonymous_name: string;
    created_at: string;
    post_id: string;
};

type Post = {
    id: string;
    content: string;

    created_at: string;

    anonymous_name: string;

    same_bro: number;
    dead: number;
    felt: number;

    colleges: {
        id: string;
        name: string;
    }[];

    categories: {
        name: string;
    }[];

    trendingScore?: number;
};

export default function TrendingPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    const [comments, setComments] = useState<
        Comment[]
    >([]);

    const [expandedPosts, setExpandedPosts] =
        useState<
            Record<string, boolean>
        >({});

    const [commentInputs, setCommentInputs] =
        useState<
            Record<string, string>
        >({});

    useEffect(() => {
        fetchPosts();
        fetchComments();
    }, []);

    async function fetchPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select(`
        id,
        content,
        created_at,
        anonymous_name,
        same_bro,
        dead,
        felt,

        colleges (
          id,
          name
        ),

        categories (
          name
        )
      `);

        if (error) {
            console.log(error);
            return;
        }

        if (data) {
            const scoredPosts = data.map(
                (post) => {
                    const postComments =
                        comments.filter(
                            (comment) =>
                                comment.post_id ===
                                post.id
                        );

                    const score =
                        post.same_bro +
                        post.dead +
                        post.felt +
                        postComments.length * 2;

                    return {
                        ...post,
                        trendingScore: score,
                    };
                }
            );

            scoredPosts.sort(
                (a, b) =>
                    (b.trendingScore || 0) -
                    (a.trendingScore || 0)
            );

            setPosts(scoredPosts);
        }
    }

    async function fetchComments() {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .order("created_at", {
                ascending: true,
            });

        if (error) {
            console.log(error);
        } else if (data) {
            setComments(data);
        }
    }

    useEffect(() => {
        if (comments.length > 0) {
            fetchPosts();
        }
    }, [comments]);

    async function reactToPost(
        postId: string,
        reaction: "same_bro" | "dead" | "felt",
        currentValue: number
    ) {
        const storageKey = `${postId}-${reaction}`;

        const alreadyReacted =
            localStorage.getItem(storageKey);

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
            localStorage.setItem(
                storageKey,
                "true"
            );

            fetchPosts();
        }
    }

    async function addComment(postId: string) {
        const content = commentInputs[postId];

        if (!content) return;

        const anonymousName =
            localStorage.getItem(
                "lastbench-identity"
            ) || "Anonymous Ghost";

        const { error } = await supabase
            .from("comments")
            .insert([
                {
                    content,
                    post_id: postId,
                    anonymous_name: anonymousName,
                },
            ]);

        if (error) {
            console.log(error);
        } else {
            setCommentInputs((prev) => ({
                ...prev,
                [postId]: "",
            }));

            fetchComments();
        }
    }

    return (
        <>
            <AmbientBackground />

            <main className="min-h-screen bg-black/70 text-white px-6 py-10">
                <div className="max-w-3xl mx-auto">

                    <div className="flex items-center justify-between mb-10">

                        <div>
                            <h1 className="text-4xl font-bold">
                                Trending Tonight
                            </h1>

                            <p className="text-zinc-500 mt-2">
                                The thoughts everyone felt.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3 max-w-[220px]">

                            <Link
                                href="/feed"
                                className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl font-medium hover:border-zinc-700 transition"
                            >
                                Feed
                            </Link>

                            <Link
                                href="/colleges"
                                className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl font-medium hover:border-zinc-700 transition"
                            >
                                Colleges
                            </Link>

                            <Link
                                href="/post"
                                className="bg-white text-black px-5 py-3 rounded-xl font-medium hover:scale-105 transition"
                            >
                                Post
                            </Link>

                        </div>

                    </div>

                    <div className="space-y-5">

                        {posts.map((post, index) => {
                            const postComments =
                                comments.filter(
                                    (comment) =>
                                        comment.post_id ===
                                        post.id
                                );

                            const visibleComments =
                                expandedPosts[post.id]
                                    ? postComments
                                    : postComments.slice(-2);

                            return (
                                <div
                                    key={post.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                                >
                                    <div className="flex items-center justify-between mb-4">

                                        <div>

                                            <div className="flex items-center gap-3 mb-2">

                                                <div className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                                                    #{index + 1}
                                                </div>

                                                <div className="bg-orange-500/20 text-orange-300 text-xs px-3 py-1 rounded-full">
                                                    🔥 {post.trendingScore}
                                                </div>

                                            </div>

                                            <p className="text-sm text-zinc-300 font-medium">
                                                {post.anonymous_name}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">

                                                <span>
                                                   post.colleges?.[0]?.name
                                                </span>

                                                <span>•</span>

                                                <Link
                                                    href={`/college/${
                                                        post.colleges?.[0]?.id
                                                    }`}
                                                    className="hover:text-white transition"
                                                >
                                                    post.colleges?.[0]?.name
                                                </Link>

                                            </div>
                                        </div>

                                        <p className="text-xs text-zinc-600">
                                            {formatDistanceToNow(
                                                new Date(
                                                    post.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </p>

                                    </div>

                                    <p className="text-lg leading-relaxed mb-6">
                                        {post.content}
                                    </p>

                                    <div className="flex gap-5 text-zinc-400 text-sm mb-6">

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

                                    <div className="space-y-3">

                                        {postComments.length >
                                            2 &&
                                            !expandedPosts[
                                            post.id
                                            ] && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedPosts(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                [post.id]:
                                                                    true,
                                                            })
                                                        )
                                                    }
                                                    className="text-sm text-zinc-500 hover:text-white transition"
                                                >
                                                    View all{" "}
                                                    {
                                                        postComments.length
                                                    }{" "}
                                                    comments
                                                </button>
                                            )}

                                        {visibleComments.map(
                                            (comment) => (
                                                <div
                                                    key={
                                                        comment.id
                                                    }
                                                    className="bg-black/40 border border-zinc-800 rounded-2xl p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-2">

                                                        <p className="text-sm text-zinc-300">
                                                            {
                                                                comment.anonymous_name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-zinc-600">
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    comment.created_at
                                                                ),
                                                                {
                                                                    addSuffix:
                                                                        true,
                                                                }
                                                            )}
                                                        </p>

                                                    </div>

                                                    <p className="text-sm text-zinc-400">
                                                        {
                                                            comment.content
                                                        }
                                                    </p>
                                                </div>
                                            )
                                        )}

                                        {expandedPosts[
                                            post.id
                                        ] &&
                                            postComments.length >
                                            2 && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedPosts(
                                                            (
                                                                prev
                                                            ) => ({
                                                                ...prev,
                                                                [post.id]:
                                                                    false,
                                                            })
                                                        )
                                                    }
                                                    className="text-sm text-zinc-500 hover:text-white transition"
                                                >
                                                    Hide comments
                                                </button>
                                            )}

                                        <div className="flex gap-3 pt-2">

                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={
                                                    commentInputs[
                                                    post.id
                                                    ] || ""
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setCommentInputs(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            [post.id]:
                                                                e.target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                className="flex-1 bg-black/40 border border-zinc-800 rounded-2xl px-4 py-3 outline-none"
                                            />

                                            <button
                                                onClick={() =>
                                                    addComment(
                                                        post.id
                                                    )
                                                }
                                                className="bg-white text-black px-5 rounded-2xl font-medium"
                                            >
                                                Send
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>

                </div>
            </main>
        </>
    );
}