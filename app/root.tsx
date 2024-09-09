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
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='YGO Solo Play Tool' />
        <meta property='og:title' content='YGO Solo Play Tool' />
        <meta
          property='og:description'
          content='A tool to help you play Yu-Gi-Oh! by yourself.' />
        <meta property='og:image' content='og-image.png' />
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
