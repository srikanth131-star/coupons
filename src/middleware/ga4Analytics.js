import ga4Analytics from '../utils/ga4Analytics.js'

const getClientId = (req) => {
  if (req.headers['x-client-id']) {
    return req.headers['x-client-id']
  }
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown'
  const userAgent = req.get('user-agent') || 'unknown'
  const combined = ip + userAgent
  
  return Buffer.from(combined).toString('base64').substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')
}

// Enhanced user properties extraction
const getUserProperties = (req) => {
  return {
    user_agent: req.get('user-agent') || 'unknown',
    ip_address: req.ip || 'unknown',
    referrer: req.get('referer') || 'direct',
    accept_language: req.get('accept-language') || 'unknown',
    device_type: req.get('user-agent')?.includes('Mobile') ? 'mobile' : 'desktop'
  }
}

export const trackGA4APIMiddleware = (req, res, next) => {
  const startTime = Date.now()
  const clientId = getClientId(req)
  const userProps = getUserProperties(req)
  
  const originalEnd = res.end
  
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime
    const endpoint = req.route ? req.route.path : req.path
    const method = req.method
    const statusCode = res.statusCode
    
    // Enhanced API call tracking with user properties
    ga4Analytics.trackAPICall(endpoint, method, statusCode, responseTime, clientId, userProps)
      .catch(err => console.error('GA4 API tracking failed:', err.message))
    
    originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

export const trackGA4ErrorMiddleware = (err, req, res, next) => {
  const endpoint = req.route ? req.route.path : req.path
  const method = req.method
  const statusCode = res.statusCode || 500
  const clientId = getClientId(req)
  const userProps = getUserProperties(req)
  
  ga4Analytics.trackError(endpoint, method, err.message, statusCode, clientId, userProps)
    .catch(trackErr => console.error('GA4 error tracking failed:', trackErr.message))
  
  next(err)
}

export { getClientId, getUserProperties }