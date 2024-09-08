import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { SpeedInsights } from '@vercel/speed-insights/remix'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import './tailwind.css'
import { Button } from './components/ui/button'
import { BookText } from 'lucide-react'

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className='m-2'>
                  <BookText className='mr-2 h-4 w-4' />
                  How To Use
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tool DEMO</DialogTitle>
                </DialogHeader>
                <img src='ygo-solo-play-tool-demo.gif' />
              </DialogContent>
            </Dialog>
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
