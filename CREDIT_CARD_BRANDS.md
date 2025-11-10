# Credit Card Brand Logo Mappings

This document lists all supported credit card brands and their Logo.dev domain mappings.

## Supported Brands

| Brand Name | Value | Logo.dev Domain | Status |
|------------|-------|-----------------|---------|
| Chase | `chase` | `chase.com` | ✅ Verified |
| American Express | `amex` | `americanexpress.com` | ✅ Verified |
| Capital One | `capitalone` | `capitalone.com` | ✅ Verified |
| Discover | `discover` | `discover.com` | ✅ Expected to work |
| Citi | `citi` | `citi.com` | ✅ Expected to work |
| Wells Fargo | `wellsfargo` | `wellsfargo.com` | ✅ Expected to work |
| Bank of America | `bankofamerica` | `bankofamerica.com` | ✅ Expected to work |
| U.S. Bank | `usbank` | `usbank.com` | ✅ Expected to work |
| Barclays | `barclays` | `barclays.com` | ⚠️ Needs validation |
| Synchrony | `synchrony` | `synchronybank.com` | ⚠️ Needs validation |
| PNC Bank | `pnc` | `pnc.com` | ⚠️ Needs validation |
| TD Bank | `td` | `td.com` | ⚠️ Needs validation |
| Navy Federal | `navyfederal` | `navyfederal.org` | ⚠️ Needs validation |
| USAA | `usaa` | `usaa.com` | ✅ Expected to work |
| Regions Bank | `regions` | `regions.com` | ⚠️ Needs validation |
| Citizens Bank | `citizens` | `citizensbank.com` | ⚠️ Needs validation |
| Marcus (Goldman Sachs) | `marcus` | `marcus.com` | ⚠️ Needs validation |
| Other | `other` | `generic` (fallback) | ✅ Shows fallback icon |

## Logo.dev URL Format

All logos are fetched using this format:
```
https://img.logo.dev/{domain}?token={NEXT_PUBLIC_LOGO_DEV_KEY}&size={size}&format=png
```

## Fallback Behavior

If a logo fails to load (incorrect domain, service unavailable, etc.), the `CompanyLogo` component automatically displays a fallback credit card icon.

## Testing Recommendations

To validate new brands:
1. Add a test credit card with the brand
2. Check if the logo loads correctly
3. If logo doesn't load, try alternative domain variations:
   - With/without `.com`
   - Full name vs abbreviated
   - Check the company's primary website domain
4. Update the mapping in `components/dashboard/CompanyLogo.tsx` if needed

## Notes

- **American Express**: Use `americanexpress.com` instead of `amex.com` (amex.com returns wrong logo)
- **Synchrony**: Use `synchronybank.com` instead of `synchrony.com` for better logo results
- **TD Bank**: `td.com` may work, alternative: `tdbank.com`
- **Navy Federal**: Uses `.org` domain instead of `.com`
- **Other**: Generic option that always shows fallback icon
