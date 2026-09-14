import type { PropsWithChildren } from 'react'
import { MotionProvider } from './MotionProvider'
import { QueryProvider } from './QueryProvider'
import { DemoProvider } from './DemoProvider'
import { RealtimeSyncProvider } from './RealtimeSyncProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return <QueryProvider><RealtimeSyncProvider><DemoProvider><MotionProvider>{children}</MotionProvider></DemoProvider></RealtimeSyncProvider></QueryProvider>
}
