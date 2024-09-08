import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { BookText } from 'lucide-react'

export const Header = () => {
  return (
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
  )
}