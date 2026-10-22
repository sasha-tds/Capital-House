**CAPITAL HOUSE**

**SCOPE OF WORK (SOW) --- UPDATED ESTIMATION**

# 1. Web Application --- Core & Mandatory Modules

Estimated Effort: 200--240 hrs / 25--30 working days

  -----------------------------------------------------------------------
  **Module**              **Description**         **Estimated Effort**
  ----------------------- ----------------------- -----------------------
  Training &              Training content,       14--18 hrs
  Documentation           learning materials,     
                          document library, staff 
                          progress and completion 
                          tracking.               

  Lead Management         Lead creation,          24--30 hrs
                          assignment, stages,     
                          source tracking,        
                          follow-ups, reminders,  
                          notes and conversion.   

  Renewal Management      Upcoming renewals,      18--24 hrs
                          expiry tracking,        
                          reminders, follow-ups,  
                          status and renewal      
                          history.                

  Calling & Follow-up     Call records, remarks,  16--20 hrs
  Management              callback scheduling,    
                          activities and activity 
                          history.                

  Client & Family         Client profiles, family 22--28 hrs
  Management              members, contact        
                          details, documents,     
                          relationships and       
                          history.                

  Policy Management       Policy details,         28--34 hrs
                          members, coverage,      
                          documents, status,      
                          expiry and policy       
                          history.                

  Quotation Management    Quotation creation,     22--26 hrs
                          comparison, premium     
                          details, status,        
                          follow-up and           
                          conversion tracking.    

  Payment Management      Payment records,        16--20 hrs
                          pending payments,       
                          status, receipts,       
                          collection tracking and 
                          history.                

  Portability Management  Portability requests,   12--16 hrs
                          existing/new policy     
                          details, document       
                          collection, status and  
                          follow-ups.             

  Notifications           System notifications,   10--12 hrs
                          renewal, follow-up,     
                          payment and task        
                          alerts.                 

  WhatsApp Marketing      Templates, campaigns,   18--22 hrs
                          individual/bulk         
                          messaging, reminders    
                          and delivery/status     
                          tracking.               
  -----------------------------------------------------------------------

Section estimate is consolidated at 25--30 working days, accounting for
shared Web architecture, reusable UI/API components and parallel
implementation.

# 2. Web Application --- Business Management Modules

Estimated Effort: 86--114 hrs / 11--14 working days

  ------------------------------------------------------------------------
  **Module**       **Description**             **Estimated Effort**
  ---------------- --------------------------- ---------------------------
  Ticket / Support Ticket creation,            14--18 hrs
  Management       assignment, priority,       
                   status, communication,      
                   comments, attachments,      
                   escalation and resolution.\ 
                   Task creation, assignment,  
                   priority, due dates,        
                   status, reminders and       
                   activity tracking.          

  Claim Management Claim registration, policy  16--20 hrs
                   mapping, documents,         
                   follow-ups, status and      
                   settlement tracking.        

  Income /         Commission calculation,     14--18 hrs
  Commission       staff commissions,          
  Management       incentives, payout tracking 
                   and commission history.     

  Advanced Reports Sales, staff, branch, lead, 20--28 hrs
  & Analytics      renewal, claim, collection  
                   and revenue analytics.      

  Third-Party      External policy             10--14 hrs
  Policy           entry/import, mapping,      
  Management       validation, tracking and    
                   status management.          
  ------------------------------------------------------------------------

# 3. Mobile Application --- Staff & Client

Estimated Effort: 15--20 working days

  -----------------------------------------------------------------------
  **Application /         **Description**         **Estimated Effort**
  Component**                                     
  ----------------------- ----------------------- -----------------------
  Staff Application       Secure login/RBAC,      6-8 Days
                          dashboard, leads,       
                          clients, policies,      
                          renewals, follow-ups,   
                          tasks and               
                          notifications.          

  Client Application      Secure login,           6-8 Days
                          dashboard,              
                          profile/family,         
                          policies/documents,     
                          renewals, payments,     
                          claims, support/tickets 
                          and notifications.      

  Shared Mobile           API integration,        3-4 Days
  Foundation              authentication,         
                          reusable components,    
                          push notifications and  
                          Android/iOS builds.     
  -----------------------------------------------------------------------

