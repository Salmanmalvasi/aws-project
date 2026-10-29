# IPL Live Analytics — 5-Minute Presenter Walkthrough Runbook

This runbook guides a presenter through a polished, reliable 5-minute technical demonstration of the **IPL Live Analytics Platform**.

---

## Quick Reference & Environment

| Property | Value |
|---|---|
| **Public Hosting URL** | `http://ipl-live-analytics-748009208411-eu-north-1-production.s3-website.eu-north-1.amazonaws.com/` |
| **AWS Region** | `eu-north-1` (Europe Stockholm) |
| **Hosting Infrastructure** | Amazon S3 Static Website Hosting (Bucket-Level Website Configuration) |
| **Technology Stack** | React 18, Vite, Vanilla CSS, SVG Visualization Engine |
| **Data Engine Mode** | Client-Side Deterministic In-Play Simulation Engine |

---

## 5-Minute Presentation Script & Click Sequence

### Step 1: Opening & Match Situation (0:00 – 0:45)
1. **Navigate to the Home Page** (`#live`):
   - Point out the **Editorial Black & White Theme** with restrained emerald green (boundaries) and crimson red (wickets).
   - Show the **Header Telemetry Ribbon**: Clearly explains that the application runs an interactive client-side simulation engine hosted directly on AWS S3 in `eu-north-1`.
2. **Explain the Match State**:
   - Primary fixture: **Chennai Super Kings (CSK)** chasing **188 runs** set by **Royal Challengers Bengaluru (RCB)** at MA Chidambaram Stadium, Chepauk.
   - Point out the large, high-visibility score counter (`154/3 in 15.0 overs`) designed for distance readability during screen shares.
   - Highlight the **Dynamic Chase Bar**: Calculates required run rate (RRR), current run rate (CRR), balls remaining, and wickets in hand in real time.

---

### Step 2: Match Scenario Selection & Simulation (0:45 – 1:30)
1. **Scenario Selection (0/0 Fresh Start vs 15.0 ov Climax)**:
   - Point out the scenario buttons in the top toolbar: `⚡ Start 0/0 (0.0 ov)` and `🔥 15.0 ov Climax`.
   - Click `⚡ Start 0/0 (0.0 ov)`: Notice how the match resets to **0/0 (0.0 ov)** with openers **Ruturaj Gaikwad** and **Rachin Ravindra** walking in to face ball 0.1.
   - Explain to the evaluator: *"We built full scenario flexibility so you can observe the match from ball 0.1 or jump into the death overs climax."*
2. **Demonstrate Manual Delivery Stepping**:
   - Click `▶| Step 1 Ball` to manually bowl ball 0.1 on demand. Observe the wagon wheel plot the very first trajectory and the score tick to 1/0.
   - Click `🔥 15.0 ov Climax` to jump directly into the high-pressure chase finish.
3. **Demonstrate Automated Simulation & Pause**:
   - In the top simulation bar, point out the **STREAM ACTIVE** status and speed selector (`1x Normal`, `2x Fast`, `5x Turbo`, `0.5x Slow`).
   - Click `⏸ Pause` to pause the delivery stream, demonstrating deterministic presenter control.

---

### Step 3: Interactive Event Triggers (1:30 – 2:30)
1. **Trigger a Boundary Four**:
   - Click the `+4 FOUR` button.
   - **Observe**:
     - The score increases by 4.
     - The striker's runs and boundaries count increment.
     - A green `4` badge appears in the recent deliveries strip.
     - The **360° Wagon Wheel** instantly plots a green trajectory line to the cover boundary.
     - A live commentary item appears in the commentary feed: *"threads the needle between cover and backward point with surgical precision for FOUR! 🏏"*
2. **Trigger a Maximum Six**:
   - Click the `+6 SIX` button.
   - **Observe**:
     - The score increases by 6.
     - A bright emerald green `6` badge appears.
     - The wagon wheel plots a long trajectory clearing the boundary rope into the stands.
     - Live commentary updates with a descriptive broadcast event.
3. **Trigger a Wicket**:
   - Click `WICKET!`.
   - **Observe**:
     - Score wickets count increments by 1.
     - A crimson red `W` badge appears.
     - Strike rotates to the new incoming batter (e.g., MS Dhoni).
     - The partnership stand is archived and reset.
     - Commentary notes the dismissal: *"WICKET! Castled! A scorching 144kph yorker shatters the base of off-stump!"*
4. **Trigger a Wide Extra**:
   - Click `Wide`.
   - **Observe**:
     - Score increases by 1 extra run.
     - Crucially, **legal balls bowled do not advance**, adhering strictly to cricket scoring rules.

---

### Step 4: Analytics Deep Dive (2:30 – 3:30)
1. **Click the `Analytics` Tab** (`#analytics`):
   - **Runs Per Over Bar Chart**: Explains scoring acceleration, with wicket overs highlighted in crimson red.
   - **Worm Chart**: Shows the actual chase trajectory compared against the required target line.
   - **Phase Breakdown**: Compares run rates across the Powerplay (overs 1–6), Middle Phase (overs 7–15), and Death Phase (overs 16–20).
   - **Bowling Threat Matrix**: Displays economy rates, dot-ball percentages, and wickets per bowler.
2. **Data Integrity Note**:
   - Highlight the notice at the bottom stating all charts are computed directly from the active delivery event stream.

---

### Step 5: Players & Compare (3:30 – 4:15)
1. **Click `Players`** (`#players`):
   - Show the batting scorecard with strike rates and control indices.
   - Test the **Search & Role Filter**: Filter by "Batters Only" or search for "Dube".
   - Point out the Boundary Count card showing total 4s and 6s.
2. **Click `Compare`** (`#compare`):
   - Show the head-to-head comparison between CSK and RCB.
   - Explain the 100% proportional horizontal bars comparing Powerplay scores, death-over run rates, boundary %, and dot-ball %.
   - Highlight that lower values are highlighted properly for Bowling Economy.

---

### Step 6: Platform Architecture & Roadmap (4:15 – 5:00)
1. **Click `Platform & Cloud`** (`#platform`):
   - Walk through the **Active Deployment Architecture**:
     - Client browser -> Amazon S3 static website hosting in `eu-north-1` -> React 18 SPA with deterministic in-memory simulation.
   - Walk through the **Target Integration Roadmap**:
     - Planned AWS backend: Ingestion WebSocket feed -> API Gateway -> EC2/ECS microservices running XGBoost in-play inference -> Redis ElastiCache for active crease state.
   - Click `Execute Engine Diagnostics` to demonstrate working health check feedback.
2. **Resetting for the Next Demo**:
   - Click `↺ Reset Match` in the top simulation toolbar.
   - The entire match returns to the baseline state (`154/3`), ready for another seamless walkthrough.

---

## Key Talking Points for Evaluators

1. **Strictly No Blue/Cyan**:
   - Complete bespoke monochrome design system with green and red functional accents.
2. **Zero Fake Metrics**:
   - Transparently labels demo simulation capabilities, avoiding misleading claims about live official feeds.
3. **Rigorous Cricket Logic**:
   - Wides do not increment balls; legal balls govern over completion; strike rotates accurately on odd runs and over ends.
4. **AWS Native Deployment**:
   - Successfully running on Amazon S3 Static Website Hosting directly on AWS infrastructure in `eu-north-1`.
