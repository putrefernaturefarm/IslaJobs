export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F4F1] flex flex-col">
      {children}
    </div>
  )
}
