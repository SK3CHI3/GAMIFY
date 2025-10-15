import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  // Redirect admin users to admin dashboard
  if (user.role === 'admin') {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-white to-yellow-100/40">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200/5 via-transparent to-yellow-200/5" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative min-h-screen">
        {children}
      </div>
    </div>
  )
}

