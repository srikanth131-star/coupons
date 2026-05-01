class GA4Analytics {
  constructor() {
    // Initialize properties but delay configuration check
    this.measurementId = null
    this.apiSecret = null
    this.baseUrl = 'https://www.google-analytics.com/mp/collect'
    this.initialized = false
    
    // Delay initialization to ensure environment variables are loaded
    setTimeout(() => {
      this.initialize()
    }, 500)
  }

  initialize() {
    this.measurementId = process.env.GA4_MEASUREMENT_ID
    this.apiSecret = process.env.GA4_API_SECRET
    this.initialized = true
    
    console.log(`GA4 Analytics initialized: ${this.measurementId ? 'Enabled' : 'Disabled'}`)
  }

  generateClientId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  async sendEvent(eventName, parameters = {}, clientId = null, userProperties = {}) {
    // Wait for initialization if not ready
    if (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    if (!this.measurementId || !this.apiSecret) {
      console.log('GA4 not configured, skipping analytics')
      return
    }

    const payload = {
      client_id: clientId || this.generateClientId(),
      user_properties: {
        device_type: { value: userProperties.device_type || 'unknown' },
        user_agent: { value: userProperties.user_agent || 'unknown' },
        referrer: { value: userProperties.referrer || 'direct' }
      },
      events: [{
        name: eventName,
        params: {
          ...parameters,
          engagement_time_msec: 1000,
          session_id: Date.now().toString(),
          page_location: 'backend-api',
          page_title: `API: ${parameters.api_endpoint || 'unknown'}`,
          ...userProperties
        }
      }]
    }

    try {
      const url = `${this.baseUrl}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log(`GA4 Event tracked: ${eventName}`)
      } else {
        console.error(`GA4 tracking failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('GA4 tracking error:', error.message)
    }
  }

  async trackAPICall(endpoint, method, statusCode, responseTime, clientId, userProperties = {}) {
    await this.sendEvent('api_call', {
      api_endpoint: endpoint,
      http_method: method,
      status_code: statusCode,
      response_time_ms: responseTime,
      event_category: 'API',
      api_success: statusCode < 400,
      api_type: this.getAPIType(endpoint)
    }, clientId, userProperties)
  }

  getAPIType(endpoint) {
    if (endpoint.includes('/coupons')) return 'coupon'
    if (endpoint.includes('/stores')) return 'store'
    if (endpoint.includes('/search')) return 'search'
    if (endpoint.includes('/trending')) return 'analytics'
    return 'other'
  }

  async trackCouponReveal(couponId, storeId, storeName, couponCode, clientId, userProperties = {}) {
    // E-commerce event for coupon reveal
    await this.sendEvent('coupon_reveal', {
      coupon_id: couponId,
      store_id: storeId,
      store_name: storeName,
      coupon_code: couponCode,
      event_category: 'Coupon',
      value: 1,
      currency: 'USD',
      item_id: couponId,
      item_name: couponCode,
      item_category: 'coupon',
      item_brand: storeName,
      content_type: 'coupon',
      content_id: couponId
    }, clientId, userProperties)
  }

  async trackCouponClick(couponId, storeId, storeName, couponCode, clientId, userProperties = {}) {
    // E-commerce event for coupon click
    await this.sendEvent('coupon_click', {
      coupon_id: couponId,
      store_id: storeId,
      store_name: storeName,
      coupon_code: couponCode,
      event_category: 'Coupon',
      value: 1,
      currency: 'USD',
      item_id: couponId,
      item_name: couponCode,
      item_category: 'coupon',
      item_brand: storeName,
      content_type: 'coupon',
      content_id: couponId,
      promotion_id: couponId,
      promotion_name: couponCode
    }, clientId, userProperties)
  }

  async trackSearch(query, resultsCount, category, clientId) {
    await this.sendEvent('search', {
      search_term: query || 'empty_query',
      results_count: resultsCount,
      search_category: category || 'all',
      event_category: 'Search'
    }, clientId)
  }

  async trackError(endpoint, method, errorMessage, statusCode, clientId) {
    await this.sendEvent('api_error', {
      api_endpoint: endpoint,
      http_method: method,
      error_message: errorMessage.substring(0, 100),
      status_code: statusCode,
      event_category: 'Error'
    }, clientId)
  }

  async trackStoreOperation(operation, storeId, storeName, clientId) {
    await this.sendEvent('store_operation', {
      operation_type: operation,
      store_id: storeId,
      store_name: storeName,
      event_category: 'Store'
    }, clientId)
  }

  async trackDatabaseOperation(operation, collection, success, clientId) {
    await this.sendEvent('database_operation', {
      operation_type: operation,
      collection_name: collection,
      operation_success: success.toString(),
      event_category: 'Database'
    }, clientId)
  }

  async trackPageView(endpoint, clientId, userProperties = {}) {
    await this.sendEvent('page_view', {
      page_location: `backend-api${endpoint}`,
      page_title: `API: ${endpoint}`,
      page_referrer: userProperties.referrer || 'direct',
      event_category: 'Navigation'
    }, clientId, userProperties)
  }

  async trackUserEngagement(action, details, clientId, userProperties = {}) {
    await this.sendEvent('user_engagement', {
      engagement_action: action,
      engagement_details: JSON.stringify(details),
      event_category: 'Engagement'
    }, clientId, userProperties)
  }

  async trackServerEvent(eventType, details, clientId, userProperties = {}) {
    await this.sendEvent('server_event', {
      server_event_type: eventType,
      details: JSON.stringify(details),
      event_category: 'Server'
    }, clientId, userProperties)
  }
}

export default new GA4Analytics()