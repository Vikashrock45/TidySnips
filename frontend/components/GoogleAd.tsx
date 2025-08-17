"use client";
import { useEffect } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export default function GoogleAd({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true 
}: GoogleAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading ad:', err);
    }
  }, []);

  const defaultStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    margin: '20px 0',
    ...style
  };

  const adSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  // Don't render ads if disabled, in development, or if adSenseId is not set
  if (!adsEnabled || !adSenseId || adSenseId === 'ca-pub-YOUR_PUBLISHER_ID') {
    // Show placeholder only in development mode
    if (process.env.NODE_ENV === 'development') {
      return (
        <div 
          className={`ad-placeholder ${className}`} 
          style={{ 
            ...defaultStyle, 
            backgroundColor: '#f0f0f0', 
            border: '2px dashed #ccc',
            padding: '20px',
            borderRadius: '8px',
            color: '#666'
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            📢 Google Ad Placeholder ({adFormat})
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
            {!adsEnabled ? 'Ads disabled in environment' : 'Development mode'}
          </p>
        </div>
      );
    }
    // Return null in production when ads are disabled
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client={adSenseId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}
