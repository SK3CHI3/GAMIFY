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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50/30 to-blue-100/50">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative min-h-screen">
        {children}
      </div>
    </div>
  )
}

