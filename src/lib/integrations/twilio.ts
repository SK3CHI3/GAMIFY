/**
 * Twilio WhatsApp Integration
 * 
 * This file provides functions to send WhatsApp notifications via Twilio
 * for tournament updates, match assignments, and results.
 * 
 * Setup Guide:
 * 1. Create a Twilio account at https://www.twilio.com/
 * 2. Set up WhatsApp sandbox or get approved for production
 * 3. Get your Account SID and Auth Token
 * 4. Configure your WhatsApp-enabled phone number
 * 5. Test with sandbox number first
 * 
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_WHATSAPP_NUMBER (format: whatsapp:+14155238886)
 * 
 * Documentation: https://www.twilio.com/docs/whatsapp
 */

interface WhatsAppMessage {
  to: string // Format: +254XXXXXXXXX
  message: string
}


/**
 * Send a basic WhatsApp message
 */
export async function sendWhatsAppMessage(
  data: WhatsAppMessage
): Promise<{ success: boolean; messageSid?: string; error?: string }> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      return { success: false, error: 'Twilio credentials not configured' }
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:${data.to}`,
          Body: data.message,
        }),
      }
    )

    const result = await response.json()

    if (response.ok) {
      return {
        success: true,
        messageSid: result.sid,
      }
    }

    return {
      success: false,
      error: result.message || 'Failed to send message',
    }
  } catch (error) {
    console.error('WhatsApp send error:', error)
    return {
      success: false,
      error: 'Message sending failed',
    }
  }
}

/**
 * Tournament-specific notification templates
 */

export async function notifyTournamentRegistration(
  phoneNumber: string,
  tournamentName: string,
  entryFee: number
) {
  return await sendWhatsAppMessage({
    to: phoneNumber,
    message: `🎮 *GOALDEN Tournament*\n\nYou've successfully registered for *${tournamentName}*!\n\n💰 Entry Fee: KES ${entryFee}\n\nYou'll receive a notification when the tournament starts. Good luck! 🏆`,
  })
}

export async function notifyMatchAssignment(
  phoneNumber: string,
  opponentName: string,
  tournamentName: string
) {
  return await sendWhatsAppMessage({
    to: phoneNumber,
    message: `⚽ *Match Assignment*\n\n*${tournamentName}*\n\nYou've been matched against *${opponentName}*\n\nPlay your match and submit the result in the app.\n\nGood luck! 🔥`,
  })
}

export async function notifyMatchResult(
  phoneNumber: string,
  won: boolean,
  score: string,
  tournamentName: string
) {
  const message = won
    ? `🎉 *Victory!*\n\n*${tournamentName}*\n\nCongratulations! You won your match ${score}\n\nGet ready for the next round! 🏆`
    : `😔 *Match Result*\n\n*${tournamentName}*\n\nYou lost your match ${score}\n\nBetter luck next time! Keep practicing 💪`

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message,
  })
}

export async function notifyDispute(
  phoneNumber: string,
  tournamentName: string
) {
  return await sendWhatsAppMessage({
    to: phoneNumber,
    message: `⚠️ *Match Dispute*\n\n*${tournamentName}*\n\nThere's a score mismatch in your match. An admin is reviewing the screenshots.\n\nYou'll be notified once it's resolved.`,
  })
}

export async function notifyTournamentWin(
  phoneNumber: string,
  tournamentName: string,
  position: number,
  prizeAmount: number
) {
  const emojis = ['🥇', '🥈', '🥉']
  const emoji = emojis[position - 1] || '🏆'

  return await sendWhatsAppMessage({
    to: phoneNumber,
    message: `${emoji} *Tournament Complete!*\n\n*${tournamentName}*\n\nCongratulations! You finished ${position === 1 ? '1st' : position === 2 ? '2nd' : '3rd'} place!\n\n💰 Prize: KES ${prizeAmount}\n\nYour prize will be sent to your M-PESA shortly. 🎉`,
  })
}

export async function notifyPrizePayment(
  phoneNumber: string,
  amount: number,
  tournamentName: string
) {
  return await sendWhatsAppMessage({
    to: phoneNumber,
    message: `💸 *Prize Payment*\n\nKES ${amount} has been sent to ${phoneNumber}\n\nTournament: ${tournamentName}\n\nThank you for playing GOALDEN! 🎮`,
  })
}

/**
 * Admin notifications
 */

export async function notifyAdminDispute(
  adminPhoneNumber: string,
  player1Name: string,
  player2Name: string,
  tournamentName: string
) {
  return await sendWhatsAppMessage({
    to: adminPhoneNumber,
    message: `🚨 *NEW DISPUTE*\n\n*${tournamentName}*\n\n${player1Name} vs ${player2Name}\n\nScore mismatch detected. Please review in the admin panel.`,
  })
}

/**
 * Bulk notifications
 */

export async function sendBulkNotifications(
  recipients: Array<{ phoneNumber: string; message: string }>
): Promise<Array<{ phoneNumber: string; success: boolean; error?: string }>> {
  const results = await Promise.all(
    recipients.map(async (recipient) => {
      const result = await sendWhatsAppMessage({
        to: recipient.phoneNumber,
        message: recipient.message,
      })

      return {
        phoneNumber: recipient.phoneNumber,
        success: result.success,
        error: result.error,
      }
    })
  )

  return results
}

/**
 * Usage Example:
 * 
 * // In your tournament actions
 * import { notifyTournamentRegistration } from '@/lib/integrations/twilio'
 * 
 * export async function registerForTournament(tournamentId: string) {
 *   // ... registration logic
 *   
 *   await notifyTournamentRegistration(
 *     user.phone,
 *     tournament.name,
 *     tournament.entry_fee
 *   )
 * }
 */

