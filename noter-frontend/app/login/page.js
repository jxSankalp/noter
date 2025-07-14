"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token")) router.push("/notes");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      router.push("/notes");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold">Sign In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
