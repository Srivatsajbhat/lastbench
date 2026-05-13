"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AmbientBackground from "@/components/AmbientBackground";

type College = {
    id: string;
    name: string;
};

type Category = {
    id: string;
    name: string;
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
    "Anonymous Raven",
    "Anonymous Stranger",
];

export default function PostPage() {
    const router = useRouter();

    const [content, setContent] = useState("");

    const [collegeId, setCollegeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    const [anonymousName, setAnonymousName] =
        useState("");

    const [colleges, setColleges] = useState<
        College[]
    >([]);

    const [categories, setCategories] = useState<
        Category[]
    >([]);

    useEffect(() => {
        fetchColleges();
        fetchCategories();
        initializeAnonymousIdentity();
    }, []);

    function initializeAnonymousIdentity() {
        const existingIdentity =
            localStorage.getItem(
                "lastbench-identity"
            );

        if (existingIdentity) {
            setAnonymousName(existingIdentity);
            return;
        }

        const randomIdentity =
            anonymousNames[
            Math.floor(
                Math.random() *
                anonymousNames.length
            )
            ];

        localStorage.setItem(
            "lastbench-identity",
            randomIdentity
        );

        setAnonymousName(randomIdentity);
    }

    async function fetchColleges() {
        const { data, error } = await supabase
            .from("colleges")
            .select("*")
            .order("name");

        if (error) {
            console.log(error);
        } else if (data) {
            setColleges(data);
        }
    }

    async function fetchCategories() {
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("name");

        if (error) {
            console.log(error);
        } else if (data) {
            setCategories(data);
        }
    }

    async function createPost() {
        if (
            !content ||
            !collegeId ||
            !categoryId
        ) {
            alert("Please fill all fields");
            return;
        }
        setLoading(true);
        const { error } = await supabase
            .from("posts")
            .insert([
                {
                    content,
                    college_id: collegeId,
                    category_id: categoryId,
                    anonymous_name: anonymousName,
                },
            ]);

        if (error) {
            console.log(error);
            alert("Something went wrong");
        } else {
            setTimeout(() => {
                router.push("/feed");
            }, 700);
        }
    }

    return (
        <>
            <AmbientBackground />

            <main className="min-h-screen bg-black/70 text-white px-6 py-10">
                <div className="max-w-2xl mx-auto">

                    <div className="mb-8">

                        <p className="text-sm text-zinc-500 mb-3">
                            You are posting as
                        </p>

                        <div className="inline-flex items-center bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl">
                            <span className="text-zinc-300 font-medium">
                                {anonymousName}
                            </span>
                        </div>

                    </div>

                    <h1 className="text-4xl font-bold mb-3">
                        Drop Your Thought
                    </h1>

                    <p className="text-zinc-500 mb-10">
                        For the thoughts that never reach the classroom.
                    </p>

                    <div className="space-y-5">

                        <textarea
                            placeholder="What's on your mind tonight?"
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 outline-none resize-none"
                        />

                        <select
                            value={collegeId}
                            onChange={(e) =>
                                setCollegeId(e.target.value)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
                        >
                            <option value="">
                                Select College
                            </option>

                            {colleges.map((college) => (
                                <option
                                    key={college.id}
                                    value={college.id}
                                >
                                    {college.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(e.target.value)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
                        >
                            <option value="">
                                Select Category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={createPost}
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-[1.01] transition disabled:opacity-70"
                        >
                            {loading
                                ? "Releasing your thought..."
                                : "Drop Your Thought"}
                        </button>

                    </div>
                </div>
            </main>
        </>
    );
}