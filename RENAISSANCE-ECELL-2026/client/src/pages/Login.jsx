import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import ContactFooter from "../components/ContactFooter";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim() && password.trim()) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center px-4 pb-12 pt-28 text-[#F4EBD9]">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-[#C5A25F]/30 bg-[#020610]/85 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A25F]/15 text-[#C5A25F]">
          <LogIn className="h-5 w-5" />
        </div>
        <h1 className="font-cinzel text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-[#94A3B8]">Access your Renaissance participant dashboard.</p>
        <label className="mt-7 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 w-full rounded-xl border border-[#C5A25F]/20 bg-[#041021] px-4 py-3 text-sm text-white outline-none focus:border-[#C5A25F]" />
        </label>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required className="mt-2 w-full rounded-xl border border-[#C5A25F]/20 bg-[#041021] px-4 py-3 text-sm text-white outline-none focus:border-[#C5A25F]" />
        </label>
        <button type="submit" className="mt-6 w-full rounded-xl bg-[#C5A25F] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#020610] transition hover:bg-[#E1C276]">Continue</button>
        </form>
      </main>

      <ContactFooter />
    </>
  );
}
