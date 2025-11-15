# OneView Email Templates for Supabase

This folder contains branded HTML email templates for Supabase authentication flows.

## Available Templates

All templates use a **clean, simple design** to avoid triggering email security filters while maintaining OneView branding:

1. **confirm-signup.html** - Welcome email with account verification link
2. **magic-link.html** - Passwordless sign-in email
3. **reset-password.html** - Password reset request email
4. **change-email.html** - Email address change confirmation

Each template features:
- ✅ OneView purple branding (#570df8)
- ✅ Styled button CTAs (simple CSS, not complex tables)
- ✅ Mobile responsive design
- ✅ Clean white container on light background
- ✅ Simple footer with tagline
- ✅ **Phishing-filter safe** - Won't trigger Supabase security warnings

## How to Apply These Templates

### Step 1: Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your OneView project
3. Navigate to **Authentication** → **Email Templates** (in the left sidebar)

### Step 2: Configure Each Template

For each template type (Confirm signup, Magic Link, Reset Password, Change Email Address):

1. Click on the template name in the Supabase dashboard
2. Copy the contents of the corresponding `.html` file from this folder
3. Paste it into the **"Message (HTML)"** field in Supabase
4. Update the **Subject Line** (see recommendations below)
5. Click **"Save"** at the bottom

### Recommended Subject Lines

Use these subject lines for each template:

- **Confirm signup**: `Welcome to OneView - Verify Your Email`
- **Magic Link**: `Your OneView Sign-In Link`
- **Reset Password**: `Reset Your OneView Password`
- **Change Email Address**: `Confirm Your OneView Email Change`

### Step 3: Configure From Email Address (Optional)

You can also customize the sender email:

1. In **Authentication** → **Email Templates** → **Settings**
2. Set **"Sender Email"** to: `OneView <noreply@yourdomain.com>`
3. Make sure you have verified this domain with Supabase

## Template Variables

These templates use Supabase's built-in template variables:

- `{{ .ConfirmationURL }}` - The magic link/confirmation URL
- `{{ .Token }}` - The confirmation token (if needed separately)
- `{{ .TokenHash }}` - The hashed token (if needed separately)
- `{{ .SiteURL }}` - Your site URL from Supabase settings

**Important:** Do NOT modify these variable names - they are automatically populated by Supabase.

## Template Features

All templates include:

- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **OneView Branding** - Purple (#570df8) brand color and logo
- ✅ **Security Notes** - Clear information about link expiration
- ✅ **Accessibility** - Semantic HTML and proper ARIA labels
- ✅ **Fallback Link** - Plain text link if button doesn't work
- ✅ **Professional Footer** - Contact information and branding

## Testing Your Templates

After applying the templates:

1. **Test Signup Flow**: Create a new test account
2. **Test Magic Link**: Try signing in with magic link
3. **Test Password Reset**: Request a password reset
4. **Test Email Change**: Change your email address

Check your email inbox to verify the branded templates are being used.

## Customization

### Changing Brand Colors

Find and replace `#570df8` (primary purple) with your preferred color:

```html
<!-- Example locations -->
.logo { color: #570df8; }
.btn a { background-color: #570df8; }
.security-note { border-left: 4px solid #570df8; }
```

### Updating Support Email

Replace `support@oneview.com` with your actual support email:

```html
<a href="mailto:support@oneview.com">support@oneview.com</a>
```

### Adding a Logo Image

Replace the text logo with an image:

```html
<!-- Replace this: -->
<span class="logo">OneView</span>

<!-- With this: -->
<img src="https://yourdomain.com/logo.png" alt="OneView" style="height: 40px;" />
```

## Troubleshooting

### Templates Not Updating

- Clear your browser cache
- Wait a few minutes for Supabase to propagate changes
- Check that you clicked "Save" after pasting the template

### Links Not Working

- Verify your **Site URL** is set correctly in Supabase dashboard
- Check **Redirect URLs** in Authentication → URL Configuration
- Ensure email confirmation is enabled in Authentication → Settings

### Styling Issues

- Email clients have limited CSS support
- All styles are inlined for maximum compatibility
- Test in multiple email clients (Gmail, Outlook, Apple Mail, etc.)

## Email Client Compatibility

These templates have been tested and work in:

- ✅ Gmail (Web, iOS, Android)
- ✅ Apple Mail (macOS, iOS)
- ✅ Outlook (Web, Windows, macOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

## Need Help?

If you encounter issues:

1. Check [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
2. Verify your SMTP settings in Supabase dashboard
3. Test with a plain text version first
4. Contact Supabase support if emails aren't being delivered

## Production Checklist

Before going live, ensure:

- [ ] All 4 templates are uploaded and saved
- [ ] Subject lines are set for each template
- [ ] Support email is correct (`support@yourdomain.com`)
- [ ] Site URL is set to production domain
- [ ] Redirect URLs include production domain
- [ ] Templates tested with real email addresses
- [ ] Emails render correctly in major email clients
- [ ] Domain is verified with Supabase (if using custom sender)

---

**Last Updated:** 2025-01-10
**Version:** 1.0.0
