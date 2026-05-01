# Create Coupon API - Test Cases

**Endpoint:** `POST /api/admin/coupons/create`

| # | Test Case | Expected Result |
|---|-----------|----------------|
| 1 | Valid coupon creation with all required fields | 201 - Coupon created successfully |
| 2 | Missing required fields | 400/500 - Validation error |
| 3 | Duplicate coupon code | First: 201, Second: 400/409 |
| 4 | Invalid data types (number for title, boolean for code) | 400/500 - Type validation error |
| 5 | Minimum required fields only | 201 - Successful creation |
| 6 | Maximum field lengths (very long strings) | 201 (accepted) or 400 (rejected) |
| 7 | Empty string values for all fields | 201/400/500 based on validation |
| 8 | Special characters (@#$%^&*()) in fields | 201 - Characters preserved |
| 9 | Unicode characters and emojis | 201 - Unicode preserved |
| 10 | Invalid discount format | 201 (accepted) or 400 (rejected) |
| 11 | Null values for some fields | 201 or 400 based on null handling |
| 12 | Performance test (response time) | 201 within 3 seconds |
| 13 | Concurrent coupon creation | All succeed with 201 |
| 14 | Large payload (oversized request) | 201/400/413 based on size limits |
| 15 | Content-Type validation | Wrong: 400/415/500, Correct: 201 |