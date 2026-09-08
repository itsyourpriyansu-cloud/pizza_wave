import { useQuery } from '@tanstack/react-query'
import { getCapabilities } from '../api/capabilities.api'
export const useCapabilities = () => useQuery({ queryKey: ['capabilities'], queryFn: getCapabilities })
