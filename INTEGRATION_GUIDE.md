# MATCHFY Integration Guide



This guide explains how to complete the pending integrations for M-PESA payments and WhatsApp notifications.



## Table of Contents

1. [M-PESA Payment Integration](#mpesa-payment-integration)

2. [Twilio WhatsApp Notifications](#twilio-whatsapp-notifications)

3. [Testing](#testing)



---



## M-PESA Payment Integration



### Prerequisites

- M-PESA Daraja API Account

- Paybill or Buy Goods Till Number

- Valid Kenyan business registration



### Step 1: Register with Safaricom Daraja



1. Go to https://developer.safaricom.co.ke/

2. Create an account and verify your email

3. Create a new app:

   - Name: MATCHFY Payments

   - Select: Lipa Na M-PESA Online

4. Note down your:

   - Consumer Key

   - Consumer Secret

   - Passkey (from Lipa Na M-PESA Online)

   - Shortcode (your Paybill/Till number)



### Step 2: Update Environment Variables



Add to `.env.local`:

```env

MPESA_CONSUMER_KEY=your_consumer_key

MPESA_CONSUMER_SECRET=your_consumer_secret

MPESA_PASSKEY=your_passkey

MPESA_SHORTCODE=your_shortcode

MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

MPESA_INITIATOR_NAME=your_initiator_name

MPESA_SECURITY_CREDENTIAL=your_security_credential

```



### Step 3: Create Callback API Route



Create `src/app/api/mpesa/callback/route.ts`:



```typescript

import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'



export async function POST(request: NextRequest) {

  const body = await request.json()

  

  const resultCode = body.Body.stkCallback.ResultCode

  const checkoutRequestId = body.Body.stkCallback.CheckoutRequestID

  

  if (resultCode === 0) {

    // Payment successful

    const metadata = body.Body.stkCallback.CallbackMetadata.Item

    const amount = metadata.find((item: any) => item.Name === 'Amount')?.Value

    const mpesaReceiptNumber = metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value

    const phoneNumber = metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value

    

    // Update registration payment status

    const supabase = await createClient()

    

    // Find registration by checkout request ID (store this when initiating payment)

    await supabase

      .from('registrations')

      .update({ 

        payment_status: 'paid',

        // Add payment metadata columns to track this

      })

      .eq('checkout_request_id', checkoutRequestId)

    

    // Send confirmation notification

  }

  

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

}

```



### Step 4: Integrate into Tournament Registration



Update `src/app/actions/tournaments.ts`:



```typescript

import { initiateMpesaPayment } from '@/lib/integrations/mpesa'



export async function registerForTournament(tournamentId: string) {

  // ... existing code

  

  // Initiate M-PESA payment

  const paymentResult = await initiateMpesaPayment({

    phoneNumber: user.phone.replace(/^0/, '254'), // Convert to 254XXX format

    amount: tournament.entry_fee,

    accountReference: tournamentId,

    transactionDesc: `Entry fee for ${tournament.name}`,

  })

  

  if (!paymentResult.success) {

    return { error: paymentResult.error }

  }

  

  // Store checkout request ID for callback matching

  await supabase

    .from('registrations')

    .update({ 

      checkout_request_id: paymentResult.checkoutRequestId 

    })

    .eq('id', registration.id)

  

  return { success: true, message: 'Check your phone for M-PESA prompt' }

}

```



### Step 5: Add Payment Status to Schema



Add to registrations table:

```sql

ALTER TABLE public.registrations

ADD COLUMN checkout_request_id TEXT,

ADD COLUMN mpesa_receipt_number TEXT,

ADD COLUMN payment_date TIMESTAMPTZ;

```



### Testing M-PESA



1. Use Sandbox environment first:

   - URL: `https://sandbox.safaricom.co.ke`

   - Test credentials provided in Daraja portal

2. Test phone number: 254708374149

3. Use test shortcode and passkey from sandbox

4. Monitor callback responses



---



## Twilio WhatsApp Notifications



### Step 1: Set Up Twilio Account



1. Go to https://www.twilio.com/

2. Sign up and verify your account

3. Navigate to WhatsApp section

4. Follow WhatsApp sandbox setup or request production approval



### Step 2: Get Credentials



1. From Twilio Console, get:

   - Account SID

   - Auth Token

   - WhatsApp Sandbox Number (or approved number)



### Step 3: Update Environment Variables



Add to `.env.local`:

```env

TWILIO_ACCOUNT_SID=your_account_sid

TWILIO_AUTH_TOKEN=your_auth_token

TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

```



### Step 4: Integrate into Actions



Update `src/app/actions/tournaments.ts`:



```typescript

import { notifyTournamentRegistration } from '@/lib/integrations/twilio'



export async function registerForTournament(tournamentId: string) {

  // ... registration logic

  

  // Send WhatsApp notification

  await notifyTournamentRegistration(

    user.phone,

    tournament.name,

    tournament.entry_fee

  )

  

  return { success: true }

}

```



Update `src/app/actions/matches.ts`:



```typescript

import { 

  notifyMatchAssignment,

  notifyMatchResult,

  notifyDispute 

} from '@/lib/integrations/twilio'



async function advanceToNextRound(matchId: string, winnerId: string, format: string) {

  // ... existing logic

  

  // Notify both players about next match

  if (nextMatch?.player1_id && nextMatch?.player2_id) {

    const { data: player1 } = await supabase

      .from('profiles')

      .select('phone, full_name')

      .eq('id', nextMatch.player1_id)

      .single()

      

    const { data: player2 } = await supabase

      .from('profiles')

      .select('phone, full_name')

      .eq('id', nextMatch.player2_id)

      .single()

    

    if (player1 && player2) {

      await notifyMatchAssignment(player1.phone, player2.full_name, tournament.name)

      await notifyMatchAssignment(player2.phone, player1.full_name, tournament.name)

    }

  }

}

```



### Step 5: Set Up Notification Triggers



Create `src/lib/notification-scheduler.ts`:



```typescript

import { createClient } from '@/lib/supabase/server'

import { notifyMatchAssignment } from './integrations/twilio'



export async function scheduleMatchNotifications() {

  const supabase = await createClient()

  

  // Get all ongoing matches that started in last 5 minutes

  const { data: recentMatches } = await supabase

    .from('matches')

    .select('*, player1:player1_id(*), player2:player2_id(*), tournament:tournaments(*)')

    .eq('status', 'ongoing')

    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

  

  for (const match of recentMatches || []) {

    await notifyMatchAssignment(

      match.player1.phone,

      match.player2.full_name,

      match.tournament.name

    )

    

    await notifyMatchAssignment(

      match.player2.phone,

      match.player1.full_name,

      match.tournament.name

    )

  }

}

```



### Testing WhatsApp



1. **Sandbox Testing:**

   - Join sandbox by sending "join <sandbox-code>" to Twilio sandbox number

   - Test with your own phone number

   - Messages will show "sent via sandbox"



2. **Production:**

   - Submit WhatsApp Business Profile for approval

   - Get approved message templates

   - Use approved phone number



---



## Testing



### Local Testing



1. Use ngrok to expose local server:

```bash

ngrok http 3000

```



2. Update M-PESA callback URL to ngrok URL:

```

https://your-ngrok-url.ngrok.io/api/mpesa/callback

```



3. Test payment flow:

   - Register for tournament

   - Check M-PESA prompt on phone

   - Verify callback received

   - Confirm registration updated



### Production Checklist



- [ ] Switch from sandbox to production M-PESA

- [ ] Update callback URLs to production domain

- [ ] Get WhatsApp Business approval

- [ ] Set up monitoring for failed payments

- [ ] Configure retry logic for notifications

- [ ] Add payment reconciliation system

- [ ] Set up admin alerts for payment issues

- [ ] Test payout flow thoroughly

- [ ] Verify all notification triggers

- [ ] Monitor API rate limits



---



## Support



For integration issues:

- M-PESA: support@safaricom.co.ke

- Twilio: https://www.twilio.com/help



For MATCHFY specific questions:

- GitHub Issues

- support@matchfy.com




Add to `.env.local`:

```env

TWILIO_ACCOUNT_SID=your_account_sid

TWILIO_AUTH_TOKEN=your_auth_token

TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

```



### Step 4: Integrate into Actions



Update `src/app/actions/tournaments.ts`:



```typescript

import { notifyTournamentRegistration } from '@/lib/integrations/twilio'



export async function registerForTournament(tournamentId: string) {

  // ... registration logic

  

  // Send WhatsApp notification

  await notifyTournamentRegistration(

    user.phone,

    tournament.name,

    tournament.entry_fee

  )

  

  return { success: true }

}

```



Update `src/app/actions/matches.ts`:



```typescript

import { 

  notifyMatchAssignment,

  notifyMatchResult,

  notifyDispute 

} from '@/lib/integrations/twilio'



async function advanceToNextRound(matchId: string, winnerId: string, format: string) {

  // ... existing logic

  

  // Notify both players about next match

  if (nextMatch?.player1_id && nextMatch?.player2_id) {

    const { data: player1 } = await supabase

      .from('profiles')

      .select('phone, full_name')

      .eq('id', nextMatch.player1_id)

      .single()

      

    const { data: player2 } = await supabase

      .from('profiles')

      .select('phone, full_name')

      .eq('id', nextMatch.player2_id)

      .single()

    

    if (player1 && player2) {

      await notifyMatchAssignment(player1.phone, player2.full_name, tournament.name)

      await notifyMatchAssignment(player2.phone, player1.full_name, tournament.name)

    }

  }

}

```



### Step 5: Set Up Notification Triggers



Create `src/lib/notification-scheduler.ts`:



```typescript

import { createClient } from '@/lib/supabase/server'

import { notifyMatchAssignment } from './integrations/twilio'



export async function scheduleMatchNotifications() {

  const supabase = await createClient()

  

  // Get all ongoing matches that started in last 5 minutes

  const { data: recentMatches } = await supabase

    .from('matches')

    .select('*, player1:player1_id(*), player2:player2_id(*), tournament:tournaments(*)')

    .eq('status', 'ongoing')

    .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

  

  for (const match of recentMatches || []) {

    await notifyMatchAssignment(

      match.player1.phone,

      match.player2.full_name,

      match.tournament.name

    )

    

    await notifyMatchAssignment(

      match.player2.phone,

      match.player1.full_name,

      match.tournament.name

    )

  }

}

```



### Testing WhatsApp



1. **Sandbox Testing:**

   - Join sandbox by sending "join <sandbox-code>" to Twilio sandbox number

   - Test with your own phone number

   - Messages will show "sent via sandbox"



2. **Production:**

   - Submit WhatsApp Business Profile for approval

   - Get approved message templates

   - Use approved phone number



---



## Testing



### Local Testing



1. Use ngrok to expose local server:

```bash

ngrok http 3000

```



2. Update M-PESA callback URL to ngrok URL:

```

https://your-ngrok-url.ngrok.io/api/mpesa/callback

```



3. Test payment flow:

   - Register for tournament

   - Check M-PESA prompt on phone

   - Verify callback received

   - Confirm registration updated



### Production Checklist



- [ ] Switch from sandbox to production M-PESA

- [ ] Update callback URLs to production domain

- [ ] Get WhatsApp Business approval

- [ ] Set up monitoring for failed payments

- [ ] Configure retry logic for notifications

- [ ] Add payment reconciliation system

- [ ] Set up admin alerts for payment issues

- [ ] Test payout flow thoroughly

- [ ] Verify all notification triggers

- [ ] Monitor API rate limits



---



## Support



For integration issues:

- M-PESA: support@safaricom.co.ke

- Twilio: https://www.twilio.com/help



For MATCHFY specific questions:

- GitHub Issues

- support@matchfy.com




