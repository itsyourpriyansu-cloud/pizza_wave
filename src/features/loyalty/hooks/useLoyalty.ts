import { useQuery } from '@tanstack/react-query'
import { getLoyalty } from '../api/loyalty.api'
export const useLoyalty = () => useQuery({ queryKey: ['loyalty'], queryFn: getLoyalty })
