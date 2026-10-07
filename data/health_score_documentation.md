# Implementation Health Score - Technical Documentation

> [!NOTE]
> **Prototype System Disclaimer**: The Implementation Health Score is an AI/Decision Support System (DSS) prototype indicator developed specifically for this WebGIS monitoring project using synthetic and prototype FRA dataset records. It is designed to demonstrate interpretable, data-driven operational analytical capabilities and should not be claimed as an officially published government standard.

---

## 1. Overview & Purpose
The **Implementation Health Score** provides a transparent, reproducible, and data-driven 0–100 composite score reflecting the operational efficiency and administrative condition of Forest Rights Act (FRA) claims implementation. 

Scores are computed dynamically at two hierarchical levels:
- **System-Level Overall Score**: Evaluates the state-wide / entire 5,000-claim dataset condition.
- **District-Wise Health Score**: Evaluates each individual district using that district's specific claims subset.

---

## 2. Core Implementation Indicators
The composite score synthesizes 5 measurable indicators extracted directly from the PostgreSQL `claims` database table:

| Indicator | Symbol | Database Source Field | Operational Orientation | Weight |
| :--- | :---: | :--- | :--- | :---: |
| **Resolution Rate** | $I_{res}$ | `status` ('Approved', 'Rejected') | Higher is Better (Positive) | **25%** |
| **Pending Rate** | $I_{pending}$ | `status` ('Pending') | Higher is Worse (Negative) | **20%** |
| **Long-Pending Rate** | $I_{long}$ | `status` == 'Pending' & `pending_days` >= 180 | Higher is Worse (Negative) | **25%** |
| **Processing Efficiency** | $I_{proc}$ | `processing_days` (Resolved claims) | Lower duration is Better (Positive) | **15%** |
| **Backlog Workload** | $I_{backlog}$ | Relative non-pending claim ratio | Higher non-pending is Better (Positive)| **15%** |

---

## 3. Indicator Formulas & Normalization Rules

### A. Resolution Rate ($I_{res}$)
$$\text{Resolution Rate} = \frac{\text{Approved Claims} + \text{Rejected Claims}}{\text{Total Claims}} \times 100$$
- **Normalized Score ($S_{res}$)**: Directly mapped from 0 to 100%.
  $$S_{res} = \min(100.0, \max(0.0, \text{Resolution Rate}))$$

### B. Pending Rate ($I_{pending}$)
$$\text{Pending Rate} = \frac{\text{Pending Claims}}{\text{Total Claims}} \times 100$$
- **Normalized Score ($S_{pending}$)**: Inverted linear transformation (0% pending = 100 pts, 100% pending = 0 pts).
  $$S_{pending} = \min(100.0, \max(0.0, 100.0 - \text{Pending Rate}))$$

### C. Long-Pending Rate ($I_{long}$)
Claims pending for $\ge 180$ days are classified as long-pending under operational SLAs.
$$\text{Long-Pending Rate} = \frac{\text{Long-Pending Claims}}{\text{Total Claims}} \times 100$$
- **Normalized Score ($S_{long}$)**: Penalty factor applied to long pendency duration.
  $$S_{long} = \min(100.0, \max(0.0, 100.0 - (2.0 \times \text{Long-Pending Rate})))$$

### D. Processing Efficiency ($I_{proc}$)
Uses the average `processing_days` across decided (Approved or Rejected) claims.
- Benchmark: Ideal processing limit $\le 90$ days (100 pts); upper SLA limit $720$ days (0 pts).
- **Normalized Score ($S_{proc}$)**:
  $$S_{proc} = \begin{cases} \min\left(100.0, \max\left(0.0, 100.0 \times \frac{720.0 - \text{avg\_processing\_days}}{720.0}\right)\right) & \text{if resolved claims exist} \\ 50.0 & \text{if no resolved claims exist} \end{cases}$$

### E. Workload / Backlog Capacity ($S_{backlog}$)
$$\text{Workload Capacity Score} = \min(100.0, \max(0.0, 100.0 - \text{Pending Rate}))$$

---

## 4. Final Health Score Composite Formula

$$\text{Health Score} = 0.25(S_{res}) + 0.20(S_{pending}) + 0.25(S_{long}) + 0.15(S_{proc}) + 0.15(S_{backlog})$$

The final score is rounded to two decimal places and strictly bounded within $[0.0, 100.0]$.

---

## 5. Health Categories & Actionable Recommendations

| Score Range | Category | Operational Recommendation |
| :---: | :---: | :--- |
| **80 – 100** | <span style="color:green;font-weight:bold">Healthy</span> | Implementation indicators are highly favorable with high resolution rates and minimal long-pending claim backlog. |
| **60 – 79** | <span style="color:blue;font-weight:bold">Moderate</span> | Implementation indicators are generally stable; regular monitoring of pending claims and processing timelines is advised. |
| **40 – 59** | <span style="color:orange;font-weight:bold">Needs Attention</span> | Pending workload and processing durations require operational intervention and targeted resource allocation to clear backlogs. |
| **0 – 39** | <span style="color:red;font-weight:bold">Critical</span> | Implementation indicators show severe bottlenecks with high long-pending rates, requiring urgent administrative review and workflow escalation. |

---

## 6. API Endpoints

### 1. Overall System Health Score
- **URL**: `GET /ai/health-score`
- **Response Schema**: `OverallHealthScoreResponse`
- **Example Response Payload**:
```json
{
  "total_claims": 5000,
  "approved_claims": 2776,
  "pending_claims": 1503,
  "rejected_claims": 721,
  "resolved_claims": 3497,
  "long_pending_claims": 1368,
  "resolution_rate": 69.94,
  "pending_rate": 30.06,
  "long_pending_rate": 27.36,
  "average_processing_days": 462.81,
  "health_score": 58.64,
  "health_category": "Needs Attention",
  "recommendation": "Pending workload and processing durations require operational intervention and targeted resource allocation to clear backlogs.",
  "components": {
    "resolution_rate": 69.94,
    "pending_rate": 30.06,
    "long_pending_rate": 27.36,
    "average_processing_days": 462.81,
    "backlog_indicator": 30.06,
    "resolution_rate_score": 69.94,
    "pending_rate_score": 69.94,
    "long_pending_rate_score": 45.28,
    "processing_days_score": 35.72,
    "backlog_score": 69.94
  }
}
```

### 2. District-Wise Health Scores
- **URL**: `GET /ai/health-score/districts`
- **Response Schema**: `DistrictHealthScoreListResponse`
- **Description**: Returns district-wise scores for all districts along with the system overall summary.

---

## 7. Frontend Integration
The module is integrated into the AI/DSS section (`frontend/src/pages/AIDSS.jsx`) featuring:
1. **Overall Health Card & Score Gauge**: An SVG circular progress indicator rendering category-themed colors.
2. **Explainability Component Breakdown**: Transparent progress bars rendering sub-scores for all 5 indicators.
3. **District Health Ranking Table**: Interactive table supporting real-time search, sorting (by score, name, pendency, long pendency), category pill badges, and row selection.
4. **District Detail Inspector**: Clickable drawer/modal providing detailed indicator breakdowns and operational recommendations for any selected district.
5. **Theme Support**: Seamless responsiveness across light and dark modes using standardized CSS custom properties.
