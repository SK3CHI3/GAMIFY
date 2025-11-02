# Payment Integration Documentation

## Overview

The GOALDEN platform uses **IntaSend** for handling tournament entry fee payments through M-PESA. The integration uses IntaSend's inline button SDK which provides a seamless payment experience for players.

## Technology Stack

- **Payment Provider**: IntaSend (https://intasend.com)
- **Integration Method**: Inline Button SDK
- **Supported Methods**: M-PESA STK Push
- **Documentation**: https://developers.intasend.com/docs/payment-button

## Architecture

### Components

1. **RegisterButton** (`src/components/tournaments/register-button.tsx`)
   - Main payment UI component
   - Handles payment flow initiation
   - Integrates with IntaSend inline button

2. **Tournament Registration Flow** (`src/app/actions/tournaments.ts`)
   - Server action that creates registration after successful payment
   - Updates tournament participant count

### Data Flow

```
User clicks "Pay & Register"
    ↓
RegisterButton loads IntaSend SDK
    ↓
IntaSend payment modal appears
    ↓
User completes M-PESA payment
    ↓
IntaSend emits 'COMPLETE' event
    ↓
registerForTournament() creates DB entry
    ↓
User registered for tournament
```

## Implementation Details

### Environment Variables

Required environment variables for IntaSend integration:

```env
# IntaSend Configuration
NEXT_PUBLIC_INTASEND_PUBLIC_KEY=your_publishable_key_here
NEXT_PUBLIC_INTASEND_LIVE=false  # Set to 'true' for production

# Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Obtaining API Keys**:
- Sandbox/Test: https://sandbox.intasend.com/ (No sign-up needed for testing)
- Production: Sign up at https://intasend.com and generate keys from your dashboard

### Payment Button Configuration

The IntaSend payment button is configured with the following data attributes:

| Attribute | Description | Example Value |
|-----------|-------------|---------------|
| `data-amount` | Entry fee amount | `100` |
| `data-currency` | Currency code | `KES` |
| `data-email` | Player's email | `user@example.com` |
| `data-phone_number` | Player's phone | `254712345678` |
| `data-first_name` | Player's first name | `John` |
| `data-last_name` | Player's last name | `Doe` |
| `data-api_ref` | Tournament reference | `tournament_abc123` |
| `data-comment` | Payment description | `Tournament registration` |
| `data-method` | Payment method | `M-PESA` |
| `data-redirect_url` | Success redirect | `https://your-domain.com/dashboard/tournaments/{id}` |

### Code Implementation

#### 1. TypeScript Type Definitions

Located at `src/types/global.d.ts`:

```typescript
interface IntaSendEventHandlers {
  on(event: 'COMPLETE', handler: (results: any) => void): this
  on(event: 'FAILED', handler: (results: any) => void): this
  on(event: 'IN-PROGRESS', handler: (results?: any) => void): this
}

interface IntaSendConfig {
  publicAPIKey: string
  live: boolean
}

declare global {
  interface Window {
    IntaSend: new (config: IntaSendConfig) => IntaSend
  }
}
```

#### 2. RegisterButton Component

Key features:
- Dynamically loads IntaSend SDK script
- Pre-fills user data (email, phone, name)
- Handles payment success/failure events
- Automatically registers user after successful payment

**Usage**:
```tsx
<RegisterButton 
  tournamentId={tournament.id} 
  entryFee={tournament.entry_fee} 
/>
```

#### 3. Payment Flow Events

**COMPLETE**: Payment successful
- Triggers `registerForTournament()` server action
- Updates tournament participant count
- Redirects user to tournament page

**FAILED**: Payment failed
- Shows error toast notification
- User can retry payment

**IN-PROGRESS**: Payment in progress
- Logged to console for debugging
- No user action required

### Database Schema

The registration flow updates the following tables:

**registrations**:
- `tournament_id`: Tournament reference
- `user_id`: Player reference
- `status`: 'confirmed' or 'waitlist'
- `payment_status`: 'paid' (set after IntaSend confirmation)

**tournaments**:
- `current_players`: Updated count after successful registration

## User Experience Flow

### Step 1: Initiating Payment
1. User clicks "Pay & Register" button on tournament page
2. RegisterButton fetches user profile data
3. IntaSend SDK script loads dynamically
4. Payment modal appears with pre-filled user information

### Step 2: Payment Processing
1. User selects M-PESA as payment method
2. IntaSend initiates M-PESA STK Push
3. User receives prompt on their phone
4. User enters M-PIN to authorize payment
5. Payment processes through IntaSend gateway

### Step 3: Registration Confirmation
1. IntaSend emits 'COMPLETE' event
2. Application calls `registerForTournament()` server action
3. Registration created in database
4. Success toast displayed to user
5. Tournament page refreshes with updated registration status

## Security Considerations

### Payment Security
- ✅ Uses IntaSend's secure payment gateway
- ✅ All transactions processed on IntaSend servers
- ✅ No sensitive payment data stored in application
- ✅ Uses HTTPS in production
- ✅ API keys stored in environment variables

### Data Security
- ✅ User data pre-filled but validated by IntaSend
- ✅ Phone numbers formatted correctly (254XXXXXXXXX)
- ✅ Unique `api_ref` per registration for tracking
- ✅ Server-side validation of registration

### Error Handling
- ✅ Failed payments logged but not stored
- ✅ User can retry failed payments
- ✅ Clear error messages for users
- ✅ No duplicate registrations on failed payments

## Testing

### Sandbox Environment

IntaSend provides a sandbox environment for testing:

1. Get sandbox public key from https://sandbox.intasend.com/
2. Set `NEXT_PUBLIC_INTASEND_LIVE=false`
3. Use test M-PESA numbers provided by IntaSend
4. Test various payment scenarios:
   - Successful payment
   - Failed payment
   - Payment timeout
   - Insufficient funds

### Testing Checklist

- [ ] Payment modal loads correctly
- [ ] User data pre-filled in payment form
- [ ] M-PESA STK Push received on test phone
- [ ] Successful payment creates registration
- [ ] Failed payment shows error message
- [ ] Registration status updates correctly
- [ ] Redirect works after payment
- [ ] Duplicate payment attempts prevented

## Production Deployment

### Pre-Launch Checklist

1. **API Keys**:
   - [ ] Obtain production IntaSend publishable key
   - [ ] Set `NEXT_PUBLIC_INTASEND_LIVE=true`
   - [ ] Verify API key in production environment

2. **Configuration**:
   - [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
   - [ ] Verify SSL certificate installed
   - [ ] Test redirect URLs

3. **Monitoring**:
   - [ ] Set up IntaSend webhook for server-side confirmation
   - [ ] Configure error logging
   - [ ] Set up transaction monitoring

### Webhooks (Optional)

For enhanced payment confirmation, IntaSend supports webhooks:

1. Configure webhook URL in IntaSend dashboard
2. Create webhook handler route
3. Verify payment status server-side
4. Update database accordingly

Example webhook endpoint:
```typescript
// src/app/api/webhooks/intasend/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  // Verify webhook signature
  // Update payment status in database
  // Notify user of payment confirmation
}
```

## Troubleshooting

### Common Issues

**Issue**: Payment button doesn't appear
- **Solution**: Check IntaSend SDK script loaded
- **Debug**: Check browser console for script errors
- **Fix**: Verify `NEXT_PUBLIC_INTASEND_PUBLIC_KEY` is set

**Issue**: M-PESA prompt not received
- **Solution**: Verify phone number format (254XXXXXXXXX)
- **Debug**: Check IntaSend dashboard for failed STK requests
- **Fix**: Ensure phone number starts with country code

**Issue**: Payment succeeds but registration fails
- **Solution**: Check server-side error logs
- **Debug**: Verify database permissions
- **Fix**: Ensure RLS policies allow registration creation

**Issue**: Duplicate registrations
- **Solution**: Check existing registrations before creating new one
- **Debug**: Verify `registerForTournament()` validation
- **Fix**: Add database unique constraint

## Future Enhancements

### Planned Features
- [ ] Support for card payments alongside M-PESA
- [ ] Webhook integration for real-time payment confirmation
- [ ] Refund functionality for canceled tournaments
- [ ] Payment history for users
- [ ] Admin payment dashboard

### Alternative Payment Methods
IntaSend supports additional payment methods that can be added:
- Card payments
- Bank transfers
- Airtel Money
- Tigo Pesa

To add these, update the `data-method` attribute in RegisterButton.

## References

- IntaSend Documentation: https://developers.intasend.com/docs/payment-button
- IntaSend Sandbox: https://sandbox.intasend.com/
- IntaSend Support: https://intasend.com/support
- API Reference: https://developers.intasend.com/reference

## Support

For payment integration issues:
- Check IntaSend dashboard for transaction logs
- Review browser console for client errors
- Check server logs for registration errors
- Contact IntaSend support for payment gateway issues

---

**Last Updated**: 2024-01-XX  
**Version**: 1.0  
**Maintained By**: GOALDEN Development Team

