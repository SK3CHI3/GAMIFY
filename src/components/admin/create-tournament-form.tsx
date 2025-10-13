'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Trophy } from 'lucide-react'
import { createTournament } from '@/app/actions/tournaments'
import { toast } from 'sonner'

export function CreateTournamentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entry_fee: '',
    max_slots: '8',
    format: 'single_elimination',
    mode: 'auto_schedule',
    start_date: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createTournament(formData)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tournament created successfully!')
        router.push('/admin/tournaments')
      }
    } catch {
      toast.error('Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  const slotOptions = [4, 8, 16, 32, 64]
  const prizePool = parseFloat(formData.entry_fee || '0') * parseInt(formData.max_slots)

  return (
    <Card className="glass-card border-none shadow-premium">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFB800]" />
              Tournament Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Friday Night Showdown"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Compete for the top prize in this exciting tournament..."
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Format & Mode */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Tournament Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_elimination">Single Elimination</SelectItem>
                  <SelectItem value="double_elimination">Double Elimination</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                {formData.format === 'single_elimination' 
                  ? 'Players are eliminated after one loss' 
                  : 'Players get a second chance in loser bracket'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Match Mode *</Label>
              <Select
                value={formData.mode}
                onValueChange={(value) => setFormData({ ...formData, mode: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto_schedule">Auto Schedule (24hr windows)</SelectItem>
                  <SelectItem value="realtime">Real-time (Players wait online)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                {formData.mode === 'auto_schedule'
                  ? 'Players have 24 hours to complete matches'
                  : 'Players compete immediately when paired'}
              </p>
            </div>
          </div>

          {/* Slots & Entry Fee */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_slots">Maximum Players *</Label>
              <Select
                value={formData.max_slots}
                onValueChange={(value) => setFormData({ ...formData, max_slots: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select slots" />
                </SelectTrigger>
                <SelectContent>
                  {slotOptions.map((slot) => (
                    <SelectItem key={slot} value={slot.toString()}>
                      {slot} Players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_fee">Entry Fee (KES) *</Label>
              <Input
                id="entry_fee"
                type="number"
                min="0"
                step="1"
                value={formData.entry_fee}
                onChange={(e) => setFormData({ ...formData, entry_fee: e.target.value })}
                placeholder="100"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date (Optional)</Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              disabled={loading}
            />
            <p className="text-xs text-gray-600">
              Leave empty to start immediately when slots fill
            </p>
          </div>

          {/* Prize Pool Preview */}
          <div className="glass p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Prize Pool Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Prize Pool:</span>
                <span className="font-bold text-[#00FF88]">KES {prizePool.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">1st Place (60%):</span>
                <span className="font-semibold">KES {(prizePool * 0.6).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">2nd Place (30%):</span>
                <span className="font-semibold">KES {(prizePool * 0.3).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">3rd Place (10%):</span>
                <span className="font-semibold">KES {(prizePool * 0.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white shadow-glow-green"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Tournament'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

