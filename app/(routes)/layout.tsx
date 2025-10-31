import Container from '@/components/ui/container'
import React from 'react'

const Mainlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container className='h-full lg:p-20 p-2'>{children}</Container>
  )
}

export default Mainlayout