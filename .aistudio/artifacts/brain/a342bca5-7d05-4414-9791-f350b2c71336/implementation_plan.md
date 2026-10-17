# Smallholder Farmer Operational Hub (Simple 4-Tab Architecture)

Rework the **Farmer role** navigation tabs and workflows into an authentic, robust, and intuitive 4-tab operational workspace tailored specifically for smallholder farmers in Africa. This streamlines daily farming operations into four clear pillars: **Farm Records & Crop Logs**, **Produce Sales & Co-op Delivery Passes**, **Co-op Bulk Inputs & Subsidies**, and **Instant Payout Wallet & Credit**. All farmer actions directly synchronize with their registered cooperative society and local aggregation warehouse.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Choices from Phase 1:**
> - **Navigation Structure**: **Simple 4-Tab Hub** for the Farmer role:
>   1. `farm_records` (**Farm Records**): Field logs, planting cycles, acreage, harvest yield estimator, crop health, weather & pest calendar.
>   2. `produce_sales` (**Produce Sales**): Direct marketplace produce selling, Cooperative aggregation intake delivery pass with weighbridge code & electronic warehouse receipts (eWR), offtaker supply delivery.
>   3. `farmer_inputs` (**Inputs**): Cooperative bulk input ordering with member discounts, subsidized fertilizer/seed packages, pickup tracking.
>   4. `wallet` (**Wallet**): Instant harvest payout wallet, bank transfer cashout simulator, input loans/credit status with harvest deduction commitments.
>   *(Plus `profile` for identity verification, NIN, cooperative membership cluster, and farm coordinates).*
> - **Prioritized Smallholder Tools**:
>   - Warehouse intake passes & digital warehouse receipts (eWR).
>   - Cooperative bulk input ordering with member wholesale discounts.
>   - Interactive farm field log with harvest yield estimator.
>   - Hyperlocal weather, pest alerts, and agronomic calendar.
>   - Instant harvest payout wallet with bank settlement simulator.
> - **Cooperative Integration**: **Direct sync** — farmer grain deliveries register directly into the cooperative warehouse inventory; bulk input orders contribute to cooperative group buying quotas; seasonal input loans synchronize with the cooperative credit ledger.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms the farmer interface from a generic e-commerce app into a practical, field-ready farm companion. A farmer can log their planting plots, check real-time hyperlocal rain/pest alerts, order discounted inputs via their cooperative cluster, generate a 6-digit delivery pass for grain truck drop-off at the co-op aggregation center, view verified moisture and grain grade receipts, and withdraw harvest earnings to their Nigerian bank account.
- **Target Audience / Persona**: Smallholder grain and legume farmers (e.g. Maize, Soya, Sorghum, Millet, Rice, Cassava) operating 1 to 10 hectares across agricultural farming communities.
- **Key Value**: Radically simplifies complex agtech operations into plain, everyday language and 4 clear tabs while guaranteeing full data traceability and fair market pricing through cooperative integration.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Farm Records & Field Management (`farm_records`)*:
     - Farmer views their active farm fields (e.g., "North Maize Plot — 3.0 Ha", "Upland Soya Plot — 1.5 Ha").
     - Interactive **"Log New Field / Crop Cycle"** drawer: input crop, acreage, planting date, variety (e.g., SAMMAZ 15 Hybrid), and soil prep.
     - **Yield Estimator**: Calculates expected harvest in metric tons (MT) and 50kg bags based on acreage and expected rainfall.
     - **Weather & Agronomy Card**: 7-day weather forecast, rain risk percentage, humidity, spray advisory, and active pest warnings (e.g., Fall Armyworm alert).
  2. *Produce Sales & Warehouse Delivery Passes (`produce_sales`)*:
     - **Two Channels**: (A) Sell to Cooperative Aggregation Warehouse, (B) Direct Agro Marketplace Listing.
     - **Generate Warehouse Intake Pass**: Farmer selects crop, estimated bags/tonnage, and drop-off date. Generates an instant **6-Digit Delivery Passcode & QR Stamp** for the cooperative weighbridge.
     - **Digital Warehouse Receipts (eWR)**: Shows verified deliveries with moisture %, quality grade (Grade A/B/C), gross/net weight, and credited value in ₦.
  3. *Cooperative Bulk Inputs (`farmer_inputs`)*:
     - Farmer browses active cooperative bulk purchasing campaigns (e.g., NPK 15-15-15, Urea 46% N, Certified Hybrid Maize Seeds).
     - Highlights **Member Savings** (e.g., ₦31,500/bag vs open market ₦38,500/bag).
     - Simple 1-click **"Join Group Order"** with payment selection: Instant Wallet deduction OR Harvest Crop Lien.
     - Pickup tracking: Shows depot allocation status and collection code.
  4. *Harvest Payout Wallet & Credit (`wallet`)*:
     - High-visibility available balance card in ₦ with single-line zero-pill layout.
     - Breakdown of earnings: Produce Sales, Escrow Payouts, Warehouse settlements.
     - Interactive **"Withdraw to Bank"** modal: Select bank (Zenith, Access, GTBank, First Bank, Kuda), enter account number, verify account name, and receive instant settlement.
     - **Input Loan & Lien Status**: Transparently shows any pending harvest deductions (e.g., 2 bags of maize pledged per fertilizer bag) to prevent dispute at harvest.

