@echo off
echo ========================================
echo Enhanced GA4 Analytics Test Suite
echo ========================================

set BASE_URL=http://localhost:5000
set CLIENT_ID=enhanced-test-%RANDOM%

echo Testing with Client ID: %CLIENT_ID%
echo.

echo 1. Testing Basic APIs...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" %BASE_URL%/api/test
echo.

echo 2. Testing Coupons with different filters...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "%BASE_URL%/api/coupons?limit=5"
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Android 10; Mobile)" "%BASE_URL%/api/coupons?category=electronics"
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "%BASE_URL%/api/coupons?sort=clickCount"
echo.

echo 3. Testing Stores...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" %BASE_URL%/api/stores
echo.

echo 4. Testing Search with different queries...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "%BASE_URL%/api/coupons/search?query=discount"
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "%BASE_URL%/api/coupons/search?query=sale"
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Android 10; Mobile)" "%BASE_URL%/api/coupons/search?query=deal"
echo.

echo 5. Testing Trending...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "%BASE_URL%/api/coupons/trending?limit=10"
echo.

echo 6. Testing Error scenarios...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" %BASE_URL%/api/invalid-endpoint
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" %BASE_URL%/api/coupons/invalid-id
echo.

echo 7. Testing with different referrers...
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" -H "Referer: https://google.com" %BASE_URL%/api/coupons
curl -H "x-client-id: %CLIENT_ID%" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" -H "Referer: https://facebook.com" %BASE_URL%/api/stores
echo.

echo ========================================
echo Test completed! Check your GA4 dashboard:
echo 1. Go to https://analytics.google.com
echo 2. Select property G-X6F3XDKCEC
echo 3. Check Reports ^> Realtime
echo 4. Look for enhanced events and user properties
echo ========================================
pause