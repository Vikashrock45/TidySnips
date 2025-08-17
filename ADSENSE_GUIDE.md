# Google AdSense Integration Guide

## Overview
TidySnips now includes Google AdSense integration with environment-based configuration for flexible ad management across different deployment environments.

## Features
- 🎯 **3 Strategic Ad Placements**: Banner (top), Sidebar (desktop only), Footer
- 🔧 **Environment-Based Control**: Enable/disable ads via environment variables
- 📱 **Responsive Design**: Ads automatically adapt to screen sizes
- 🚀 **Development-Friendly**: Shows placeholders in development mode
- ⚡ **Performance Optimized**: Loads ads asynchronously after page interaction

## Environment Variables

### Required Variables
```bash
# Your Google AdSense Publisher ID
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-6946795866132788

# Enable/disable ads globally
NEXT_PUBLIC_ADS_ENABLED=true

# Individual ad slot IDs from your AdSense dashboard
NEXT_PUBLIC_AD_SLOT_BANNER=4838737945
NEXT_PUBLIC_AD_SLOT_SIDEBAR=6287550988
NEXT_PUBLIC_AD_SLOT_FOOTER=3525656271
```

## Ad Placements

### 1. Banner Ad (Top)
- **Location**: Below header, above main content
- **Format**: Responsive auto-sizing
- **Visibility**: All devices
- **AdSense Config**: Auto format, full-width responsive

### 2. Sidebar Ad (Middle)
- **Location**: Between input and output panels
- **Format**: 160x600 (Wide Skyscraper)
- **Visibility**: Desktop only (hidden on mobile)
- **AdSense Config**: Fixed size, not responsive

### 3. Footer Ad (Bottom)
- **Location**: Above footer, below main content
- **Format**: Responsive auto-sizing
- **Visibility**: All devices
- **AdSense Config**: Auto format, full-width responsive

## Configuration Scenarios

### Production (Ads Enabled)
```bash
NEXT_PUBLIC_ADS_ENABLED=true
```
- Real ads displayed to users
- Revenue generation active
- AdSense script loads

### Development (Ads Disabled)
```bash
NEXT_PUBLIC_ADS_ENABLED=false
```
- Placeholder boxes shown with debug info
- No AdSense script loading
- Faster development experience

### Staging (Ads Disabled)
```bash
NEXT_PUBLIC_ADS_ENABLED=false
```
- Clean testing environment
- No ad distractions during QA
- Mimics production layout without ads

## Implementation Details

### Component Structure
```
components/
└── GoogleAd.tsx          # Reusable ad component
app/
├── layout.tsx            # AdSense script loading
└── page.tsx              # Ad placements
```

### Ad Loading Strategy
1. **Conditional Script Loading**: AdSense script only loads when ads are enabled
2. **Lazy Initialization**: Ads initialize after component mount
3. **Error Handling**: Graceful fallback if ads fail to load
4. **Development Mode**: Shows helpful placeholders instead of ads

### Mobile Responsiveness
- **Banner**: Adapts to mobile banner sizes (320x50)
- **Sidebar**: Hidden on mobile devices (< 700px width)
- **Footer**: Responsive sizing for mobile layouts

## AdSense Dashboard Setup

### Creating Ad Units
1. Go to [Google AdSense Dashboard](https://www.google.com/adsense/)
2. Navigate to **Ads** → **By ad unit**
3. Create three ad units:

#### Banner Ad Unit
- **Name**: "TidySnips Banner"
- **Size**: Responsive or 728x90
- **Type**: Display ads

#### Sidebar Ad Unit
- **Name**: "TidySnips Sidebar"  
- **Size**: 160x600 (Wide Skyscraper)
- **Type**: Display ads

#### Footer Ad Unit
- **Name**: "TidySnips Footer"
- **Size**: Responsive or 320x50
- **Type**: Display ads

### Getting Ad Slot IDs
After creating each ad unit, copy the `data-ad-slot` value from the generated code:

```html
<ins class="adsbygoogle"
     data-ad-slot="YOUR_SLOT_ID_HERE"
     ...>
```

## Deployment Configuration

### Vercel Deployment
Add environment variables in Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all `NEXT_PUBLIC_*` variables
4. Deploy with ads enabled for production

### Local Development
Create `.env.local`:
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

## Testing

### Development Testing
```bash
# Disable ads to see placeholders
NEXT_PUBLIC_ADS_ENABLED=false
npm run dev
```

### Production Testing
```bash
# Enable ads for real testing
NEXT_PUBLIC_ADS_ENABLED=true
npm run build && npm start
```

## Performance Considerations

### Loading Strategy
- AdSense script loads with `strategy="afterInteractive"`
- Ads initialize after component mount
- No blocking of initial page render

### Bundle Size
- No additional dependencies
- Minimal JavaScript overhead
- Conditional loading based on environment

## Troubleshooting

### Ads Not Showing
1. Check `NEXT_PUBLIC_ADS_ENABLED=true`
2. Verify AdSense account approval
3. Ensure correct Publisher ID
4. Check ad slot IDs match AdSense dashboard
5. Wait 24-48 hours for new ad units to activate

### Development Issues
1. Placeholders show when `NEXT_PUBLIC_ADS_ENABLED=false`
2. Check browser console for AdSense errors
3. Verify environment variables are loaded correctly

### Mobile Layout
1. Sidebar ads automatically hidden on mobile
2. Banner and footer ads use responsive sizing
3. Test across different screen sizes

## Revenue Optimization

### Best Practices
- Keep current ad placements for optimal user experience
- Monitor AdSense performance metrics
- Avoid adding too many ads (impacts user experience)
- Ensure ads don't interfere with core functionality

### AdSense Policies
- Maintain quality content
- Follow Google AdSense policies
- Keep privacy policy updated
- Ensure site navigation is clear

## Future Enhancements

### Potential Additions
- A/B testing for ad placements
- Additional ad formats (In-article, In-feed)
- Ad performance analytics
- User preference settings for ad display

---

**Note**: Remember to comply with Google AdSense policies and your local privacy regulations (GDPR, CCPA, etc.) when implementing ads.
