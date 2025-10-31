# Tournament Flow Documentation

## Overview
This document describes the complete flow of a GOALDEN eFootball tournament from registration to completion.

---

## 1. Tournament Creation (Admin)

**Location**: `/admin/tournaments/create`

### Steps:
1. Admin logs into admin dashboard
2. Navigates to "Create Tournament" tab
3. Fills in tournament details:
   - Tournament name
   - Description
   - Upload poster (optional)
   - Format: Single Elimination or Double Elimination
   - Match Mode: Auto Schedule or Real-time
   - Maximum slots: 4, 8, 16, 32, or 64 players
   - Entry fee in KES
   - Start date (optional)
4. System calculates prize pool automatically (entry_fee × max_slots)
5. Prize breakdown displayed:
   - 1st Place: 60%
   - 2nd Place: 30%
   - 3rd Place: 10%
6. Tournament created with status: `registration`

---

## 2. User Registration

**Location**: Tournament detail page `/dashboard/tournaments/[id]`

### Steps:
1. User views available tournaments
2. Clicks on tournament card to see details
3. Views:
   - Tournament poster (if uploaded)
   - Entry fee and prize pool
   - Number of registered players
   - Bracket (when tournament starts)
4. Clicks "Register Now" button
5. System checks:
   - User is logged in ✓
   - Tournament status is `registration` ✓
   - Not already registered ✓
   - Has slot available ✓
6. Registration created with:
   - Status: `confirmed` (or `waitlist` if full)
   - Payment status: `pending` (for future M-PESA integration)
   - `current_players` count incremented
7. User can now:
   - Access tournament chat
   - View bracket when tournament starts
   - See when their match is scheduled

---

## 3. Tournament Start (Admin)

**Location**: `/admin/dashboard` → Tournaments tab

### Steps:
1. Admin views tournament with status `registration`
2. Checks that:
   - At least 2 players registered
   - All registration slots filled (or manually starts)
3. Clicks "Start" button
4. System performs automated actions:
   - Changes tournament status to `ongoing`
   - Generates bracket based on format:
     - **Single Elimination**: Winner bracket only
     - **Double Elimination**: Winner + Loser brackets
   - Creates all match records:
     - Round 1 matches: Both players assigned, status `ongoing`, 10-min deadline
     - Subsequent rounds: Players `null`, status `pending`
   - For each Round 1 match:
     - Sets `deadline` = current time + 10 minutes
     - Sets `status` = `ongoing`

---

## 4. Match Flow

### 4.1 Match Assignment

**When**: Tournament starts or previous match completes

**Logic**:
1. Round 1 matches assigned at tournament start
2. Subsequent rounds assigned when both players ready:
   - Winner advances to next round
   - Loser eliminated (or goes to loser bracket)
3. When both players assigned to next match:
   - Match status changed to `ongoing`
   - Deadline set to 10 minutes from now
   - Players can now see their active match

### 4.2 Player Notifications (Future Integration)

**Implementation**: WhatsApp notifications via Twilio

**When sent**:
1. Match assignment: When both players assigned
2. Match deadline reminder: 2 minutes before deadline
3. Match completion: When result verified
4. Next round: When advanced to next match

**Example message**:
```
You've been matched against [Opponent Name] in [Tournament Name]. 
Match deadline: [10 minutes from now]
Submit result at: [Link]
```

---

## 5. Match Execution

### 5.1 Gameplay

**Duration**: 10 minutes per match

**Players**:
1. Receive notification of match assignment
2. View active match on tournament detail page
3. Play eFootball match
4. Take screenshot of result
5. Navigate to `/dashboard/matches/[id]/submit`
6. Submit:
   - Score
   - Screenshot
7. Wait for opponent submission

### 5.2 Result Verification

**Automatic verification**:
1. Both players submit
2. System compares scores:
   - **Match agreement**: Both report same winner → Match complete
   - **Score mismatch**: Different winners → Dispute created
   - **Draw situation**: Both submit same score → Match replayed

**Outcomes**:

