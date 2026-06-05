# ⚡ CatchUp — Smart Payment Recovery & Follow-up Assistant

CatchUp is a self-hosted SaaS platform designed for freelancers, agencies, and contract developers. It solves the critical problem of **lost revenue from unpaid invoices and ghosted proposals**. 

By connecting your leads pipeline to an automated follow-up engine and Stripe checkout links, CatchUp ensures that no pending deal slips through the cracks. It turns outstanding proposals and invoices into active recovery pipelines.

**🌐 Live Demo:** [https://catchup-x6sy.onrender.com/](https://catchup-x6sy.onrender.com/)

---

## 📖 Table of Contents
1. [Core Problem & Solution](#-core-problem--solution)
2. [How It Works: The Automated Recovery Loop](#%EF%B8%8F-how-it-works-the-automated-recovery-loop)
3. [Key Features](#-key-features)
4. [Technical Architecture](#-technical-architecture)
5. [Local Development & Setup](#-local-development--setup)
6. [UI/UX & Mobile Responsiveness](#-uiux--mobile-responsiveness)

---

## 💡 Core Problem & Solution

### The Problem
Freelancers and small agencies lose an average of **15% to 20% of their earned revenue** simply because clients forget to pay invoices, ignore follow-up emails, or ghost after receiving project proposals. Chasing down these clients manually is time-consuming, awkward, and easy to forget.

### The Solution
CatchUp automates this entire process. You input your pending deals or invoices into your dashboard. The system then:
1. Tracks how long a deal has been waiting.
2. Automatically sends friendly, custom-templated follow-up emails via SMTP.
3. Attaches direct Stripe checkout payment links.
4. Receives Stripe webhook notifications to instantly mark deals as "Paid" and log the recovery metrics.

---

## ⚙️ How It Works: The Automated Recovery Loop

```
[ New Pending Lead ] ──> [ Days Waiting Counter Increases ]
                                 │
                                 ▼
                     ( Target Days Reached? )
                                 │
                       ┌─────────┴─────────┐
                      YES                  NO
                       │                   │
                       ▼                   ▼
           [ Automated SMTP Email ]    [ Keep Counting ]
         (Includes Stripe Pay Link)
                       │
                       ▼
            [ Client Pays on Stripe ]
                       │
                       ▼
          [ Webhook Event Received ]
       (checkout.session.completed)
                       │
                       ▼
     [ Status -> Recovered/Paid ] ──> [ Live Dashboard Updates ]
```

---

## 🚀 Key Features

*   **Automated Drip Follow-ups**  
    Set your customized follow-up delay (e.g., 4 days) and templates globally or per lead. The automation engine runs continuously in the background, updating lead age and sending out emails automatically.
    
*   **Stripe 1-Click Payments**  
    Generate dynamic, secure Stripe checkout sessions on the fly. When a lead reaches its follow-up date, CatchUp generates a checkout link, injects it into the follow-up email, and logs the event.
    
*   **Instant Webhook Processing**  
    A backend webhook listener (`/api/webhooks/stripe/:userId`) verifies incoming events from Stripe. The moment a client completes a checkout payment, the lead is updated to `Paid` / `Recovered` and an activity log is created.

*   **AI Revenue Forecasting**  
    Uses historical data and active pipeline metrics to predict your monthly revenue. Includes an estimated expected recovery count (based on a 20% average recovery probability) and expected payout value.

*   **Dynamic Analytics Dashboard**  
    An active visual workspace summarizing:
    *   **Total Leads**: Current active deals in the system.
    *   **Unrecovered Value**: Total outstanding deal value in your active pipeline.
    *   **Recovered Revenue**: Total invoice volume successfully salvaged.
    *   **AI Recovery Impact**: A progress indicator mapping the success rate of automated follow-ups vs. manual efforts.
    *   **Integration Health Check**: Real-time diagnostic cards showing if your Stripe API key and SMTP settings are valid or require action.

---

## 🛠 Technical Architecture

CatchUp is built as a lightweight, performant, and self-hostable full-stack application.

*   **Frontend (catchup-app)**:
    *   **Core**: React.js (Vite)
    *   **Icons**: Lucide React
    *   **Styling**: Pure CSS Variables, offering a responsive, CSS-animated grid system and smooth micro-interactions.
    
*   **Backend (catchup-backend)**:
    *   **Server**: Node.js, Express.js
    *   **Database**: SQLite (`catchup.db`) for lightweight, serverless persistence.
    *   **Mailing**: Nodemailer (supporting both SMTP mail servers and sandbox simulation modes).
    *   **Payments**: Official Stripe SDK integration.

---

## 💻 Local Development & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   Stripe Account (for test/live keys)

### Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Faizan-Niazi/CatchUp.git
    cd CatchUp
    ```

2.  **Install Dependencies**:
    *   For the frontend:
        ```bash
        cd catchup-app
        npm install
        ```
    *   For the backend:
        ```bash
        cd ../catchup-backend
        npm install
        ```

3.  **Environment Variables**:
    Create a `.env` file in `catchup-backend/` if you wish to override default ports or JWT configurations:
    ```env
    PORT=5000
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Launch the Servers**:
    *   Start the Express backend:
        ```bash
        cd catchup-backend
        npm run start
        ```
    *   Start the React frontend dev server:
        ```bash
        cd catchup-app
        npm run dev
        ```

5.  **Access the App**:
    Open [http://localhost:5173](http://localhost:5173) in your browser. Register a new user, navigate to **Settings** to set up your SMTP or Stripe details, and begin adding leads.

---

## 🎨 UI/UX & Mobile Responsiveness

CatchUp features a meticulously designed, dark-mode-ready interface engineered to look premium on all screens.

*   **Mobile Settings Drill-down**: On screen widths `< 768px`, the multi-tab settings screen converts into a native-style drill-down menu, keeping the layout clean and easy to navigate with thumbs.
*   **Top Navigation Adaptation**: Action headers flex cleanly, and the search input collapses into a sleek mobile search modal.
*   **Space-Saving Controls**: On ultra-small screens (`< 500px`), primary buttons morph into compact circular buttons (e.g. "+ New Lead" becomes a simple green `+` circle).
*   **Click-Outside Dismissals**: All dialogs, notification bell overlays, and dropdown menus automatically close when tapping outside the active element container.
*   **Light / Dark Theme**: A complete theme switcher instantly swaps between a clean white layout and a deep slate dark mode.
