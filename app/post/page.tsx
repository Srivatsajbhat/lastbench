"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type College = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

export default function PostPage() {
  const router = useRouter();

  const [content, setContent] = useState("");

  // relational ids
  const [collegeId, setCollegeId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [colleges, setColleges] = useState<College[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchColleges();
    fetchCategories();
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
    if (!content || !collegeId || !categoryId) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        content,
        college_id: collegeId,
        category_id: categoryId,
      },
    ]);

    if (error) {
      console.log(error);
      alert("Something went wrong");
    } else {
      router.push("/feed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">

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
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 outline-none resize-none"
          />

          <select
            value={collegeId}
            onChange={(e) => setCollegeId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
          >
            <option value="">Select College</option>

            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 outline-none"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={createPost}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-[1.01] transition"
          >
            Drop Your Thought
          </button>

        </div>
      </div>
    </main>
  );
}