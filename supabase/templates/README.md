# Vibe Quest authentication emails

Ready-to-paste HTML for Supabase **Authentication → Email → Templates**:

| Template | File | Suggested subject |
| --- | --- | --- |
| Confirm signup | `confirmation.html` | Confirm your Vibe Quest email |
| Reset password | `recovery.html` | Reset your Vibe Quest password |

Paste each complete HTML file into the matching template body and set its subject separately. Keep `{{ .ConfirmationURL }}` unchanged in both the button and fallback link: Supabase supplies the action URL for the selected template.

The templates use the actual Vibe Quest September wordmark, Quest Marks, and a five-row icon-pattern footer that fades into the charcoal background. They are exported from the original brand artwork to email-compatible PNG files in `assets/email/`. Faculty Glyphic is loaded from Google Fonts where the email client permits web fonts; Georgia is the fallback. Presentation tables, inline styles, and an Outlook width fallback support email clients. The logo has accessible alternate text and the primary content remains readable when images are blocked. The visible fallback URL wraps on narrow screens. No user metadata or fixed expiration promises are included.

The three image files are also hosted in the public `editorial-media/email/` folder in Supabase Storage. Both templates reference those HTTPS URLs, which were checked against the local PNGs on November 19, 2026. Do not paste a local preview into Supabase.

These files contain no SMTP credentials and do not configure email delivery. Both templates were saved to Supabase on November 19, 2026. The signup and recovery messages were delivered to a test inbox; signup confirmation and sign-in worked, and the user completed the test account password reset. Verify sign-in with the new password and complete the phone checks. Browser rendering is a layout preview; test actual messages in the email clients used for launch.
