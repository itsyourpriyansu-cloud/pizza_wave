import { apiClient } from '../../../services/api/client'
import { endpoints } from '../../../services/api/endpoints'
import { loyaltySchema } from '../../../services/api/contracts'
export const getLoyalty = async () => loyaltySchema.parse((await apiClient.get(endpoints.loyalty)).data)
