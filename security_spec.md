# Data Invariants
- A registration must be linked to a valid authenticated user (user_id == request.auth.uid).
- Email must be verified (except maybe for local tests, but we'll require it as per rules).
- Team members can only be an array of bounded size.

# The "Dirty Dozen" Payloads
1. Unauthenticated write.
2. Spoofed user_id.
3. Missing required fields.
4. Additional unauthorized fields.
5. Invalid event_id size.
6. Not a string for name.
7. Unverified email (if possible to test).
8. Modifying a registration after creation (updates shouldn't be allowed or restricted).
9. Delete registration (should be denied).
10. Read someone else's registration.
11. Team members array too large.
12. Invalid timestamp (not request.time).
