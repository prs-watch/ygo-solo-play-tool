import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { SpeedInsights } from '@vercel/speed-insights/remix'
import './tailwind.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='container mx-auto p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold'>YGO Solo-Play Tool</h1>
          </div>
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