#### Scenario A: Clear Winner
```javascript
Player 1 submits: 3
Player 2 submits: 1
Winner: Player 1
Actions:
- Match status → 'completed'
- Winner recorded
- Winner advances to next round
- Loser eliminated
- Player stats updated
```

#### Scenario B: Draw - Match Replayed
```javascript
Player 1 submits: 2
Player 2 submits: 2
Actions:
- Match scores reset to null
- Both submissions cleared
- Match status remains 'ongoing'
- New 10-minute deadline set
- Players must replay the match
- Toast notification: "Match ended in draw. Replaying!"
```

#### Scenario C: Dispute Created
```javascript
Player 1 submits: 3 (claims win)
Player 2 submits: 2 (claims different result)
Actions:
- Match status → 'disputed'
- Dispute created in database
- Admin notified
- Match paused until resolution
```

---

## 6. Dispute Resolution (Admin)

**Location**: `/admin/disputes`

### Steps:
1. Admin views disputed matches
2. Sees both player submissions:
   - Claimed scores
   - Screenshots
   - Submission timestamps
3. Reviews evidence:
   - Screenshots
   - Game records (future)
   - Player history
4. Selects winner
5. Adds resolution notes
6. Submits resolution

**System actions**:
1. Dispute status → `resolved`
2. Match status → `completed`
3. Winner recorded
4. Winner advances to next round
5. Loser eliminated
6. Match continues

---

## 7. Match Advancement

**Automatic process**:

### For each completed match:
1. System identifies winner
2. Finds next match in bracket:
   - Same bracket type (winner/loser)
   - Next round number
   - One empty player slot
3. Assigns winner to empty slot
4. If both slots now filled:
   - Sets match status to `ongoing`
   - Sets deadline to 10 minutes
   - Match begins

### Tournament Completion:
1. Final match completes
2. Champion determined
3. Tournament status → `completed`
4. Winners recorded
5. Prize distribution calculated (future)

---

## 8. Player Experience Timeline

### Before Tournament Starts:
- ✅ Register for tournament
- ✅ View participants list
- ✅ Chat with other players
- ✅ See tournament poster and details

### Tournament Started - Waiting:
- ✅ View live bracket
- ✅ See upcoming match (if assigned)
- ✅ Chat with participants
- ⏰ Wait for match to start

### Match Active:
- 🔔 **Notification**: "Your match is now active!"
- ⏰ **Timer**: 10 minutes to complete and submit
- 📱 **Action**: Click "Submit Match Result" button
- 📸 **Upload**: Score and screenshot
- ⏳ **Wait**: For opponent submission
- 🔄 **Check**: Status updates in real-time

### Match Ended in Draw:
- 🔄 **Notification**: "Match ended in draw. Replaying!"
- ⏰ **Timer**: Fresh 10-minute deadline
- 📸 **Action**: Submit new result
- 🔁 **Repeat**: Until a winner is determined

### Match Complete - Moving Forward:
- 🎉 **Notification**: "You won! Advancing to next round"
- 📊 **View**: Updated bracket
- ⏰ **Schedule**: Next match assigned
- 🔔 **Alert**: When next match starts

### Match Complete - Eliminated:
- 😔 **Notification**: "You've been eliminated"
- 📊 **View**: Final bracket and winners
- 💬 **Chat**: Still accessible
- 📈 **Stats**: Updated player profile

---

## 9. Database Schema

### Key Tables:

#### `tournaments`
- `id`, `name`, `description`, `poster_url`
- `format`: 'single_elimination' | 'double_elimination'
- `mode`: 'auto_schedule' | 'realtime'
- `status`: 'registration' | 'ongoing' | 'completed' | 'cancelled'
- `max_slots`, `current_players`
- `entry_fee`, `prize_pool`

#### `registrations`
- `tournament_id`, `user_id`
- `status`: 'confirmed' | 'waitlist' | 'eliminated'
- `payment_status`: 'pending' | 'paid' | 'refunded'
- `position_finished`, `prize_amount`

#### `matches`
- `tournament_id`, `round`, `match_number`, `bracket_type`
- `player1_id`, `player2_id`
- `player1_score`, `player2_score`
- `player1_screenshot`, `player2_screenshot`
- `player1_submitted`, `player2_submitted`
- `status`: 'pending' | 'ongoing' | 'completed' | 'disputed' | 'cancelled'
- `winner_id`, `deadline`, `completed_at`

