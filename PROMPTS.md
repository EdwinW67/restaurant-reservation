
---

# 📘 PROMPTS.md (your personal knowledge base)

```markdown
# Prompts & Development Notes

This file contains the prompts, debugging steps, and reasoning used during the development of the Restaurant Reservation System.

---

## 1. Debugging Sessions

### 1.1 Frontend → Backend Connectivity
- Diagnosed CORS issues
- Fixed incorrect API_BASE (`backend` → `localhost`)
- Ensured correct headers and payload structure

### 1.2 Admin Dashboard Failures
- Identified backend crash due to `db` vs `pool`
- Fixed date filter logic to avoid empty-string date errors
- Corrected CORS configuration for credentialed requests

### 1.3 Database Issues
- Verified table existence
- Confirmed inserts via debug logging
- Fixed mismatched field names (`datum` → `date`)

---

## 2. Prompts Used

I need a docker container with a demo site in html of a restaurant where a client can reserve a table, 
the reservation needs to be stored in a postgresql database. 
I want a read api on the reservation database to read existing reservations and 
an api to enter the reservations and update the database. I want to test the front end and the api's using playwright

Can you add reservation dashboard, email confirmation, swagger spec for API and I need a dev container for vs code?

Trouble shooting:
Im getting an error when I try to run the docker-compose it says command not found. What am I doing wrong?

I have docker desktop running and Im using the devcontainer

Continue:
I would like to develop tests inside the container and be able to save them for future use.

Trouble shooting:
Im getting an error    Error: browserType.launch: Target page, context or browser has been closed

im getting this error     Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1200/chrome-linux64/chrome

the test fails on cant save reservation on this step await expect(page.locator("#result")).toContainText("Reservation saved");

Continue:
Id like to add a backend page to read the existing reservations and use a username password combination to logon to this page




---

## 3. Future Ideas
- Add pagination to admin dashboard
- Add reservation editing/canceling
- Add availability checking
- Add email templates
- Add Docker health checks
