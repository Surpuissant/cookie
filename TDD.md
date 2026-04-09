# TDD Scenarios

## 1. Clicking the Cookie
**Given** a player is on the game page
**When** the player clicks the main cookie
**Then** the cookie count should increase by 1 (or current click value)

## 2. Buying Click Upgrade
**Given** a player has enough cookies to buy a click upgrade
**When** the player clicks on the buy button for the click upgrade
**Then** the cookie count should decrease by the upgrade cost
**And** the click value should increase by 1
**And** the next upgrade cost should increase

## 3. Auto-clicker Generation
**Given** a player has 1 auto-clicker
**When** the game interval passes (e.g., 1 second)
**Then** the cookie count should increase automatically by the auto-click value

## 4. User Registration
**Given** a new user on the register page
**When** the user provides a valid username and password
**Then** a new user record should be created in the database
**And** the user should be redirected to the game page

## 5. Persistence
**Given** a logged-in player with 100 cookies
**When** the player refreshes the page
**Then** the cookie count should still be 100
