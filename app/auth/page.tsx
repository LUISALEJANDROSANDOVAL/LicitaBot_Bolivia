import { AuthScreen } from "@/components/licitabot/auth-screen"

// Force dynamic rendering so NextAuth CSRF tokens are always fresh
export const dynamic = "force-dynamic"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-200">
      <AuthScreen />
    </div>
  )
}
