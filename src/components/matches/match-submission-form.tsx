'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { submitMatchResult } from '@/app/actions/matches'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface MatchSubmissionFormProps {
  matchId: string
  isPlayer1: boolean
  opponentName: string
}

export function MatchSubmissionForm({ matchId, isPlayer1, opponentName }: MatchSubmissionFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  function handleFileSelect(file: File | null) {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setScreenshot(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!screenshot) {
      toast.error('Please upload a screenshot')
      return
    }

    if (!score || isNaN(parseInt(score))) {
      toast.error('Please enter a valid score')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('matchId', matchId)
    formData.append('isPlayer1', isPlayer1.toString())
    formData.append('score', score)
    formData.append('screenshot', screenshot)

    const result = await submitMatchResult(formData)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Match result submitted!')
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="score">Your Score</Label>
        <Input
          id="score"
          type="number"
          min="0"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="e.g., 3"
          required
          disabled={loading}
          className="text-2xl font-bold text-center"
        />
        <p className="text-sm text-gray-600">
          Enter the number of goals you scored against {opponentName}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Match Screenshot *</Label>
        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Screenshot preview" 
                className="w-full rounded-lg border-2 border-[#00FF88]"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setScreenshot(null)
                  setPreviewUrl('')
                }}
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
              <div className="space-y-2">
                <div className="flex justify-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  
                  {/* Mobile camera capture */}
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.capture = 'environment'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          handleFileSelect(file || null)
                        }
                        input.click()
                      }}
                      disabled={loading}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  Upload or take a photo of the final score screen
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Make sure the screenshot clearly shows the final score. 
          If your score doesn&apos;t match your opponent&apos;s, an admin will review both submissions.
        </p>
      </div>

      <Button
        type="submit"
        disabled={loading || !screenshot || !score}
        className="w-full gradient-primary text-white font-bold py-6 text-lg shadow-glow-green"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Result'
        )}
      </Button>
    </form>
  )
}

