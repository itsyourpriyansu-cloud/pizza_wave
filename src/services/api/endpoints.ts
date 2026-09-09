export const endpoints = {
  capabilities: '/capabilities', categories: '/categories', products: '/products', menu: '/menu',
  recommendations: '/recommendations', search: '/search',
  availability: '/availability', ownerAvailability: '/owner/availability', kdsAvailability: '/kds/availability',
  cart: '/cart', cartItems: '/cart/items', cartQuote: '/cart/quote',
  checkoutOptions: '/checkout/options', checkoutSession: '/checkout/session', checkoutIntent: '/checkout/order-intent',
  paymentInitiate: '/payments/phonepe/initiate',
  orders: '/orders',
  ownerOrders: '/owner/orders', ownerAttention: '/owner/attention', ownerCustomers: '/owner/customers',
  kdsQueue: '/kds/queue', kdsOrders: '/kds/orders',
  loyalty: '/loyalty', loyaltyWallet: '/loyalty/wallet', waveId: '/wave-id',
  crmCustomers: '/crm/customers',
  chatMessage: '/chat/message', chatConversations: '/chat/conversations',
  supportCases: '/support/cases',
  refunds: '/refunds',
  authCustomerOtpRequest: '/auth/customer/request-otp', authCustomerOtpVerify: '/auth/customer/verify-otp',
  authOwnerLogin: '/auth/owner/login', authKdsLogin: '/auth/kds/login',
  configStore: '/config/store',
  demoReset: '/demo/reset', demoScenarios: '/demo/scenarios', demoScenario: '/demo/scenario',
  demoCapabilities: '/demo/capabilities', demoSession: '/demo/session',
} as const

export const paymentStatus = (paymentId: string) => `/payments/${paymentId}`
export const paymentConfirm = (paymentId: string) => `/demo/payments/${paymentId}/succeed`
export const paymentFail = (paymentId: string) => `/demo/payments/${paymentId}/fail`
export const paymentPending = (paymentId: string) => `/demo/payments/${paymentId}/pending`
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
