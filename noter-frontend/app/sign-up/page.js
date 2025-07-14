"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      router.push("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-1 items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full"
          onChange={handleChange}
        />
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
          Sign Up
        </button>
      </form>
    </div>
  );
}
