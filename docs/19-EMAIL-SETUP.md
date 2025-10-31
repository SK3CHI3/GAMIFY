# Email Confirmation Setup Guide

This guide will help you configure email confirmations to use your deployed Netlify URL instead of localhost.

## What's Been Done

✅ Updated `src/app/actions/auth.ts` to include `emailRedirectTo` parameter
✅ Created auth callback route at `src/app/auth/callback/route.ts`
✅ Created error page at `src/app/auth/auth-code-error/page.tsx`
✅ Added `NEXT_PUBLIC_SITE_URL` to your `.env` file

## Steps to Complete Setup

### 1. Configure Supabase Dashboard

Go to your Supabase project's URL Configuration page:

**Direct Link:** https://supabase.com/dashboard/project/nbmokkozxorqwypjvzye/auth/url-configuration

Configure the following:

#### Site URL
```
https://goalden-preview.netlify.app
```

#### Additional Redirect URLs (add all of these):
```
https://goalden-preview.netlify.app/**
https://**--goalden-preview.netlify.app/**
http://localhost:3000/**
```

### 2. Configure Netlify Environment Variables

In your Netlify dashboard, add this environment variable:

**Variable Name:** `NEXT_PUBLIC_SITE_URL`
**Value:** `https://goalden-preview.netlify.app`

#### How to add in Netlify:
1. Go to: https://app.netlify.com/sites/goalden-preview/configuration/env
2. Click "Add a variable"
3. Add the variable name and value
4. Click "Save"
5. Redeploy your site

### 3. Update Email Templates with GOALDEN Branding

In your Supabase Dashboard, go to:
**Authentication** → **Email Templates**

We've created professional, branded email templates that match your GOALDEN blue and gold theme!

#### 🎨 Brand Colors Used:
- **Primary Blue**: `#1e3a8a` → `#1e40af` (gradient header)
- **Accent Gold**: `#fbbf24` → `#f59e0b` (CTA buttons)
- **Light Blue**: `#dbeafe` → `#bfdbfe` (info boxes)

---

#### Template 1: Confirm Signup (Required)

Go to **Authentication** → **Email Templates** → **Confirm signup**

**Subject:** `Confirm Your GOALDEN Account`

**Content:** Copy and paste this complete HTML template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your GOALDEN Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #172554 100%);">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header with Logo and Branding -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px 16px 0 0;">
                            <img src="https://goalden-preview.netlify.app/images/GOALDEN%20LOGO/GOALDEN_logo.png" alt="GOALDEN Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
                            <h1 style="margin: 0; color: #fbbf24; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                Welcome to GOALDEN
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">
                                Kenya's Premier Gaming Tournament Platform
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Confirm Your Email Address
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for joining GOALDEN! You're just one step away from competing in exciting gaming tournaments and winning real prizes.
                            </p>

                            <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Click the button below to verify your email address and activate your account:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/dashboard" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e3a8a; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4); text-shadow: 0 1px 2px rgba(255,255,255,0.3);">
                                            ⚡ Confirm Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all; font-size: 12px; color: #6b7280; text-align: center;">
                                {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/dashboard
                            </p>

                            <!-- Security Notice -->
                            <div style="margin-top: 32px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    <strong>⚠️ Security Notice:</strong> This link will expire in 24 hours. If you didn't create a GOALDEN account, you can safely ignore this email.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- What's Next Section -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="padding: 24px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; border: 2px solid #3b82f6;">
                                <h3 style="margin: 0 0 16px 0; color: #1e40af; font-size: 18px; font-weight: 600;">
                                    🎮 What's Next?
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8; font-weight: 500;">
                                    <li>Browse active gaming tournaments</li>
                                    <li>Join competitions and compete with players across Kenya</li>
                                    <li>Win real cash prizes through M-PESA 💰</li>
                                    <li>Track your stats and climb the leaderboards 🏆</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">
                                            Follow us on social media
                                        </p>
                                        <div style="margin-bottom: 16px;">
                                            <a href="#" style="display: inline-block; margin: 0 8px; color: #fbbf24; text-decoration: none; font-weight: 600;">Twitter</a>
                                            <a href="#" style="display: inline-block; margin: 0 8px; color: #fbbf24; text-decoration: none; font-weight: 600;">Instagram</a>
                                            <a href="#" style="display: inline-block; margin: 0 8px; color: #fbbf24; text-decoration: none; font-weight: 600;">Facebook</a>
                                        </div>
                                        <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                                            © 2025 GOALDEN. All rights reserved.
                                        </p>
                                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                            Kenya's Premier Gaming Tournament Platform
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Support Info -->
                <table role="presentation" style="width: 600px; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; color: #9ca3af; font-size: 12px;">
                            <p style="margin: 0;">
                                Need help? Contact us at <a href="mailto:support@goalden.com" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@goalden.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

#### Template 2: Magic Link (Optional)

Go to **Authentication** → **Email Templates** → **Magic Link**

**Subject:** `Your GOALDEN Login Link`

**Content:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your GOALDEN Login Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #172554 100%);">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(30, 58, 138, 0.4);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px 16px 0 0;">
                            <img src="https://goalden-preview.netlify.app/images/GOALDEN%20LOGO/GOALDEN_logo.png" alt="GOALDEN Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
                            <h1 style="margin: 0; color: #fbbf24; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                🔐 Secure Login
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">
                                Access your GOALDEN account
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Your Magic Login Link
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Click the button below to securely log in to your GOALDEN account:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ .ConfirmationURL }}" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e3a8a; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4); text-shadow: 0 1px 2px rgba(255,255,255,0.3);">
                                            ⚡ Log In to GOALDEN
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <div style="margin-top: 32px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this login link, please ignore this email and secure your account.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                                © 2025 GOALDEN. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                Kenya's Premier Gaming Tournament Platform
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Support Info -->
                <table role="presentation" style="width: 600px; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; color: #9ca3af; font-size: 12px;">
                            <p style="margin: 0;">
                                Need help? <a href="mailto:support@goalden.com" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@goalden.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