# 4. Mobile Application --- Staff Call Forwarding

Estimated Effort: 7--10 working days

  -----------------------------------------------------------------------
  **Component**           **Description**         **Estimated Effort**
  ----------------------- ----------------------- -----------------------
  Call Forwarding &       Staff call forwarding   3-4 Days
  Telephony               and approved            
                          SIP/telephony           
                          integration, subject to 
                          provider/platform       
                          capabilities.           

  Call Activity           Incoming, outgoing and  2-3 Days
                          missed call activity    
                          with date/time records  
                          and follow-up creation. 

  Admin Monitoring        Admin visibility of     2-3 Days
                          call activity and       
                          related follow-up       
                          information, subject to 
                          Android/iOS permissions 
                          and provider APIs.      
  -----------------------------------------------------------------------

# Technology & System Architecture

  -----------------------------------------------------------------------
  **Layer**                           **Technology**
  ----------------------------------- -----------------------------------
  Web Application                     React + TypeScript

  Backend / API                       Laravel + PHP

  Database                            MySQL / MariaDB

  Mobile Application                  React Native + TypeScript

  Push Notifications                  Firebase Cloud Messaging

  Hosting                             cPanel-compatible Web/API hosting

  Version Control                     Git

  Telephony                           Approved SIP / Telephony Provider
  -----------------------------------------------------------------------

# cPanel & Mobile Application --- Hosting Note

cPanel can host the Web Application, centralized Backend/API, database
and required server-side services. The Android and iOS Mobile
Applications are installed on users' devices and distributed through the
Google Play Store and Apple App Store (or other approved distribution
methods). The Mobile Applications connect to the Backend/API hosted on
cPanel. Therefore, cPanel supports the Mobile Application architecture
through backend/API hosting; the mobile app binaries are not hosted as
applications on cPanel.

# Phase 1 --- Overall Effort Summary

  -----------------------------------------------------------------------
  **Section**                         **Estimated Effort**
  ----------------------------------- -----------------------------------
  1\. Web --- Core & Mandatory        25--30 working days

  2\. Web --- Business Management     11--14 working days

  3\. Mobile --- Staff & Client       15--20 working days

  4\. Mobile --- Staff Call           7--10 working days
  Forwarding                          

  Total Phase 1                       58--74 working days
  -----------------------------------------------------------------------

Note: The Web sections use the same Web CRM codebase and shared
infrastructure. The Mobile Staff and Client applications use one React
Native codebase with Android/iOS builds. Estimates are
development-effort ranges and may overlap where parallel development is
feasible.

# Optional Advanced AI

  -----------------------------------------------------------------------
  **Module**                          **Key Features**
  ----------------------------------- -----------------------------------
  AI Meeting Transcription            Speech-to-text transcription

  AI Meeting Summary                  Key points, decisions and action
                                      items

  SIP AI Enhancements                 AI-enabled SIP / voice integration
                                      features
  -----------------------------------------------------------------------

AI features are optional and subject to API availability, technical
feasibility, third-party service limitations and applicable usage
charges.

# Third-Party Integrations

Third-party integrations may include WhatsApp, SMS/Email services,
payment gateways, SIP, Insurance/Policy APIs and other approved
third-party systems. Integration is subject to availability of required
APIs, documentation, credentials, permissions and third-party
capabilities. Third-party subscription, licensing, usage and transaction
charges are separate from the development scope.

# Scope Confirmation

Phase 1 includes the Web Application, Mobile Application for Staff &
Client, and Staff Call Forwarding functionality as defined in Sections
1--4. The Web Application is developed as one unified CRM codebase,
while the Mobile Application uses a separate React Native codebase for
Android and iOS.