#### `disputes`
- `match_id`
- `status`: 'pending' | 'reviewing' | 'resolved'
- `admin_notes`
- `resolved_by`, `resolved_at`

#### `chat_messages`
- `tournament_id`, `user_id`
- `message`, `created_at`

---

## 10. Key Functions

### Server Actions:

#### `registerForTournament(tournamentId)`
- Validates user and tournament
- Checks for duplicate registration
- Determines confirmed/waitlist status
- Creates registration record
- Updates player count

#### `startTournament(tournamentId)`
- Validates admin permission
- Fetches all confirmed registrations
- Generates bracket structure
- Creates all match records
- Sets Round 1 matches to ongoing
- Updates tournament status

#### `submitMatchResult(formData)`
- Validates user is in match
- Uploads screenshot to storage
- Updates player score and submission
- Checks if both players submitted
- Calls `verifyMatchResults()`

#### `verifyMatchResults(matchId)`
- Compares both submissions
- Determines if clear winner or dispute
- Updates match status
- Advances winner to next round
- Updates player stats
- Handles eliminations

#### `resolveDispute(disputeId, winnerId, adminNotes)`
- Validates admin permission
- Updates dispute and match status
- Advances winner
- Eliminates loser
- Continues tournament flow

---

## 11. Real-Time Features

### Live Updates:
1. **Chat**: Supabase Realtime for instant messaging
2. **Bracket**: Auto-refresh when matches complete
3. **Match Status**: Updated via database triggers
4. **Notifications**: WhatsApp integration (future)

### State Management:
- React `useState` for local state
- Supabase client-side queries for data fetching
- Realtime subscriptions for live updates
- Server actions for mutations

---

## 12. Security

### Authentication:
- All pages require login
- Admin pages require `role = 'admin'`
- Match submissions verify user is player

### Data Validation:
- Server-side checks for all actions
- Sanitized user inputs
- Screenshot storage isolated
- Row Level Security (RLS) enabled

---

## 13. Error Handling

### Common Scenarios:
1. **Registration full**: User placed on waitlist
2. **Submission deadline**: Match auto-forfeited (future)
3. **Score mismatch**: Dispute created
4. **Tournament cancellation**: Refunds processed (future)

### User Feedback:
- Toast notifications for actions
- Clear error messages
- Loading states for async operations
- Success confirmations

---

## 14. Testing the Complete Flow

### Manual Testing Checklist:

1. ✅ Admin creates tournament
2. ✅ Users register (2-8 users)
3. ✅ Admin starts tournament
4. ✅ Bracket generates correctly
5. ✅ Round 1 matches show as active
6. ✅ Players see "Your Active Match"
7. ✅ Players submit results
8. ✅ Automatic verification works
9. ✅ Winners advance correctly
10. ✅ Bracket updates in real-time
11. ✅ Dispute flow works end-to-end
12. ✅ Chat functions properly
13. ✅ Tournament completes

---

## 15. Future Enhancements

### Short-term:
- [ ] WhatsApp notifications
- [ ] Deadline countdown timers
- [ ] Auto-forfeit on missed deadline
- [ ] Payment integration (M-PESA)
- [ ] Prize distribution automation

### Long-term:
- [ ] Live match streaming
- [ ] Automated result verification
- [ ] AI dispute resolution
- [ ] Tournament templates
- [ ] Player rankings/leaderboards

---

## 16. Support Resources

### Key Files:
- `src/app/actions/tournaments.ts` - Tournament actions
- `src/app/actions/matches.ts` - Match logic
- `src/components/tournaments/` - Tournament UI
- `src/lib/bracket-generator.ts` - Bracket algorithms
- `src/app/dashboard/tournaments/[id]/page.tsx` - Detail page

### Database:
- Supabase project: `nbmokkozxorqwypjvzye`
- Schema: `public` database
- Storage: `match-screenshots`, `tournament-media` buckets

---

**Last Updated**: 2025
**Version**: 1.0

