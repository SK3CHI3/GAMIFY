/**
 * M-PESA Daraja API Integration
 * 
 * This file provides functions to integrate M-PESA payments for tournament entry fees
 * and prize payouts. Follow the setup guide below to complete the integration.
 * 
 * Setup Guide:
 * 1. Register for M-PESA Daraja API at https://developer.safaricom.co.ke/
 * 2. Create a Lipa Na M-PESA Online app
 * 3. Get your Consumer Key, Consumer Secret, and Passkey
 * 4. Configure your Paybill or Buy Goods Till Number
 * 5. Set up callback URLs for payment confirmations
 * 
 * Environment Variables Required:
 * - MPESA_CONSUMER_KEY
 * - MPESA_CONSUMER_SECRET
 * - MPESA_PASSKEY
 * - MPESA_SHORTCODE
 * - MPESA_CALLBACK_URL
 * 
 * Documentation: https://developer.safaricom.co.ke/docs
 */

interface MpesaPaymentRequest {
  phoneNumber: string // Format: 254XXXXXXXXX
  amount: number
  accountReference: string // Tournament ID
  transactionDesc: string
}

interface MpesaPaymentResponse {
  success: boolean
  merchantRequestId?: string
  checkoutRequestId?: string
  error?: string
}

/**
 * Get OAuth access token from M-PESA
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64')

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('M-PESA auth error:', error)
    return null
  }
}

/**
 * Initiate STK Push payment request
 * This triggers the M-PESA prompt on the user's phone
 */
export async function initiateMpesaPayment(
  request: MpesaPaymentRequest
): Promise<MpesaPaymentResponse> {
  try {
    const accessToken = await getAccessToken()
    
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate with M-PESA' }
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: request.amount,
          PartyA: request.phoneNumber,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: request.phoneNumber,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: request.accountReference,
          TransactionDesc: request.transactionDesc,
        }),
      }
    )

    const data = await response.json()

    if (data.ResponseCode === '0') {
      return {
        success: true,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
      }
    }

    return { success: false, error: data.ResponseDescription }
  } catch (error) {
    console.error('M-PESA payment error:', error)
    return { success: false, error: 'Payment initiation failed' }
  }
}

/**
 * Query payment status
 * Check if a payment has been completed
 */
export async function queryPaymentStatus(checkoutRequestId: string) {
  try {
    const accessToken = await getAccessToken()
    
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate' }
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        }),
      }
    )

    return await response.json()
  } catch (error) {
    console.error('Payment query error:', error)
    return { success: false, error: 'Query failed' }
  }
}

/**
 * Process B2C (Business to Customer) payment
 * Used for paying out prizes to winners
 */
export async function sendPrizePayment(
  phoneNumber: string,
  amount: number,
  remarks: string
) {
  try {
    const accessToken = await getAccessToken()
    
    if (!accessToken) {
      return { success: false, error: 'Failed to authenticate' }
    }

    const response = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          InitiatorName: process.env.MPESA_INITIATOR_NAME,
          SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
          CommandID: 'BusinessPayment',
          Amount: amount,
          PartyA: process.env.MPESA_SHORTCODE,
          PartyB: phoneNumber,
          Remarks: remarks,
          QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL}/timeout`,
          ResultURL: `${process.env.MPESA_CALLBACK_URL}/result`,
          Occasion: 'Tournament Prize',
        }),
      }
    )

    const data = await response.json()
    return {
      success: data.ResponseCode === '0',
      conversationId: data.ConversationID,
      originatorConversationId: data.OriginatorConversationID,
    }
  } catch (error) {
    console.error('B2C payment error:', error)
    return { success: false, error: 'Payout failed' }
  }
}

/**
 * Handle M-PESA callback
 * Process payment confirmations from M-PESA
 * 
 * Create an API route: src/app/api/mpesa/callback/route.ts
 * 
 * Example:
 * export async function POST(request: Request) {
 *   const body = await request.json()
 *   
 *   if (body.Body.stkCallback.ResultCode === 0) {
 *     // Payment successful
 *     const metadata = body.Body.stkCallback.CallbackMetadata.Item
 *     // Update registration payment_status to 'paid'
 *   }
 *   
 *   return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
 * }
 */

