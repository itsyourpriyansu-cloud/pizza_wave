export const endpoints = {
  capabilities: '/capabilities', categories: '/categories', products: '/products', menu: '/menu',
  recommendations: '/recommendations', search: '/search',
  availability: '/availability', ownerAvailability: '/owner/availability', kdsAvailability: '/kds/availability',
  cart: '/cart', cartItems: '/cart/items', cartQuote: '/cart/quote',
  checkoutIntent: '/checkout/intent',
  paymentInitiate: '/payment/initiate',
  orders: '/orders',
  ownerOrders: '/owner/orders', ownerAttention: '/owner/attention', ownerCustomers: '/owner/customers',
  kdsQueue: '/kds/queue', kdsOrders: '/kds/orders',
  loyalty: '/loyalty', loyaltyWallet: '/loyalty/wallet', waveId: '/wave-id',
  crmCustomers: '/crm/customers',
  chatMessage: '/chat/message', chatConversations: '/chat/conversations',
  supportCases: '/support/cases',
  refunds: '/refunds',
  authCustomerOtpRequest: '/auth/customer/otp/request', authCustomerOtpVerify: '/auth/customer/otp/verify',
  authOwnerLogin: '/auth/owner/login', authKdsLogin: '/auth/kds/login',
  configStore: '/config/store',
  demoReset: '/demo/reset', demoScenarios: '/demo/scenarios', demoScenario: '/demo/scenario',
  demoCapabilities: '/demo/capabilities', demoSession: '/demo/session',
} as const

export const paymentStatus = (merchantOrderId: string) => `/payment/${merchantOrderId}/status`
export const paymentConfirm = (merchantOrderId: string) => `/payment/${merchantOrderId}/confirm`
export const paymentFail = (merchantOrderId: string) => `/payment/${merchantOrderId}/fail`
export const orderById = (orderId: string) => `/orders/${orderId}`
export const orderEvents = (orderId: string) => `/orders/${orderId}/events`
export const orderComplete = (orderId: string) => `/orders/${orderId}/complete`
export const ownerAcceptOrder = (orderId: string) => `/owner/orders/${orderId}/accept`
export const ownerRejectOrder = (orderId: string) => `/owner/orders/${orderId}/reject`
export const ownerResolveAttention = (attentionId: string) => `/owner/attention/${attentionId}/resolve`
export const kdsStartPrep = (orderId: string) => `/kds/orders/${orderId}/start-prep`
export const kdsPrepTime = (orderId: string) => `/kds/orders/${orderId}/prep-time`
export const kdsReady = (orderId: string) => `/kds/orders/${orderId}/ready`
export const kdsProblem = (orderId: string) => `/kds/orders/${orderId}/problem`
export const supportCaseResolve = (caseId: string) => `/support/cases/${caseId}/resolve`
export const refundProcess = (refundId: string) => `/refunds/${refundId}/process`
export const scenarioByName = (name: string) => `/demo/scenario/${name}`