#### Template 3: Reset Password (Optional)

Go to **Authentication** → **Email Templates** → **Reset Password**

**Subject:** `Reset Your GOALDEN Password`

**Content:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your GOALDEN Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #172554 100%);">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 24px rgba(30, 58, 138, 0.4);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 16px 16px 0 0;">
                            <img src="https://goalden-preview.netlify.app/images/GOALDEN%20LOGO/GOALDEN_logo.png" alt="GOALDEN Logo" style="width: 120px; height: auto; margin-bottom: 16px;">
                            <h1 style="margin: 0; color: #fbbf24; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                🔑 Password Reset
                            </h1>
                            <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">
                                Secure your GOALDEN account
                            </p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">
                                Reset Your Password
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your GOALDEN account. Click the button below to create a new password:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ .ConfirmationURL }}" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1e3a8a; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4); text-shadow: 0 1px 2px rgba(255,255,255,0.3);">
                                            ⚡ Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative Link -->
                            <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 8px 0 0 0; padding: 12px; background-color: #f3f4f6; border-radius: 6px; word-break: break-all; font-size: 12px; color: #6b7280; text-align: center;">
                                {{ .ConfirmationURL }}
                            </p>

                            <!-- Security Notice -->
                            <div style="margin-top: 32px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please secure your account immediately and contact support.
                                </p>
                            </div>

                            <!-- Didn't Request -->
                            <div style="margin-top: 24px; padding: 16px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 6px;">
                                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                                    <strong>🚨 Didn't request this?</strong> If you didn't request a password reset, someone may be trying to access your account. Please contact us immediately at <a href="mailto:support@goalden.com" style="color: #991b1b; font-weight: 600;">support@goalden.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                                © 2025 GOALDEN. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                Kenya's Premier Gaming Tournament Platform
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Support Info -->
                <table role="presentation" style="width: 600px; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; color: #9ca3af; font-size: 12px;">
                            <p style="margin: 0;">
                                Need help? <a href="mailto:support@goalden.com" style="color: #fbbf24; text-decoration: none; font-weight: 600;">support@goalden.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

#### ✨ Template Features:
- **🎨 GOALDEN Blue & Gold Branding** - Matches your app perfectly
- **⚡ Bold Gold CTA Buttons** - High visibility and engagement
- **🎮 Gaming Emojis** - Makes emails more fun and relatable
- **📱 Mobile Responsive** - Looks great on all devices
- **🔒 Security Warnings** - Professional and trustworthy
- **💎 Professional Design** - Premium gradients and shadows

### 4. Test the Flow

#### Local Testing (Development):
1. Make sure your `.env` has:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
2. Restart your dev server
3. Sign up with a new email
4. Check your email for the confirmation link
5. Click the link - it should redirect to `http://localhost:3000/auth/callback`

#### Production Testing (Netlify):
1. Deploy to Netlify with the environment variable set
2. Sign up with a new email on your Netlify site
3. Check your email for the confirmation link
4. Click the link - it should redirect to `https://goalden-preview.netlify.app/auth/callback`

## How It Works

1. **User signs up** → `signUp()` action includes `emailRedirectTo: ${siteUrl}/auth/callback`
2. **Supabase sends email** → Uses the Site URL configured in dashboard
3. **User clicks confirmation link** → Goes to `/auth/callback?code=...`
4. **Callback route exchanges code** → Creates user session
5. **User redirected to dashboard** → Logged in successfully!

## Troubleshooting

### Issue: "Invalid redirect URL"
- **Solution:** Make sure the URL is added to the "Additional Redirect URLs" in Supabase dashboard
- Check that the URL format matches exactly (including protocol and trailing wildcards)

### Issue: "Link expired or invalid"
- **Solution:** Links expire after 24 hours by default. User needs to request a new confirmation email
- You can adjust this in Supabase dashboard under Authentication → Settings

### Issue: Redirects to localhost in production
- **Solution:** Make sure `NEXT_PUBLIC_SITE_URL` is set in Netlify environment variables
- Redeploy your site after adding the variable

### Issue: Email not received
- **Solution:** Check your Supabase dashboard logs under Authentication → Logs
- Make sure email provider is configured correctly
- Check spam folder

## Environment Variables Summary

### Local Development (.env)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nbmokkozxorqwypjvzye.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Netlify)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://nbmokkozxorqwypjvzye.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://goalden-preview.netlify.app
```

## Next Steps

1. ✅ Complete Supabase dashboard configuration
2. ✅ Add environment variable to Netlify
3. ✅ Deploy to Netlify
4. ✅ Test the signup flow
5. ✅ Customize email templates if needed

---

**Need Help?**
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Redirect URLs Guide: https://supabase.com/docs/guides/auth/redirect-urls
- Email Templates: https://supabase.com/docs/guides/auth/auth-email-templates

