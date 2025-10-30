'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Trophy, Upload, Image as ImageIcon } from 'lucide-react'
import { createTournament } from '@/app/actions/tournaments'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const COLORS = {
  primary: '#1e3a8a',
  secondary: '#fbbf24'
}

export function CreateTournamentForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entry_fee: '',
    max_slots: '8',
    format: 'single_elimination',
    mode: 'auto_schedule',
    start_date: '',
    poster_url: '',
  })

  async function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `tournaments/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('tournament-media')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        toast.error('Failed to upload poster')
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tournament-media')
        .getPublicUrl(fileName)

      setFormData({ ...formData, poster_url: publicUrl })
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      toast.success('Poster uploaded successfully!')
    } catch (error) {
      console.error('Error uploading poster:', error)
      toast.error('Failed to upload poster')
    } finally {
      setUploading(false)
    }
  }

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
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.primary }}>
              <Trophy className="w-5 h-5" style={{ color: COLORS.secondary }} />
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
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
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
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            {/* Poster Upload */}
            <div className="space-y-2">
              <Label htmlFor="poster">Tournament Poster (Optional)</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="poster"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePosterUpload}
                  className="hidden"
                  disabled={uploading || loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  className="border-gray-300 hover:border-blue-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Poster
                    </>
                  )}
                </Button>
                {formData.poster_url && !uploading && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Poster uploaded
                  </span>
                )}
              </div>
              {posterPreview && (
                <div className="mt-3">
                  <img 
                    src={posterPreview} 
                    alt="Poster preview" 
                    className="w-full max-w-md rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
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
                <SelectTrigger className="border-gray-300 focus:border-blue-600">
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
                <SelectTrigger className="border-gray-300 focus:border-blue-600">
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
                <SelectTrigger className="border-gray-300 focus:border-blue-600">
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
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
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
              className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            />
            <p className="text-xs text-gray-600">
              Leave empty to start immediately when slots fill
            </p>
          </div>

          {/* Prize Pool Preview */}
          <div className="p-4 rounded-lg space-y-2" style={{ backgroundColor: 'rgba(30, 58, 138, 0.05)', border: '1px solid rgba(30, 58, 138, 0.1)' }}>
            <h4 className="font-semibold" style={{ color: COLORS.primary }}>Prize Pool Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Prize Pool:</span>
                <span className="font-bold" style={{ color: '#10b981' }}>KES {prizePool.toFixed(2)}</span>
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
              className="flex-1 border-gray-300 hover:bg-gray-50"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white shadow-lg"
              style={{ 
                backgroundColor: COLORS.primary,
                backgroundImage: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`
              }}
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
