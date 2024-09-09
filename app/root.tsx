import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { SpeedInsights } from '@vercel/speed-insights/remix'
import './tailwind.css'
import { Header } from '~/components/originals/header'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:title' content='YGO Solo Play Tool' />
        <meta
          property='og:description'
          content='A tool for solo playing Yu-Gi-Oh!'
        />
        <meta property='og:image' content='/og-image.png' />
        <meta
          property='og:url'
          content='https://ygo-solo-play-tool.vercel.app'
        />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content='YGO Solo Play Tool' />
        <meta
          name='twitter:description'
          content='A tool for solo playing Yu-Gi-Oh!'
        />
        <meta name='twitter:image' content='/og-image.png' />
        <meta
          name='twitter:url'
          content='https://ygo-solo-play-tool.vercel.app'
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='container mx-auto p-4'>
          <Header />
          {children}
        </div>
        <SpeedInsights />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return <p>Loading...</p>
}