- **Visual Identity & Theme**:
  - *Color Palette*:
    - Canvas: Fresh, clean agricultural light slate `#f8faf9` and crisp white `#ffffff`.
    - Deep Forest Green Brand: `#012d1d` (primary headers, high-intent action buttons).
    - Agricultural Accents: Emerald `#1b4332` / `#c1ecd4`, warm harvest gold `#ffdeac` / `#d97706`.
    - Hairline Structural Borders: `border border-[#c1c8c2]` (no thick left borders or nested card clutter).
  - *Typography & Tabular Discipline*:
    - Font Family: Plus Jakarta Sans / DM Sans for maximum legibility in outdoor bright sunlight.
    - Tabular Figures: `font-variant-numeric: tabular-nums` for all acreage, metric tons, bag counts, and Naira values.
    - Zero-Pill Rule: Metadata presented cleanly with typographic separators (`·` or `/`), never wrapped in static candy pills.
    - Touch Targets: All buttons and selectable rows have $\ge 44\text{px}$ touch targets for easy thumb navigation on mobile phones in the field.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Streamlined 4-Tab Navigation vs Complex 7-Tab Layout**:
  - *Chosen Approach*: Consolidate farmer navigation to 4 intuitive primary tabs: **Farm Records**, **Produce Sales**, **Inputs**, **Wallet** (plus profile settings in header/sidebar).
  - *Why*: Smallholder farmers find deep nested menus confusing. Grouping field logs + weather under "Farm Records", and co-op warehouse passes + market listings under "Produce Sales", creates a clean mental model that matches their seasonal journey.
  - *Alternatives Considered*: Keeping separate "Weather", "Advisory", "Marketplace", "Credit", "Orders", and "Wallet" tabs created duplicate navigation and overwhelming clutter.
- **Decision 2: Direct State Synchronization with Cooperative Operational Hub**:
  - *Chosen Approach*: When a farmer submits a warehouse delivery pass, it registers as a pending/verified delivery in the cooperative's warehouse database. When a farmer joins a bulk input campaign, the cooperative's group buying quota automatically increments.
  - *Why*: Eliminates disconnected data silos; allows testing both Farmer and Cooperative roles in the app to see immediate real-world cause-and-effect.
- **Decision 3: Transparent Harvest Deductions (Crop Liens)**:
  - *Chosen Approach*: Clearly link input credit to pledged harvest bags rather than abstract interest rates.
  - *Why*: Reflects real African smallholder outgrower models where input loans are repaid in physical grain bags at harvest.

---

### 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App State (AppContext)                          │
│   coopMembers · warehouseIntakes · bulkInputCampaigns · memberLoans    │
│   farmPlots · weatherData · listings · orders · wallet · auditLogs     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│     SidebarNav / BottomNav      │   │     Cooperative Direct Sync     │
│   [1] Farm Records              │   │   • Warehouse Intake Receipts   │
│   [2] Produce Sales             │   │   • Bulk Input Campaign Quotas  │
│   [3] Inputs & Subsidies        │   │   • Member Seasonal Loan Ledger │
│   [4] Payout Wallet & Credit    │   └─────────────────────────────────┘
└───────────────┬─────────────────┘
                │
                ├──► FarmRecordsView.tsx
                │    ├── FieldPlotManager & Acreage Tracker
                │    ├── HarvestYieldCalculator (MT / Bags)
                │    └── HyperlocalWeather & PestAlertsCard
                │
                ├──► ProduceSalesView.tsx
                │    ├── WarehouseDeliveryPassModal (6-digit PIN & QR)
                │    ├── VerifiedElectronicWarehouseReceipts (eWR)
                │    └── AgroMarketplaceListingManager
                │
                ├──► FarmerInputsView.tsx
                │    ├── Co-opBulkCampaignCard & Member Savings
                │    ├── JoinGroupOrderModal (Cash vs Crop-Lien)
                │    └── DistributionDepotPickupStatus
                │
                └──► FarmerWalletView.tsx
                     ├── InstantPayoutBalance & Escrow Tracker
                     ├── BankWithdrawalSimulator (NIBSS Instant Transfer)
                     └── CropLienRepaymentLedger (Harvest Deductions)
```

### 5. Implementation Steps (Upon Approval)

1. **Types & Domain Models (`src/types/index.ts`)**:
   - Add `FarmPlot` interface (plot name, acreage, crop, planting date, stage, health status, estimated yield).
   - Ensure `FarmerDeliveryPass` and payment lien statuses link seamlessly with existing `WarehouseIntake` and `BulkInputCampaign`.
2. **Context State & Sync Handlers (`src/context/AppContext.tsx`)**:
   - Add `farmPlots` state with realistic initial plots for the logged-in farmer.
   - Add `addFarmPlot`, `updateFarmPlotStage`, `generateDeliveryPass`, `orderBulkInputForFarmer`, and `withdrawFromWallet`.
   - Ensure two-way synchronization: farmer delivery passes update the cooperative warehouse view, and bulk orders update cooperative campaigns.
3. **Dedicated Farmer Views (`src/views/farmer/`)**:
   - `FarmRecordsView.tsx`: Active fields, add-plot modal, yield calculator, 7-day weather, and pest advisory.
   - `ProduceSalesView.tsx`: Warehouse aggregation drop-off pass generator, digital receipts display, and produce listing manager.
   - `FarmerInputsView.tsx`: Group discount input catalog, group buying quota progress, order placement with crop lien option.
   - `FarmerWalletView.tsx`: Available balance, earnings history, instant bank transfer modal, and loan/lien deductions tracker.
4. **Navigation Integration**:
   - Update `SidebarNav.tsx` and `BottomNav.tsx` to display the streamlined 4 tabs for `farmer`:
     - `farm_records` ("Farm Records")
     - `produce_sales` ("Produce Sales")
     - `farmer_inputs` ("Co-op Inputs")
     - `wallet` ("Wallet & Payouts")
   - Update `App.tsx` router to render the new farmer views.
5. **Testing & Verification**:
   - Verify TypeScript compilation via `compile_applet`.
   - Verify linting standards via `lint_applet`.
