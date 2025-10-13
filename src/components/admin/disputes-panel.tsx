import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function DisputesPanel({ disputes }: { disputes: Tables<'disputes'>[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pending Disputes</h2>
        <Link href="/admin/disputes">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {disputes.length > 0 ? (
          disputes.map((dispute) => (
            <Link key={dispute.id} href={`/admin/disputes/${dispute.id}`}>
              <div className="p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-all animate-smooth cursor-pointer border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">Match Dispute</h3>
                      <Badge variant="destructive">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Score mismatch detected
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600">No pending disputes</p>
          </div>
        )}
      </div>
    </div>
  )
}

