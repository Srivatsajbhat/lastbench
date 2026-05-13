"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
};

const anonymousNames = [
    "Anonymous Owl",
    "Anonymous Ghost",
    "Anonymous Sleeper",
    "Anonymous Dreamer",
    "Anonymous Penguin",
    "Anonymous Wolf",
    "Anonymous Coder",
    "Anonymous Moon",
];

export default function CollegePage() {
    const params = useParams();

    const collegeId = params.id as string;

    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    const [expandedPosts, setExpandedPosts] = useState<
        Record<string, boolean>
    >({});

    const [commentInputs, setCommentInputs] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        if (collegeId) {
            fetchPosts();
            fetchComments();
        }
    }, [collegeId]);

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
      `)
            .eq("college_id", collegeId)
            .order("created_at", {
                ascending: false,
            });

        if (error) {
            console.log(error);
        } else if (data) {
            setPosts(data);
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
                                Campus Feed
                            </h1>

                            <p className="text-zinc-500 mt-2">
                                Thoughts from this classroom only.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <Link
                                href="/feed"
                                className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-xl font-medium hover:border-zinc-700 transition"
                            >
                                Feed
                            </Link>

                            <Link
                                href="/trending"
                                className="bg-orange-500/20 border border-orange-500/30 text-orange-300 px-5 py-3 rounded-xl font-medium hover:bg-orange-500/30 transition"
                            >
                                Trending
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

                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-40">

                            <div className="text-6xl mb-6">
                                🎓
                            </div>

                            <h2 className="text-3xl font-semibold mb-4">
                                No campus thoughts yet.
                            </h2>

                            <p className="text-zinc-500 max-w-md leading-relaxed mb-8">
                                This classroom is still silent.
                                Maybe you’ll start the conversation.
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-5">

                            {posts.map((post) => {
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
                                                <p className="text-sm text-zinc-300 font-medium">
                                                    {post.anonymous_name}
                                                </p>

                                                <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">

                                                    <span>
                                                       post.categories?.[0]?.name
                                                    </span>

                                                    <span>•</span>

                                                    <span>
                                                        post.colleges?.[0]?.name
                                                    </span>

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
                    )}

                </div>
            </main>
        </>
    );
}