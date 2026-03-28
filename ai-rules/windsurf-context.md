## SYSTEM OVERVIEW

This system is CodnestX Pre-Sales OS.

Purpose:
To manage complete sales lifecycle from raw contacts to deal closure.

Flow:
Contact → Call → Lead → Requirement → Meeting → Solution → Proposal → Follow-up → Deal



## MODULES

1. RBAC System
- Manage roles and permissions

2. Company Management
- Manage companies and link contacts/leads

3. Contact Management
- Store raw contacts
- Convert to leads

4. Call Engine
- Auto dial contacts
- Record calls

5. Lead Management
- Track lead lifecycle
- Maintain activity timeline

6. Assignment Engine
- Assign leads to sales

7. Requirement Module
- Capture client requirements

8. Meeting Scheduler
- Schedule meetings with clients

9. Solution Builder (SOW)
- Create technical solution document

10. Proposal Maker
- Generate proposals

11. Pricing Engine
- Apply pricing logic

12. Follow-up Engine
- Automate follow-ups

13. POC Module
- Manage proof of concept

14. Notification Engine
- Send alerts

15. Dashboard
- Analytics and insights


## FLOW LOGIC

1. Admin uploads contacts
2. System creates company + contact mapping
3. Contacts go into auto-dial queue
4. Telecaller calls contact

5. Based on call outcome:
   - Interested → Lead created
   - Not Interested → Mark lost
   - No Answer → Retry

6. Lead is assigned to sales

7. Sales process:
   - Requirement call
   - Update requirement document
   - Assign key leader
   - Schedule meeting

8. Key leader:
   - Joins meeting
   - Creates solution (SOW)

9. If POC required:
   - Assign developer
   - Build POC
   - Present POC

10. Proposal:
   - Generate proposal
   - Apply pricing
   - Admin approval
   - Send to client

11. Follow-up:
   - Email
   - WhatsApp
   - Reminder

12. Final decision:
   - Won
   - Lost


## USER ROLES

- Admin
- Telecaller
- Sales
- Key Leader
- Developer

Rules:
- Role-based access control mandatory
- Permissions should be module-based


## SYSTEM RULES

- Every lead must have activity timeline
- Contact → Lead conversion must retain history
- Proposal must go through approval
- Follow-up must be automated
- All modules must be connected via flow
- No module should work independently


## TECH RULES

- Use MERN stack
- Follow MVC architecture
- Use service layer
- Maintain clean folder structure
- Use reusable components
- Follow API standardization