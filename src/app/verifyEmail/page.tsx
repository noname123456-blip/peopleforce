'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    // Get user ID from URL query parameter (from email link)
    const id = searchParams.get('id')
    if (id) {
      setUserId(id)
    } else {
      setError('User ID not found. Please use the link from your email.')
    }
  }, [searchParams])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value)
    setError('')
    setSuccess('')
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) {
      setError('User ID is required. Please use the link from your email.')
      return
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/user/verifyEmail/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otp,
          id: userId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'OTP verification failed')
        setLoading(false)
        return
      }

      setSuccess(data.message || 'Email verified successfully!')
      setLoading(false)

      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push('/Login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!userId) {
      setError('User ID is required. Please use the link from your email.')
      return
    }

    setError('')
    setSuccess('')
    setResendLoading(true)

    try {
      const response = await fetch('/api/user/verifyEmail/resendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to resend OTP')
        setResendLoading(false)
        return
      }

      setSuccess(data.message || 'OTP resent successfully. Please check your email.')
      setResendLoading(false)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setResendLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleVerifyOtp}>
        <div>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            placeholder="000000"
            required
          />
        </div>

        {error && <div>{error}</div>}
        {success && <div>{success}</div>}

        <button type="submit" disabled={loading || !userId}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div>
        <button 
          type="button" 
          onClick={handleResendOtp} 
          disabled={resendLoading || !userId}
        >
          {resendLoading ? 'Sending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  )
}
