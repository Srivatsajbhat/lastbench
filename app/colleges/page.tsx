"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import  AmbientBackground from "@/components/AmbientBackground";

type College = {
    id: string;
    name: string;
};

export default function CollegesPage() {
    const [colleges, setColleges] = useState<
        College[]
    >([]);

    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchColleges();
    }, []);

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

    const filteredColleges =
        colleges.filter((college) =>
            college.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    return (
        <>
            <AmbientBackground />
            <main className="min-h-screen bg-black/70 text-white px-6 py-10">

                <div className="max-w-3xl mx-auto">

                    <div className="mb-10">

                        <Link
                            href="/feed"
                            className="text-zinc-500 hover:text-white transition text-sm"
                        >
                            ← Back to Feed
                        </Link>

                        <h1 className="text-4xl font-bold mt-4">
                            Explore Campuses
                        </h1>

                        <p className="text-zinc-500 mt-2">
                            Find thoughts from your college.
                        </p>

                    </div>

                    <div className="mb-8">

                        <input
                            type="text"
                            placeholder="Search your college..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none"
                        />

                    </div>

                    <div className="grid gap-4">

                        {filteredColleges.length === 0 ? (
                            <div className="text-center py-24">

                                <div className="text-5xl mb-5">
                                    🎓
                                </div>

                                <h2 className="text-2xl font-semibold mb-3">
                                    No colleges found
                                </h2>

                                <p className="text-zinc-500">
                                    Try searching with a different name.
                                </p>

                            </div>
                        ) : (
                            filteredColleges.map((college) => (
                                <Link
                                    key={college.id}
                                    href={`/college/${college.id}`}
                                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:scale-[1.01] transition"
                                >
                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {college.name}
                                            </h2>

                                            <p className="text-zinc-500 text-sm mt-2">
                                                Enter campus feed
                                            </p>
                                        </div>

                                        <div className="text-2xl">
                                            →
                                        </div>

                                    </div>
                                </Link>
                            ))
                        )}

                    </div>

                </div>

            </main>
        </>
    );
}