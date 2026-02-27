import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MARS Trading Journal'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0A101C',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg width="400" height="400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" fill="#f97316" />
                    <circle cx="9" cy="9" r="2.5" fill="#9a3412" opacity="0.6" />
                    <circle cx="14" cy="14" r="3" fill="#9a3412" opacity="0.5" />
                    <circle cx="16" cy="7" r="1.5" fill="#9a3412" opacity="0.6" />
                    <circle cx="7" cy="14" r="1" fill="#9a3412" opacity="0.5" />
                    <circle cx="12" cy="17" r="2" fill="#9a3412" opacity="0.4" />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    )
}
