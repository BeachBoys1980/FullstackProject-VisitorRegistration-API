1ST COMMIT: LOGIN, LOGOUT, ADMIN w GET/CREATE

1. created Users APIs (w tests)
   - Login/logout
   - Create new users
   - Get all users

2ND COMMIT: LOGIN, LOGOUT, ADMIN w GET/CREATE, USER w GET/TRACE/REGISTER

1. created Visits APIs (w tests)
   - Get all visits
   - Register new visit
   - Contact trace visit (using Trace NRIC + Trace Date)

3RD COMMIT: LOGIN, LOGOUT, ADMIN w GET/CREATE, USER w GET/TRACE/REGISTER, CONTROLLERS, PROTECT-ROUTE

1. Misc Features
   - Controllers
   - Protected routes for APIs (ensure only authenticated users can access)
     - Create new users
     - Get all users
     - Get all visits
     - Register new visit
     - Contact trace visit

===============================================================================

** Product Backlog **

1. - Protected routes for APIs (ensure only authorised users can access)
   - Create new users (only ADMIN)
   - Get all users (only ADMIN)
   - Get all visits (only USER)
   - Register new visit (only USER)
   - Contact trace visit (only USER)

2. Signed Cookies
