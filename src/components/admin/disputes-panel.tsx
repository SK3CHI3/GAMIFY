import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function DisputesPanel({ disputes }: { disputes: Tables<'disputes'>[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Pending Disputes</h2>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-3">
        {disputes.length > 0 ? (
          disputes.map((dispute) => (
            <div key={dispute.id} className="p-4 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">Match Dispute</h3>
                    <Badge className="bg-red-600 text-white text-xs">Pending</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Score mismatch detected - Requires review
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(dispute.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7 text-green-600" />
            </div>
            <p className="text-gray-900 font-medium mb-1">All Clear!</p>
            <p className="text-sm text-gray-600">No pending disputes to resolve</p>
          </div>
        )}
      </div>
    </div>
  )
}

