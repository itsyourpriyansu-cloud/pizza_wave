import type { PropsWithChildren } from 'react'
import { MotionProvider } from './MotionProvider'
import { QueryProvider } from './QueryProvider'
import { DemoProvider } from './DemoProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryProvider><DemoProvider><MotionProvider>{children}</MotionProvider></DemoProvider></QueryProvider>
}
