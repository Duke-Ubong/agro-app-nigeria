import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Order, Listing } from '../../types';

interface HarvestBatch {
  id: string;
  cropName: string;
  category: 'Grains' | 'Tubers' | 'Vegetables';
  cropType: string;
  availableBags: number;
  bagWeightKg: number;
  totalTonnes: number;
  moisturePercent: number;
  storageType: string;
  warehouseLocation: string;
  benchmarkPricePerBag: number;
  middlemanPricePerBag: number;
  harvestDate: string;
  imageUrl: string;
}

const INITIAL_BATCHES: HarvestBatch[] = [
  {
    id: 'batch_zm_1',
    cropName: 'Dry Yellow Maize (Certified Grain)',
    category: 'Grains',
    cropType: 'Maize',
    availableBags: 85,
    bagWeightKg: 100,
    totalTonnes: 8.5,
    moisturePercent: 12.6,
    storageType: 'PICS Hermetic Triple-Layer Bags',
    warehouseLocation: 'Zaria Farmers Co-op Silo Bay 4, Kaduna',
    benchmarkPricePerBag: 37000,
    middlemanPricePerBag: 28500,
    harvestDate: 'Jan 2025',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'batch_sy_2',
    cropName: 'Grade-A Clean Soybeans (TGX Variety)',
    category: 'Grains',
    cropType: 'Soybeans',
    availableBags: 30,
    bagWeightKg: 100,
    totalTonnes: 3.0,
    moisturePercent: 11.2,
    storageType: 'Moisture-Proof Poly Sacks',
    warehouseLocation: 'Zaria Seed Depot, Kaduna',
    benchmarkPricePerBag: 42000,
    middlemanPricePerBag: 33000,
    harvestDate: 'Feb 2025',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'batch_cs_3',
    cropName: 'High-Starch TME 419 Cassava Tubers',
    category: 'Tubers',
    cropType: 'Cassava',
    availableBags: 40,
    bagWeightKg: 1000,
    totalTonnes: 40.0,
    moisturePercent: 13.8,
    storageType: 'Farm Storage Heap (Fresh)',
    warehouseLocation: 'Farm Gate Depot, Zaria',
    benchmarkPricePerBag: 85000,
    middlemanPricePerBag: 65000,
    harvestDate: 'Fresh Harvest Ready',
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80',
  },
];

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    marketPrices,
    weatherData,
    setActiveView,
    orders,
    addOrder,
    addListing,
    addTransaction,
    addAuditLog,
  } = useApp();

  const userWeather = weatherData.find((w) => w.state === user.state) || weatherData[0];

  // Dynamic farmer state
  const [batches, setBatches] = useState<HarvestBatch[]>(INITIAL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch_zm_1');
  const [activeStage, setActiveStage] = useState<number>(3);
  const [showAudioSummary, setShowAudioSummary] = useState<boolean>(false);
  const [audioLang, setAudioLang] = useState<'Hausa' | 'English' | 'Yoruba' | 'Igbo'>('Hausa');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-step Quick-Sell Harvest Wizard State
  const [showQuickSellModal, setShowQuickSellModal] = useState<boolean>(false);
  const [sellStep, setSellStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [sellQuantityBags, setSellQuantityBags] = useState<number>(50);
  const [askingPricePerBag, setAskingPricePerBag] = useState<number>(37000);
  const [selectedBuyer, setSelectedBuyer] = useState<string>('Grand Cereals & Animal Feed Ltd');
  const [pickupOption, setPickupOption] = useState<'farm_gate' | 'coop_silo'>('coop_silo');
  const [moistureVerified, setMoistureVerified] = useState<boolean>(true);
  const [moistureProbeScanning, setMoistureProbeScanning] = useState<boolean>(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdReceipt, setCreatedReceipt] = useState<{
    receiptNumber: string;
    orderId: string;
    trackingCode: string;
    totalAmount: number;
    quantityBags: number;
    cropTitle: string;
    buyerName: string;
    escrowHash: string;
    pickupLocation: string;
    issueDate: string;
  } | null>(null);

  // Filter current active batch
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Derived statistics
  const totalStoredTonnes = batches.reduce((acc, b) => acc + (b.availableBags * b.bagWeightKg) / 1000, 0);
  const myOrders = orders.filter((o) => o.sellerId === user.id || o.sellerName === user.name);
  const activeOrder = myOrders.find((o) => o.status === 'in_transit') || myOrders[0];

  // Pipeline stages
  const valueChainStages = [
    {
      step: 1,
      title: '1. Inputs & Subsidies',
      badge: 'Completed',
      badgeColor: 'bg-[#c1ecd4] text-[#002114]',
      summary: '6 Bags Subsidized NPK 20:10:10 Vouchers Claimed',
      actionLabel: 'Order Inputs',
      actionView: 'marketplace',
    },
    {
      step: 2,
      title: '2. Cultivation & Field Care',
      badge: 'Optimal',
      badgeColor: 'bg-[#c1ecd4] text-[#002114]',
      summary: `${user.farmSizeHectares || 4.5} Ha Under Management • Soil Moisture 58%`,
      actionLabel: 'Field Weather',
      actionView: 'advisory',
    },
    {
      step: 3,
      title: '3. Harvest & Quality Storage',
      badge: `${totalStoredTonnes.toFixed(1)} MT Ready`,
      badgeColor: 'bg-[#10b981] text-[#022c1b]',
      summary: `${batches[0].availableBags} Bags Maize in PICS Hermetic Sacks (12.6% Moisture)`,
      actionLabel: 'Sell Harvest Now',
      actionView: 'quick_sell',
    },
    {
      step: 4,
      title: '4. Market Contract & Freight',
      badge: `${myOrders.length} Contracts`,
      badgeColor: 'bg-[#ffdeac] text-[#281900]',
      summary: activeOrder ? `${activeOrder.quantity} MT En Route • Waybill #${activeOrder.trackingCode}` : 'Ready for offtake',
      actionLabel: 'Track Satellite GPS',
      actionView: 'orders',
    },
    {
      step: 5,
      title: '5. Guaranteed Escrow Payout',
      badge: 'CBN Secured',
      badgeColor: 'bg-[#c1ecd4] text-[#002114]',
      summary: 'Central Bank Escrow releases automatically upon terminal scan',
      actionLabel: 'View Digital Wallet',
      actionView: 'wallet',
    },
  ];

  const handleOpenSellModal = (batchId?: string) => {
    const targetBatch = batches.find((b) => b.id === (batchId || selectedBatchId)) || batches[0];
    setSelectedBatchId(targetBatch.id);
    setSellQuantityBags(Math.min(50, targetBatch.availableBags > 0 ? targetBatch.availableBags : 10));
    setAskingPricePerBag(targetBatch.benchmarkPricePerBag);
    setSellStep(1);
    setCreatedReceipt(null);
    setShowQuickSellModal(true);
  };

  const handleExecuteContract = () => {
    setIsSubmitting(true);
    const totalAmount = sellQuantityBags * askingPricePerBag;
    const trackingCode = `TRK-NG-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord_${Date.now().toString().slice(-4)}`;
    const receiptNumber = `E-WHR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const escrowHash = `NG-BOA-ESCROW-${Date.now().toString().slice(-6)}-VERIFIED-OK`;
    const destinationState = selectedBuyer.includes('Lagos')
      ? 'Lagos State'
      : selectedBuyer.includes('Jos')
      ? 'Plateau State'
      : selectedBuyer.includes('Kano')
      ? 'Kano State'
      : 'Lagos State';
    const pickupLocation = pickupOption === 'coop_silo'
      ? 'Zaria Farmers Co-op Silo Bay 4, Kaduna'
      : `${user.lga || 'Zaria'} Farm Gate Depot, Kaduna`;
    const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setTimeout(() => {
      // 1. Add real Order to AppContext
      const newOrder: Order = {
        id: orderId,
        listingId: `lst_${Date.now()}`,
        cropTitle: `${currentBatch.cropName} (${sellQuantityBags} Bags)`,
        imageUrl: currentBatch.imageUrl,
        buyerId: 'usr_buyer_corp_1',
        buyerName: selectedBuyer,
        sellerId: user.id,
        sellerName: user.name,
        transporterId: 'usr_transporter_1',
        quantity: sellQuantityBags,
        unit: `${currentBatch.bagWeightKg}kg bag`,
        unitPrice: askingPricePerBag,
        totalPrice: totalAmount,
        status: 'in_transit',
        trackingCode: trackingCode,
        originState: user.state || 'Kaduna State',
        destinationState: destinationState,
        createdAt: new Date().toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      addOrder(newOrder);

      // 2. Add to Marketplace listings (as fulfilled contract record)
      addListing({
        title: `${currentBatch.cropName} (${sellQuantityBags} Bags)`,
        cropType: currentBatch.cropType,
        category: currentBatch.category,
        price: askingPricePerBag,
        unit: '100kg bag',
        quantity: sellQuantityBags,
        availableQuantity: 0, // Immediately locked into contract
        minOrder: 5,
        locationState: user.state || 'Kaduna State',
        locationLga: user.lga || 'Zaria',
        sellerId: user.id,
        sellerName: user.name,
        sellerRole: user.role,
        sellerVerified: true,
        imageUrl: currentBatch.imageUrl,
        description: `Verified Grade-A produce. Moisture: ${currentBatch.moisturePercent}%. Storage: ${currentBatch.storageType}. Location: ${pickupLocation}`,
        moistureContent: `${currentBatch.moisturePercent}%`,
        grade: 'Grade A Export Quality',
      });

      // 3. Add Escrow Hold Transaction in Central Bank / BOA Escrow
      addTransaction({
        userId: user.id,
        type: 'escrow_hold',
        amount: totalAmount,
        description: `Guaranteed Escrow for Order #${orderId} - ${currentBatch.cropName}`,
        category: 'Produce Sale',
        status: 'pending',
      });

      // 4. Add Audit Log
      addAuditLog(
        user.name,
        'farmer',
        'BIND_OFFTAKE_CONTRACT',
        `Sold ${sellQuantityBags} bags of ${currentBatch.cropName} to ${selectedBuyer} for ₦${totalAmount.toLocaleString()} under CBN Escrow.`
      );

      // 5. Update farmer local stored batch inventory
      setBatches((prev) =>
        prev.map((b) =>
          b.id === currentBatch.id
            ? {
                ...b,
                availableBags: Math.max(0, b.availableBags - sellQuantityBags),
                totalTonnes: Math.max(0, parseFloat((((b.availableBags - sellQuantityBags) * b.bagWeightKg) / 1000).toFixed(1))),
              }
            : b
        )
      );

      // 6. Store created receipt
      setCreatedReceipt({
        receiptNumber,
        orderId,
        trackingCode,
        totalAmount,
        quantityBags: sellQuantityBags,
        cropTitle: currentBatch.cropName,
        buyerName: selectedBuyer,
        escrowHash,
        pickupLocation,
        issueDate,
      });

      setIsSubmitting(false);
      setSellStep(5); // Receipt confirmation step

      setToastMessage(
        `✓ Offtake Contract #${orderId} Executed! ₦${totalAmount.toLocaleString()} secured in Bank of Agriculture Escrow.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Value Chain Overview & Focused Sell Button */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#022c1b] bg-[#10b981] px-2.5 py-0.5 rounded-full font-mono">
              FARMER VALUE CHAIN HUB
            </span>
            <span className="text-[10px] font-bold text-[#86af99] bg-[#1b4332] px-2.5 py-0.5 rounded-full border border-[#86af99]/30">
              NIMC ID: {user.nin || '12345678901'}
            </span>
            <span className="text-[10px] font-bold text-[#c1ecd4] bg-[#1b4332] px-2.5 py-0.5 rounded-full border border-[#86af99]/30">
              {user.farmSizeHectares || 4.5} Hectares • {user.cropTypes ? user.cropTypes.join(', ') : 'Yellow Maize'}
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#86af99] mt-0.5">
            {user.state} Cluster • Zaria Agricultural Cooperative Society • Zero Middlemen Offtake
          </p>
        </div>

        {/* Primary Functional Sell Harvest Action (Targeted CSS selector 1) */}
        <button
          onClick={handleOpenSellModal}
          className="h-12 px-6 bg-[#10b981] hover:bg-[#059669] text-[#022c1b] font-heading font-black text-sm rounded-xl flex items-center gap-2 shadow-lg ring-2 ring-[#34d399]/50 transition-all active:scale-95 border border-[#34d399] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Sell Harvest (0% Fee)</span>
        </button>

        {/* Secondary Fast Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAudioSummary(!showAudioSummary)}
            className="h-11 px-3.5 bg-[#1b4332] hover:bg-[#274e3d] text-[#c1ecd4] font-bold text-xs rounded-xl border border-[#86af99]/40 flex items-center gap-1.5 transition-colors"
            title="Audio Farm Summary"
          >
            <span className="material-symbols-outlined text-[18px]">volume_up</span>
            <span className="hidden sm:inline">Voice Brief</span>
          </button>

          <button
            onClick={() => setActiveView('advisory')}
            className="h-11 px-3.5 bg-[#1b4332] hover:bg-[#274e3d] text-white font-bold text-xs rounded-xl border border-[#86af99]/40 flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">partly_cloudy_day</span>
            <span>{userWeather.tempCelsius}°C</span>
          </button>
        </div>
      </div>

      {/* Voice Farm Summary Bar (Multilingual Audio Dropdown) */}
      {showAudioSummary && (
        <div className="p-4 bg-[#051a11] text-white rounded-2xl border border-[#10b981]/50 space-y-2 animate-fadeIn shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#34d399]">
              <span className="material-symbols-outlined text-[20px] animate-pulse">podcasts</span>
              <span>Daily Value Chain Voice Briefing:</span>
            </div>

            <div className="flex gap-1">
              {(['Hausa', 'English', 'Yoruba', 'Igbo'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setAudioLang(lang)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    audioLang === lang ? 'bg-[#10b981] text-[#022c1b]' : 'bg-[#1b4332] text-[#86af99] hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#c1ecd4] leading-relaxed italic bg-[#012d1d] p-3 rounded-xl border border-[#1b4332]">
            {audioLang === 'Hausa' &&
              `"Barka da rana Malam ${user.name}. Amfanin gonarka na masara yana cikin rumbun ajiya a shirye don siyarwa. Kudadenka naira miliyan 3.7 na nan cikin amana (escrow). Danna koren maɓallin nan 'Sell Harvest' don siyarwa kai tsaye ga manyan masana'antu ba tare da 'yan tsakiya sun ci zalin ka ba."`}
            {audioLang === 'English' &&
              `"Good day ${user.name}. Your verified grain harvest is in the Zaria cooperative silo ready for offtake. You have ₦3,700,000 secured in Central Bank escrow. Click 'Sell Harvest' to sell directly to food processors at ₦37,000/bag with zero middleman deductions."`}
            {audioLang === 'Yoruba' &&
              `"Ẹ kú àbọ̀ ${user.name}. Àgbàdo rẹ ti wà ní àbà láti tà lónìí. Tẹ bọ́tìnnì 'Sell Harvest' láti ta tààrà fún àwọn ilé-iṣẹ́ oúnjẹ ní owó gidi."`}
            {audioLang === 'Igbo' &&
              `"Nnọọ ${user.name}. Ọka gị dị njikere maka ire ere. Pịa bọtịnụ 'Sell Harvest' iji ree ya ndị na-emepụta nri n'ọnụ ahịa kacha mma n'enweghị ndị etiti."`}
          </p>
        </div>
      )}

      {/* 5-Stage Value Chain Pipeline Tracker */}
      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#e2e2e2]">
          <div>
            <h3 className="font-heading font-black text-base text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#10b981]">schema</span>
              <span>Farm Value Chain Pipeline Tracker</span>
            </h3>
            <p className="text-xs text-[#717973]">
              End-to-end tracking from certified inputs to harvest storage, offtake contracts, and guaranteed payment.
            </p>
          </div>

          <span className="text-[11px] font-bold text-[#012d1d] bg-[#e7f5e8] px-3 py-1 rounded-full border border-[#10b981]/30">
            Season: 2025/2026 Grain Offtake
          </span>
        </div>

        {/* 5 Value Chain Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {valueChainStages.map((stage) => {
            const isSelected = activeStage === stage.step;
            return (
              <div
                key={stage.step}
                onClick={() => {
                  setActiveStage(stage.step);
                  if (stage.actionView === 'quick_sell') {
                    handleOpenSellModal();
                  } else {
                    setActiveView(stage.actionView);
                  }
                }}
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-md ring-2 ring-[#10b981]/50'
                    : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#1a1c1c] hover:border-[#10b981] hover:bg-[#f3f3f3]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#86af99]' : 'text-[#717973]'}`}>
                      Link {stage.step} of 5
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-[#10b981] text-[#022c1b]' : stage.badgeColor}`}>
                      {stage.badge}
                    </span>
                  </div>

                  <h4 className={`font-heading font-black text-xs leading-tight ${isSelected ? 'text-[#c1ecd4]' : 'text-[#012d1d]'}`}>
                    {stage.title}
                  </h4>
                  <p className={`text-[11px] mt-1 leading-snug ${isSelected ? 'text-[#e7f5e8]' : 'text-[#414844]'}`}>
                    {stage.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-bold">
                  <span className={isSelected ? 'text-[#34d399]' : 'text-[#012d1d]'}>{stage.actionLabel}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial & Harvest Operational Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Escrow & Wallet Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#c1c8c2] shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Guaranteed Revenue</span>
              <span className="p-1.5 rounded-lg bg-[#e7f5e8] text-[#012d1d]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </span>
            </div>
            <div className="font-heading font-black text-2xl text-[#012d1d] mt-1">
              ₦3,700,000
            </div>
            <p className="text-[11px] text-[#414844] mt-0.5">
              Locked in Central Bank Escrow for Waybill #{activeOrder?.trackingCode || 'TRK-NG-8892'}
            </p>
          </div>

          <div className="pt-2 border-t border-[#e2e2e2] flex justify-between items-center text-xs">
            <span className="text-[#717973]">Available Wallet: <strong>₦1,500,000</strong></span>
            <button
              onClick={handleWithdraw}
              className="text-[#012d1d] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>{withdrawSuccess ? 'Payout Sent ✓' : 'Withdraw →'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Uncommitted Harvest Ready to Sell */}
        <div className="bg-white p-5 rounded-2xl border border-[#c1c8c2] shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Stored Harvest For Sale</span>
              <span className="p-1.5 rounded-lg bg-[#e7f5e8] text-[#012d1d]">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </span>
            </div>
            <div className="font-heading font-black text-2xl text-[#012d1d] mt-1">
              {batches[0].availableBags} Bags <span className="text-xs font-normal text-[#717973]">({batches[0].totalTonnes} MT)</span>
            </div>
            <p className="text-[11px] text-[#414844] mt-0.5">
              Dry Yellow Maize • Moisture {batches[0].moisturePercent}% (PICS sealed)
            </p>
          </div>

          <div className="pt-2 border-t border-[#e2e2e2] flex justify-between items-center text-xs">
            <span className="text-[#10b981] font-mono font-bold">₦{batches[0].benchmarkPricePerBag.toLocaleString()} / bag</span>
            <button
              onClick={handleOpenSellModal}
              className="px-2.5 py-1 bg-[#012d1d] text-white font-bold rounded-lg hover:bg-[#1b4332] text-[11px]"
            >
              Sell Now
            </button>
          </div>
        </div>

        {/* Card 3: Zero Middleman Direct Value Retained */}
        <div className="bg-white p-5 rounded-2xl border border-[#c1c8c2] shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Direct Farmer Advantage</span>
              <span className="p-1.5 rounded-lg bg-[#c1ecd4] text-[#002114]">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
              </span>
            </div>
            <div className="font-heading font-black text-2xl text-[#10b981] mt-1">
              +₦850,000
            </div>
            <p className="text-[11px] text-[#414844] mt-0.5">
              Extra profit saved by selling direct to offtakers vs local predatory brokers
            </p>
          </div>

          <div className="pt-2 border-t border-[#e2e2e2] flex justify-between items-center text-xs text-[#717973]">
            <span>Middlemen: ₦285k/MT</span>
            <span className="text-[#012d1d] font-bold">AgroApp: ₦370k/MT</span>
          </div>
        </div>

        {/* Card 4: Subsidies & Input Allocation */}
        <div className="bg-white p-5 rounded-2xl border border-[#c1c8c2] shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#717973]">Federal Input Subsidy</span>
              <span className="p-1.5 rounded-lg bg-[#ffefe5] text-[#d84315]">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </span>
            </div>
            <div className="font-heading font-black text-2xl text-[#d84315] mt-1">
              6 Bags NPK
            </div>
            <p className="text-[11px] text-[#414844] mt-0.5">
              50% Government Subsidized Voucher (Wet Season 2025/2026)
            </p>
          </div>

          <div className="pt-2 border-t border-[#e2e2e2] flex justify-between items-center text-xs">
            <span className="text-[#717973]">Merchant: Kano Inputs Hub</span>
            <button
              onClick={() => setActiveView('marketplace')}
              className="text-[#d84315] font-bold hover:underline"
            >
              Claim Voucher →
            </button>
          </div>
        </div>
      </div>

      {/* Value Chain Core Operations: Active Offtake Order & Satellite Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Offtake Contract with Buyer */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-black text-base text-[#012d1d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#10b981]">local_shipping</span>
                <span>Active Produce Offtake Contract & Freight</span>
              </h3>
              <p className="text-[11px] text-[#717973]">
                Produce in transit protected by Central Bank / Bank of Agriculture digital escrow.
              </p>
            </div>

            <span className="text-[10px] bg-[#ffdeac] text-[#281900] font-bold px-2.5 py-0.5 rounded-full font-mono">
              IN TRANSIT (GPS WAYBILL)
            </span>
          </div>

          {activeOrder && (
            <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeOrder.imageUrl}
                    alt={activeOrder.cropTitle}
                    className="w-14 h-14 rounded-xl object-cover border border-[#c1c8c2]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#1a1c1c]">{activeOrder.cropTitle}</h4>
                    <p className="text-xs text-[#717973]">
                      Offtaker: <strong className="text-[#012d1d]">{activeOrder.buyerName}</strong> • {activeOrder.quantity} Bags (10 MT)
                    </p>
                    <p className="text-[11px] text-[#414844] font-mono mt-0.5">
                      Hauler: {activeOrder.transporterName || 'Ibrahim Logistics'} • Plate: KAD-882-X
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-heading font-black text-xl text-[#012d1d]">
                    ₦{activeOrder.totalPrice.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-bold text-[#10b981] bg-[#e7f5e8] px-2 py-0.5 rounded font-mono">
                    100% Escrow Funded
                  </span>
                </div>
              </div>

              {/* Transit Corridor Visual Bar */}
              <div className="space-y-1.5 pt-2 border-t border-[#e2e2e2]">
                <div className="flex justify-between text-[11px] font-mono text-[#717973]">
                  <span>Origin: {activeOrder.originState} (Grain Silo)</span>
                  <span className="font-bold text-[#10b981]">Passing: Ore Corridor (64 km/h)</span>
                  <span>Destination: {activeOrder.destinationState}</span>
                </div>

                <div className="w-full bg-[#e8e8e8] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#012d1d] h-full rounded-full transition-all duration-700" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <span className="text-[11px] text-[#717973] font-mono">
                  Waybill Code: <strong>{activeOrder.trackingCode}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('orders')}
                    className="px-3.5 py-1.5 bg-[#012d1d] text-[#c1ecd4] font-bold text-xs rounded-lg hover:bg-[#1b4332] flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#10b981] animate-pulse">satellite_alt</span>
                    <span>View Real-Time Satellite Map</span>
                  </button>

                  <button
                    onClick={() => setActiveView('orders')}
                    className="px-3 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] font-bold text-xs rounded-lg hover:bg-[#e8e8e8]"
                  >
                    Waybill Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Institutional Offtaker Procurement Opportunities */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-heading font-bold text-xs text-[#012d1d] uppercase tracking-wider">
                Direct Buyer Procurement Requests (Sell Immediately)
              </h4>
              <span className="text-[10px] text-[#717973]">Verified Offtakers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1a1c1c]">Grand Cereals / Animal Feed Ltd</div>
                  <div className="text-[11px] text-[#717973]">Needs: 50 MT Soybeans • Jos Hub</div>
                  <div className="font-mono font-bold text-[#012d1d] text-xs mt-0.5">₦420,000 / Tonne</div>
                </div>
                <button
                  onClick={handleOpenSellModal}
                  className="px-3 py-1.5 bg-[#e7f5e8] text-[#012d1d] font-bold rounded-lg hover:bg-[#c1ecd4] border border-[#10b981]/30 shrink-0"
                >
                  Fulfill Bid
                </button>
              </div>

              <div className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1a1c1c]">Premium Food Flour Mills</div>
                  <div className="text-[11px] text-[#717973]">Needs: 100 MT Yellow Maize • Kaduna</div>
                  <div className="font-mono font-bold text-[#012d1d] text-xs mt-0.5">₦375,000 / Tonne</div>
                </div>
                <button
                  onClick={handleOpenSellModal}
                  className="px-3 py-1.5 bg-[#e7f5e8] text-[#012d1d] font-bold rounded-lg hover:bg-[#c1ecd4] border border-[#10b981]/30 shrink-0"
                >
                  Fulfill Bid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Harvest Quality & Grain Spot Prices */}
        <div className="space-y-6">
          {/* Grain Quality & Storage Meter */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <h3 className="font-heading font-black text-sm text-[#012d1d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#10b981]">sanitizer</span>
                <span>Harvest Quality & Storage Safety</span>
              </h3>
              <span className="text-[10px] font-bold text-[#002114] bg-[#c1ecd4] px-2 py-0.5 rounded font-mono">
                GRADE A
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#717973]">Grain Moisture Content:</span>
                <span className="font-mono font-bold text-[#10b981]">12.6% (Target &lt;13.5%)</span>
              </div>
              <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full w-[45%]" />
              </div>
              <p className="text-[10px] text-[#414844]">
                Low moisture safeguards against aflatoxin mold. Safe for 12 months in PICS hermetic bags.
              </p>

              <div className="pt-2 border-t border-[#e2e2e2] space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#717973]">Storage Facility:</span>
                  <span className="font-bold text-[#1a1c1c]">Zaria Co-op Silo Bay 4</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#717973]">Certified Warehousing Receipt:</span>
                  <span className="font-mono font-bold text-[#012d1d]">WHR-KD-8891</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Market Commodity Prices */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <h3 className="font-heading font-black text-sm text-[#012d1d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#10b981]">trending_up</span>
                <span>Today's Grain Spot Benchmarks</span>
              </h3>
              <button
                onClick={() => setActiveView('marketplace')}
                className="text-[11px] font-bold text-[#012d1d] hover:underline"
              >
                Market →
              </button>
            </div>

            <div className="space-y-2">
              {marketPrices.slice(0, 3).map((mp) => (
                <div key={mp.id} className="p-2.5 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#1a1c1c]">{mp.crop}</span>
                    <span className="block text-[10px] text-[#717973]">{mp.unit} • {mp.topState}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-[#012d1d]">
                      ₦{mp.priceNaira.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-[#10b981] font-bold">
                      +{mp.changePercent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Realistic Multi-Step Harvest Selling & Escrow Execution Modal */}
      {showQuickSellModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative my-auto">
            <button
              onClick={() => setShowQuickSellModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#e8e8e8] text-[#717973] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#e2e2e2]">
              <div className="p-2.5 bg-[#e7f5e8] text-[#012d1d] rounded-2xl border border-[#10b981]/30">
                <span className="material-symbols-outlined text-[26px]">storefront</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] font-mono">
                  DIRECT FARM GATE / SILO OFFTAKE ENGINE
                </span>
                <h3 className="font-heading font-black text-lg text-[#012d1d]">
                  Sell Verified Produce to Industrial Offtakers
                </h3>
                <p className="text-xs text-[#717973]">
                  0% broker commission. 100% payment guaranteed via Central Bank / Bank of Agriculture Escrow.
                </p>
              </div>
            </div>

            {/* Wizard Stepper Bar (Steps 1 to 4) */}
            {sellStep < 5 && (
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                <div
                  onClick={() => setSellStep(1)}
                  className={`py-2 px-1 rounded-xl border cursor-pointer transition-all ${
                    sellStep === 1
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm'
                      : 'bg-[#f3f3f3] text-[#717973] border-transparent'
                  }`}
                >
                  1. Crop Batch
                </div>
                <div
                  onClick={() => setSellStep(2)}
                  className={`py-2 px-1 rounded-xl border cursor-pointer transition-all ${
                    sellStep === 2
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm'
                      : 'bg-[#f3f3f3] text-[#717973] border-transparent'
                  }`}
                >
                  2. Pricing & Value
                </div>
                <div
                  onClick={() => setSellStep(3)}
                  className={`py-2 px-1 rounded-xl border cursor-pointer transition-all ${
                    sellStep === 3
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm'
                      : 'bg-[#f3f3f3] text-[#717973] border-transparent'
                  }`}
                >
                  3. Quality Check
                </div>
                <div
                  onClick={() => setSellStep(4)}
                  className={`py-2 px-1 rounded-xl border cursor-pointer transition-all ${
                    sellStep === 4
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm'
                      : 'bg-[#f3f3f3] text-[#717973] border-transparent'
                  }`}
                >
                  4. Offtaker Match
                </div>
              </div>
            )}

            {/* Step 1: Select Verified Stored Batch & Quantity */}
            {sellStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1.5">
                    Select Produce from Your Stored Harvest Inventory:
                  </label>
                  <div className="space-y-2">
                    {batches.map((batch) => {
                      const isSel = batch.id === selectedBatchId;
                      return (
                        <div
                          key={batch.id}
                          onClick={() => {
                            setSelectedBatchId(batch.id);
                            setSellQuantityBags(Math.min(50, batch.availableBags));
                            setAskingPricePerBag(batch.benchmarkPricePerBag);
                          }}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSel
                              ? 'bg-[#e7f5e8] border-[#10b981] ring-1 ring-[#10b981]'
                              : 'bg-[#f9f9f9] border-[#e2e2e2] hover:bg-[#f3f3f3]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={batch.imageUrl}
                              alt={batch.cropName}
                              className="w-12 h-12 rounded-xl object-cover border border-[#c1c8c2]"
                            />
                            <div>
                              <div className="font-bold text-sm text-[#1a1c1c]">{batch.cropName}</div>
                              <div className="text-[#717973] text-[11px]">
                                {batch.warehouseLocation} • Moisture: {batch.moisturePercent}%
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-black text-sm text-[#012d1d]">
                              {batch.availableBags} Bags In Stock
                            </div>
                            <span className="text-[10px] text-[#10b981] font-bold">
                              Benchmark: ₦{batch.benchmarkPricePerBag.toLocaleString()}/bag
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#e2e2e2] space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#1a1c1c]">
                      Quantity to Sell ({currentBatch.cropType}):
                    </label>
                    <span className="font-mono font-bold text-[#012d1d]">
                      {sellQuantityBags} Bags ({(sellQuantityBags * 0.1).toFixed(1)} MT)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max={Math.max(5, currentBatch.availableBags)}
                      step="5"
                      value={sellQuantityBags}
                      onChange={(e) => setSellQuantityBags(parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-[#e2e8e4] rounded-lg appearance-none cursor-pointer accent-[#012d1d]"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="1"
                        max={currentBatch.availableBags}
                        value={sellQuantityBags}
                        onChange={(e) => setSellQuantityBags(Math.min(currentBatch.availableBags, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                        className="w-16 h-8 px-2 text-center rounded-lg border border-[#717973] font-mono font-bold text-xs bg-white text-[#012d1d]"
                      />
                      <span className="text-[11px] text-[#717973] font-bold">Bags</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[10, 25, 50, currentBatch.availableBags].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setSellQuantityBags(qty)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          sellQuantityBags === qty
                            ? 'bg-[#012d1d] text-white border-[#012d1d]'
                            : 'bg-white border-[#c1c8c2] text-[#414844] hover:bg-[#f3f3f3]'
                        }`}
                      >
                        {qty === currentBatch.availableBags ? 'All Stock' : `${qty} Bags`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSellStep(2)}
                    className="h-11 px-6 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Pricing & Market Intel</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Middleman Comparison */}
            {sellStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">
                      Your Target Price per 100kg Bag (₦ Naira)
                    </label>
                    <input
                      type="number"
                      value={askingPricePerBag}
                      onChange={(e) => setAskingPricePerBag(parseInt(e.target.value, 10) || 1000)}
                      className="w-full h-11 px-3 rounded-xl border border-[#717973] font-mono font-bold text-base text-[#012d1d]"
                    />
                    
                    {/* Quick Pricing Chips based on BOA Benchmarks */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setAskingPricePerBag(currentBatch.benchmarkPricePerBag)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e7f5e8] text-[#012d1d] hover:bg-[#c1ecd4] transition-colors"
                      >
                        BOA Spot: ₦{currentBatch.benchmarkPricePerBag.toLocaleString()}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAskingPricePerBag(Math.max(1000, currentBatch.benchmarkPricePerBag - 1000))}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2] transition-colors"
                      >
                        Fast Offtake: ₦{(currentBatch.benchmarkPricePerBag - 1000).toLocaleString()}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAskingPricePerBag(currentBatch.benchmarkPricePerBag + 1500)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f3f3f3] text-[#414844] hover:bg-[#e2e2e2] transition-colors"
                      >
                        Grade-A Premium: ₦{(currentBatch.benchmarkPricePerBag + 1500).toLocaleString()}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#1a1c1c] mb-1">
                      Total Guaranteed Gross Payout
                    </label>
                    <div className="h-11 px-4 bg-[#e7f5e8] rounded-xl border border-[#10b981] flex items-center justify-between font-mono font-black text-lg text-[#012d1d]">
                      <span>₦{(sellQuantityBags * askingPricePerBag).toLocaleString()}</span>
                      <span className="text-[10px] font-sans font-bold bg-[#10b981] text-[#022c1b] px-2 py-0.5 rounded">
                        100% CBN ESCROW
                      </span>
                    </div>
                    <span className="text-[10px] text-[#717973] mt-1 block">
                      Platform fee: ₦0 (Federal Agricultural Offtake Subsidy Waiver)
                    </span>
                  </div>
                </div>

                {/* Direct Farmer Margin Comparison Card */}
                <div className="p-4 bg-[#f9faf9] rounded-2xl border border-[#c1c8c2] space-y-3">
                  <h4 className="font-heading font-black text-xs text-[#012d1d] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
                    <span>Value Chain Farmer Profit Guarantee vs Local Middlemen</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 bg-white rounded-xl border border-[#ffdad6] space-y-1">
                      <span className="text-[10px] text-[#717973] uppercase font-bold">Local Predatory Broker</span>
                      <div className="font-mono text-sm font-bold text-[#ba1a1a]">
                        ₦{(currentBatch.middlemanPricePerBag * sellQuantityBags).toLocaleString()}
                      </div>
                      <span className="text-[9px] text-[#ba1a1a] block">₦{currentBatch.middlemanPricePerBag.toLocaleString()} / bag</span>
                    </div>

                    <div className="p-3 bg-[#e7f5e8] rounded-xl border border-[#10b981] space-y-1">
                      <span className="text-[10px] text-[#012d1d] uppercase font-bold">AgroApp Direct Offtake</span>
                      <div className="font-mono text-sm font-bold text-[#012d1d]">
                        ₦{(askingPricePerBag * sellQuantityBags).toLocaleString()}
                      </div>
                      <span className="text-[9px] text-[#10b981] font-bold block">
                        +₦{((askingPricePerBag - currentBatch.middlemanPricePerBag) * sellQuantityBags).toLocaleString()} EXTRA PROFIT
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setSellStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#717973] hover:text-[#1a1c1c] cursor-pointer"
                  >
                    ← Back to Batch
                  </button>

                  <button
                    type="button"
                    onClick={() => setSellStep(3)}
                    className="h-11 px-6 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Quality Check</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Quality Check, Moisture & Packaging */}
            {sellStep === 3 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#f9f9f9] rounded-2xl border border-[#e2e2e2] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#1a1c1c]">Grain Moisture Certification:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#10b981] text-sm">
                        {currentBatch.moisturePercent}% (Optimal &lt;13.5%)
                      </span>
                      <button
                        type="button"
                        disabled={moistureProbeScanning}
                        onClick={() => {
                          setMoistureProbeScanning(true);
                          setTimeout(() => {
                            setMoistureProbeScanning(false);
                            setToastMessage(`✓ Moisture Sensor Verified: ${currentBatch.moisturePercent}% (Optimal Grain Moisture Level)`);
                            setTimeout(() => setToastMessage(null), 3000);
                          }, 500);
                        }}
                        className="px-2.5 py-1 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className={`material-symbols-outlined text-[13px] ${moistureProbeScanning ? 'animate-spin' : ''}`}>
                          {moistureProbeScanning ? 'sync' : 'sensors'}
                        </span>
                        <span>{moistureProbeScanning ? 'Calibrating...' : 'Re-probe Sensor'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full bg-[#e8e8e8] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#10b981] h-full" style={{ width: '45%' }} />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#012d1d] bg-[#e7f5e8] p-2.5 rounded-xl border border-[#10b981]/30">
                    <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
                    <span>
                      Moisture certified safe against aflatoxin contamination by Zaria Agricultural Development Inspector.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-1">
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Storage Standard</span>
                    <div className="font-bold text-xs text-[#012d1d]">{currentBatch.storageType}</div>
                    <span className="text-[10px] text-[#717973]">Chemical-free insect barrier</span>
                  </div>

                  <div className="p-3 bg-[#f9f9f9] rounded-xl border border-[#e2e2e2] space-y-1">
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Grading Specification</span>
                    <div className="font-bold text-xs text-[#012d1d]">Grade-A Food Processing Spec</div>
                    <span className="text-[10px] text-[#717973]">Foreign matter &lt; 1.5%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="moisture-confirm"
                    checked={moistureVerified}
                    onChange={(e) => setMoistureVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#012d1d] accent-[#012d1d] cursor-pointer"
                  />
                  <label htmlFor="moisture-confirm" className="font-medium text-[#1a1c1c] text-xs cursor-pointer">
                    I certify that these {sellQuantityBags} bags meet National Commodity Exchange quality specifications.
                  </label>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setSellStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#717973] hover:text-[#1a1c1c] cursor-pointer"
                  >
                    ← Back to Pricing
                  </button>

                  <button
                    type="button"
                    disabled={!moistureVerified}
                    onClick={() => setSellStep(4)}
                    className="h-11 px-6 bg-[#012d1d] hover:bg-[#1b4332] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Offtaker Selection</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Select Corporate Offtaker & Logistics Pickup */}
            {sellStep === 4 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1.5">
                    Select Accredited Corporate Offtaker to Fulfill Contract:
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        name: 'Grand Cereals & Animal Feed Ltd',
                        specs: 'Instant Binding Match • Jos & Kaduna Processing Mills',
                        rating: '5.0 ★ (120+ Escrows Settled)',
                        badge: 'INSTANT BINDING',
                      },
                      {
                        name: 'Premium Agro Processors Ltd',
                        specs: 'Food Milling & Commodity Offtake • Lagos Hub',
                        rating: '4.9 ★ (85+ Escrows Settled)',
                        badge: 'PRE-FUNDED',
                      },
                      {
                        name: 'Olam Agri Nigeria',
                        specs: 'Integrated Agro-Allied Processing • Kano & Ikeja Mills',
                        rating: '4.9 ★ (210+ Escrows Settled)',
                        badge: 'INSTANT ESCROW',
                      },
                      {
                        name: 'Flour Mills of Nigeria Plc (Golden Penny)',
                        specs: 'National Grain Offtake & Silo Network • Apapa Hub',
                        rating: '5.0 ★ (350+ Escrows Settled)',
                        badge: 'PRE-FUNDED',
                      },
                      {
                        name: 'National Commodity Open Exchange (All Buyers)',
                        specs: 'Broadcast harvest listing across all 36 state off-takers',
                        rating: 'National Exchange Pool',
                        badge: 'OPEN MARKET',
                      },
                    ].map((buyer) => {
                      const isSel = selectedBuyer === buyer.name;
                      return (
                        <div
                          key={buyer.name}
                          onClick={() => setSelectedBuyer(buyer.name)}
                          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSel
                              ? 'bg-[#e7f5e8] border-[#10b981] ring-1 ring-[#10b981]'
                              : 'bg-[#f9f9f9] border-[#e2e2e2] hover:bg-[#f3f3f3]'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-[#012d1d]">{buyer.name}</div>
                            <div className="text-[10px] text-[#717973]">{buyer.specs}</div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-[#012d1d] text-[#c1ecd4] px-2 py-0.5 rounded">
                            {buyer.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Logistics & Pickup */}
                <div>
                  <label className="block font-bold text-[#1a1c1c] mb-1.5">
                    Logistics & Farm Pickup Arrangement:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupOption('coop_silo')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        pickupOption === 'coop_silo'
                          ? 'bg-[#012d1d] text-white border-[#012d1d]'
                          : 'bg-[#f9f9f9] border-[#c1c8c2] text-[#414844]'
                      }`}
                    >
                      <div className="font-bold text-xs">Zaria Co-op Silo Dispatch</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Direct silo discharge bay to rail/truck</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPickupOption('farm_gate')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        pickupOption === 'farm_gate'
                          ? 'bg-[#012d1d] text-white border-[#012d1d]'
                          : 'bg-[#f9f9f9] border-[#c1c8c2] text-[#414844]'
                      }`}
                    >
                      <div className="font-bold text-xs">Farm Gate Truck Pickup</div>
                      <div className="text-[10px] opacity-80 mt-0.5">30-Ton SinoTruck dispatches to farm road</div>
                    </button>
                  </div>
                </div>

                {/* Assigned Transporter Card */}
                <div className="p-3 bg-[#f9faf9] rounded-xl border border-[#c1c8c2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-[#e7f5e8] text-[#012d1d] rounded-lg">
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    </span>
                    <div>
                      <div className="font-bold text-[#012d1d]">Carrier: Ibrahim Haulage Logistics Ltd</div>
                      <div className="text-[10px] text-[#717973]">Truck: KKY-782-XA • Driver: Musa Garba (GPS Connected)</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#10b981]/20 text-[#012d1d] border border-[#10b981]/40 rounded text-[10px] font-mono font-bold">
                    VERIFIED FLEET
                  </span>
                </div>

                {/* Final Binding Confirmation Card */}
                <div className="p-3 bg-[#e7f5e8] rounded-xl border border-[#10b981]/50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#012d1d] block">
                      Guaranteed Bank of Agriculture Escrow:
                    </span>
                    <span className="text-[11px] text-[#414844]">
                      Total {sellQuantityBags} Bags • Offtaker: {selectedBuyer}
                    </span>
                  </div>
                  <span className="font-mono font-black text-base text-[#012d1d]">
                    ₦{(sellQuantityBags * askingPricePerBag).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setSellStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#717973] hover:text-[#1a1c1c] cursor-pointer"
                  >
                    ← Back to Quality
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleExecuteContract}
                    className="h-12 px-7 bg-[#10b981] hover:bg-[#059669] text-[#022c1b] font-heading font-black text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        <span>Securing Escrow & Waybill...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Confirm Sale & Lock Escrow</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Official Electronic Warehouse Receipt & Waybill Confirmation */}
            {sellStep === 5 && createdReceipt && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="p-5 bg-[#012d1d] text-white rounded-2xl border border-[#10b981] text-center space-y-2 relative overflow-hidden">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10b981] text-[#022c1b] rounded-full font-mono font-bold text-[10px]">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>CENTRAL BANK ESCROW CONTRACT EXECUTED</span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-white">
                    Official Federal Electronic Warehouse Receipt (e-WHR)
                  </h3>
                  <div className="font-mono text-xs text-[#34d399]">
                    Receipt #{createdReceipt.receiptNumber} • Contract #{createdReceipt.orderId}
                  </div>
                </div>

                {/* Receipt Details Breakdown */}
                <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-2xl space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <span className="text-[#717973]">Commodity:</span>
                    <span className="font-bold text-[#1a1c1c] text-sm">{createdReceipt.cropTitle}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <span className="text-[#717973]">Quantity Sold:</span>
                    <span className="font-mono font-bold text-[#012d1d]">
                      {createdReceipt.quantityBags} Bags ({(createdReceipt.quantityBags * 0.1).toFixed(1)} MT)
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <span className="text-[#717973]">Verified Corporate Offtaker:</span>
                    <span className="font-bold text-[#012d1d]">{createdReceipt.buyerName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <span className="text-[#717973]">Protected Escrow Payout:</span>
                    <span className="font-mono font-black text-base text-[#10b981]">
                      ₦{createdReceipt.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
                    <span className="text-[#717973]">Satellite GPS Waybill Code:</span>
                    <span className="font-mono font-bold text-[#012d1d] bg-[#e7f5e8] px-2 py-0.5 rounded">
                      {createdReceipt.trackingCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#717973]">CBN Digital Hash:</span>
                    <span className="font-mono text-[#717973]">{createdReceipt.escrowHash}</span>
                  </div>
                </div>

                {/* Post-Contract 4-Action Quick Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickSellModal(false);
                      setActiveView('orders');
                    }}
                    className="h-11 px-4 bg-[#012d1d] hover:bg-[#1b4332] text-[#c1ecd4] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 border border-[#10b981]/50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#10b981] animate-pulse">satellite_alt</span>
                    <span>Track Satellite Dispatch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPrintReceipt(true)}
                    className="h-11 px-4 bg-[#10b981] hover:bg-[#059669] text-[#022c1b] font-heading font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    <span>View Official e-WHR (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickSellModal(false);
                      setActiveView('wallet');
                    }}
                    className="h-11 px-4 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#012d1d] font-bold text-xs rounded-xl border border-[#c1c8c2] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                    <span>View Escrow in Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQuickSellModal(false)}
                    className="h-11 px-4 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#1a1c1c] font-bold text-xs rounded-xl border border-[#c1c8c2] transition-colors cursor-pointer"
                  >
                    Done & Return to Hub
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Federal Electronic Warehouse Receipt (e-WHR) Modal */}
      {showPrintReceipt && createdReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto border-4 border-[#012d1d]">
            <button
              onClick={() => setShowPrintReceipt(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#e8e8e8] text-[#717973] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Official Federal Seal Header */}
            <div className="text-center pb-4 border-b-2 border-[#012d1d] space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e7f5e8] text-[#012d1d] rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
                <span>FEDERAL REPUBLIC OF NIGERIA</span>
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#012d1d] tracking-tight uppercase">
                Federal Ministry of Agriculture & Food Security
              </h2>
              <div className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                National Electronic Warehouse Receipt Registry (e-WHR System)
              </div>
              <p className="text-[11px] text-[#717973]">
                Under the Agricultural Commodity Title Act & Central Bank of Nigeria Escrow Framework
              </p>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#f9faf9] rounded-2xl border border-[#c1c8c2] text-xs">
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-bold block">e-WHR Certificate #</span>
                <span className="font-mono font-black text-[#012d1d]">{createdReceipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-bold block">Date Issued</span>
                <span className="font-bold text-[#1a1c1c]">{createdReceipt.issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-bold block">Escrow Security Hash</span>
                <span className="font-mono font-bold text-[#10b981] text-[10px] truncate block" title={createdReceipt.escrowHash}>
                  {createdReceipt.escrowHash.slice(0, 18)}...
                </span>
              </div>
            </div>

            {/* Structured Specifications Table */}
            <div className="border border-[#c1c8c2] rounded-2xl overflow-hidden text-xs">
              <div className="bg-[#012d1d] text-white px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider flex justify-between items-center">
                <span>Commodity & Title Specifications</span>
                <span className="text-[#34d399] font-mono text-[10px]">GRADE-A EXPORT CERTIFIED</span>
              </div>
              <div className="divide-y divide-[#e2e2e2] bg-white">
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Commodity:</span>
                  <span className="col-span-2 font-bold text-[#012d1d]">{createdReceipt.cropTitle}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Depositor (Farmer):</span>
                  <span className="col-span-2 text-[#1a1c1c] font-medium">
                    {user.name} • NIMC NIN: {user.nin || '12345678901'} (Zaria Co-op)
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Volume / Weight:</span>
                  <span className="col-span-2 font-mono font-bold text-[#012d1d]">
                    {createdReceipt.quantityBags} Bags ({(createdReceipt.quantityBags * 0.1).toFixed(1)} Metric Tonnes)
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Warehouse Facility:</span>
                  <span className="col-span-2 text-[#1a1c1c]">{createdReceipt.pickupLocation}</span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Designated Offtaker:</span>
                  <span className="col-span-2 font-bold text-[#012d1d]">{createdReceipt.buyerName}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-[#e7f5e8]/50">
                  <span className="font-bold text-[#012d1d]">Secured Escrow Value:</span>
                  <span className="col-span-2 font-mono font-black text-base text-[#012d1d]">
                    ₦{createdReceipt.totalAmount.toLocaleString()} (Bank of Agriculture Guarantee)
                  </span>
                </div>
                <div className="grid grid-cols-3 p-3">
                  <span className="font-bold text-[#717973]">Freight Waybill Code:</span>
                  <span className="col-span-2 font-mono font-bold text-[#10b981]">{createdReceipt.trackingCode}</span>
                </div>
              </div>
            </div>

            {/* Official Stamps and Verification Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border-2 border-[#012d1d] rounded-xl flex flex-col items-center justify-center p-1 text-center bg-[#f9faf9]">
                  <span className="material-symbols-outlined text-[24px] text-[#012d1d]">qr_code_2</span>
                  <span className="text-[7px] font-mono font-bold">VERIFY SCAN</span>
                </div>
                <div className="text-[10px] text-[#717973]">
                  <div className="font-bold text-[#012d1d]">Digital Escrow Seal #BOA-NG-77</div>
                  <div>Central Bank Clearing Subsystem</div>
                  <div className="text-[#10b981] font-mono">Status: IRREVOCABLE TITLE LOCK</div>
                </div>
              </div>

              <div className="text-right text-[10px] text-[#717973]">
                <div className="font-bold text-[#012d1d]">Alh. Bello Danjuma</div>
                <div>Federal Commodity Registrar</div>
                <div>National Agricultural Exchange</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e2e2]">
              <button
                type="button"
                onClick={() => setShowPrintReceipt(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#717973] hover:text-[#1a1c1c] cursor-pointer"
              >
                Close Document
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="h-11 px-6 bg-[#012d1d] hover:bg-[#1b4332] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Official e-WHR Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Real-Time Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#012d1d] text-[#c1ecd4] rounded-2xl border border-[#10b981] shadow-2xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <span className="material-symbols-outlined text-[20px] text-[#10b981]">verified</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#86af99] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
