import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FarmerDeliveryPass, WarehouseIntake } from '../../types';

export const ProduceSalesView: React.FC = () => {
  const { user } = useAuth();
  const {
    farmerDeliveryPasses,
    createDeliveryPass,
    warehouseIntakes,
    listings,
    addListing,
    marketPrices,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'delivery_passes' | 'warehouse_receipts' | 'market_listings'>('delivery_passes');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<WarehouseIntake | null>(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  // New Pass Form State
  const [crop, setCrop] = useState('White Maize');
  const [estimatedBags, setEstimatedBags] = useState('100');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-18');
  const [warehouseLocation, setWarehouseLocation] = useState('Abeokuta Agro Hub Silo Depot');
  const [transporterName, setTransporterName] = useState('Self (Farm Tractor / Trailer)');
  const [vehiclePlate, setVehiclePlate] = useState('OG-441-XA');

  // New Marketplace Listing Form State
  const [listTitle, setListTitle] = useState('Dry White Maize (Grade A Cleaned)');
  const [listCrop, setListCrop] = useState('White Maize');
  const [listQuantity, setListQuantity] = useState('50');
  const [listPrice, setListPrice] = useState('36000');
  const [listDescription, setListDescription] = useState('Cleaned and sun-dried white maize, moisture under 12.5%, bagged in new 50kg polypropylene bags.');

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const bags = parseInt(estimatedBags, 10) || 50;
    const estMT = parseFloat((bags * 0.05).toFixed(2));

    createDeliveryPass({
      farmerId: user.id || 'usr_farmer_01',
      farmerName: user.name || 'Babatunde Adeleke',
      cooperativeName: 'Dawanau Grains Farmers Cooperative Society',
      warehouseLocation,
      crop,
      estimatedBags: bags,
      estimatedWeightMT: estMT,
      deliveryDate,
      transporterName,
      vehiclePlateNumber: vehiclePlate,
    });

    setIsPassModalOpen(false);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(listQuantity, 10) || 20;
    const price = parseInt(listPrice, 10) || 35000;

    addListing({
      title: listTitle,
      crop: listCrop,
      category: 'Grains & Cereals',
      price,
      unit: '50kg Bag',
      availableQuantity: qty,
      minOrderQuantity: 5,
      locationState: user.state || 'Ogun',
      sellerId: user.id || 'usr_farmer_01',
      sellerName: user.name || 'Babatunde Adeleke',
      sellerRole: 'farmer',
      description: listDescription,
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      grade: 'Grade A',
      status: 'active',
      isCertified: true,
    });

    setIsListingModalOpen(false);
  };

  const myListings = listings.filter((l) => l.sellerId === user.id);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-[#c1c8c2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#3f6653] uppercase tracking-wider mb-1">
            <span>Produce Sales & Aggregation Intake</span>
            <span>·</span>
            <span>Direct Co-op Weighbridge</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-[#012d1d]">
            Produce Sales & Warehouse Delivery Passes
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            Generate gate delivery passes for cooperative silos, track electronic warehouse receipts (eWR), or list directly on the Agro Marketplace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold font-heading flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Generate Delivery Pass</span>
          </button>

          <button
            onClick={() => setIsListingModalOpen(true)}
            className="h-10 px-4 rounded-xl border border-[#c1c8c2] bg-[#f9f9f9] text-[#012d1d] hover:bg-[#e8e8e8] text-xs font-bold font-heading flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>List on Marketplace</span>
          </button>
        </div>
      </div>

      {/* Benchmark Grain Price Ticker */}
      <div className="bg-[#f0f7f3] border border-[#a5d0b9] rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-[#012d1d]">trending_up</span>
          <div>
            <div className="font-heading font-bold text-xs text-[#012d1d]">Today's Cooperative Floor Prices</div>
            <div className="text-[11px] text-[#414844]">Guaranteed minimum price at certified aggregation silos</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {marketPrices.slice(0, 3).map((mp) => (
            <div key={mp.id} className="bg-white px-3 py-1.5 rounded-lg border border-[#c1c8c2] text-xs">
              <span className="text-[#717973] font-medium">{mp.crop}:</span>{' '}
              <strong className="text-[#012d1d] tabular-nums">₦{mp.priceNaira.toLocaleString()}</strong>
              <span className="text-[10px] text-[#717973]">/{mp.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#c1c8c2] pb-1">
        <button
          onClick={() => setActiveTab('delivery_passes')}
          className={`pb-2.5 px-3 text-xs font-bold font-heading flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'delivery_passes'
              ? 'border-[#012d1d] text-[#012d1d]'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span>Weighbridge Delivery Passes ({farmerDeliveryPasses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warehouse_receipts')}
          className={`pb-2.5 px-3 text-xs font-bold font-heading flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'warehouse_receipts'
              ? 'border-[#012d1d] text-[#012d1d]'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Digital Warehouse Receipts (eWR) ({warehouseIntakes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('market_listings')}
          className={`pb-2.5 px-3 text-xs font-bold font-heading flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'market_listings'
              ? 'border-[#012d1d] text-[#012d1d]'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">store</span>
          <span>Marketplace Listings ({myListings.length})</span>
        </button>
      </div>

      {/* TAB 1: Delivery Passes */}
      {activeTab === 'delivery_passes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmerDeliveryPasses.map((pass) => (
              <div
                key={pass.id}
                className="bg-white border border-[#c1c8c2] rounded-2xl p-5 space-y-4 shadow-xs hover:border-[#012d1d] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-lg text-[#012d1d] tabular-nums">
                        {pass.passCode}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        pass.status === 'scheduled'
                          ? 'bg-[#ffdeac] text-[#523700]'
                          : pass.status === 'arrived_at_gate'
                          ? 'bg-[#c1ecd4] text-[#002114]'
                          : 'bg-[#e2e2e2] text-[#414844]'
                      }`}>
                        {pass.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-[#717973] mt-0.5">
                      Destination: {pass.warehouseLocation}
                    </div>
                  </div>

                  <div className="p-2 bg-[#f3f3f3] rounded-xl border border-[#e2e2e2] text-center">
                    <span className="material-symbols-outlined text-[28px] text-[#012d1d]">qr_code_2</span>
                    <div className="text-[9px] font-bold text-[#717973]">Scan at Gate</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#e2e2e2] text-xs">
                  <div>
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Crop</span>
                    <div className="font-heading font-bold text-[#1a1c1c]">{pass.crop}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Quantity</span>
                    <div className="font-heading font-bold text-[#012d1d] tabular-nums">
                      {pass.estimatedBags} Bags ({pass.estimatedWeightMT} MT)
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#717973] uppercase font-bold">Slot Date</span>
                    <div className="font-semibold text-[#1a1c1c]">{pass.deliveryDate}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-[#414844]">
                  <div>
                    <span className="text-[#717973]">Haulage:</span> {pass.transporterName} · Plate: {pass.vehiclePlateNumber}
                  </div>
                </div>

                <div className="bg-[#f9f9f9] p-3 rounded-xl border border-[#e2e2e2] flex justify-between items-center text-xs">
                  <div className="text-[#414844]">
                    Present this 6-digit code or QR to the intake officer at the weighbridge.
                  </div>
                  <button
                    onClick={() => {
                      alert(`Pass #${pass.passCode} verification slip ready for driver.`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#012d1d] text-white text-xs font-bold font-heading hover:bg-[#1b4332] shrink-0 ml-2"
                  >
                    Print Slip
                  </button>
                </div>
              </div>
            ))}
          </div>

          {farmerDeliveryPasses.length === 0 && (
            <div className="bg-white p-8 rounded-2xl border border-[#c1c8c2] text-center space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#717973]">local_shipping</span>
              <h3 className="font-heading font-bold text-base text-[#1a1c1c]">No Active Delivery Passes</h3>
              <p className="text-xs text-[#717973]">
                Generate an intake slot pass to deliver your harvested grains to your cooperative aggregation warehouse.
              </p>
              <button
                onClick={() => setIsPassModalOpen(true)}
                className="mt-2 h-9 px-4 rounded-xl bg-[#012d1d] text-white text-xs font-bold"
              >
                Create Delivery Pass
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Digital Warehouse Receipts (eWR) */}
      {activeTab === 'warehouse_receipts' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#c1c8c2] overflow-hidden">
            <div className="p-4 border-b border-[#e2e2e2] flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-sm text-[#012d1d]">
                  Electronic Warehouse Receipts (eWR) Ledger
                </h3>
                <p className="text-xs text-[#717973]">
                  Legally recognized digital receipts issued upon quality testing and weight verification at the silo.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#1b4332]">
                Total {warehouseIntakes.length} Verified Intakes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f9f9f9] text-[#717973] uppercase font-bold text-[10px] border-b border-[#e2e2e2]">
                  <tr>
                    <th className="px-4 py-3">Receipt #</th>
                    <th className="px-4 py-3">Crop & Volume</th>
                    <th className="px-4 py-3">Moisture & Grade</th>
                    <th className="px-4 py-3">Gross Valuation</th>
                    <th className="px-4 py-3">Crop Lien Deduction</th>
                    <th className="px-4 py-3">Net Payout</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e2e2]">
                  {warehouseIntakes.map((intake) => (
                    <tr key={intake.id} className="hover:bg-[#f9f9f9] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-heading font-bold text-[#012d1d]">{intake.receiptNumber}</div>
                        <div className="text-[10px] text-[#717973]">{new Date(intake.timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#1a1c1c]">{intake.crop}</div>
                        <div className="text-[10px] text-[#717973] tabular-nums">
                          {intake.netWeightMT} MT ({intake.bagCount} bags)
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-[#012d1d]">{intake.qualityGrade}</span>
                          <span className="text-[10px] text-[#717973]">({intake.moistureContent}%)</span>
                        </div>
                        <div className="text-[10px] text-[#414844]">{intake.storageBin}</div>
                      </td>
                      <td className="px-4 py-3 font-heading font-bold text-[#1a1c1c] tabular-nums">
                        ₦{intake.totalValuationNaira.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-heading font-bold text-[#ba1a1a] tabular-nums">
                        {intake.harvestDeductionNaira > 0 ? `-₦${intake.harvestDeductionNaira.toLocaleString()}` : '₦0'}
                      </td>
                      <td className="px-4 py-3 font-heading font-bold text-[#012d1d] tabular-nums">
                        ₦{intake.netPayableToFarmerNaira.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceipt(intake);
                            setIsReceiptModalOpen(true);
                          }}
                          className="h-8 px-3 rounded-lg border border-[#c1c8c2] bg-white hover:bg-[#f3f3f3] text-xs font-bold text-[#012d1d] transition-colors"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Marketplace Listings */}
      {activeTab === 'market_listings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-[#012d1d]">
              Direct Marketplace Offers ({myListings.length})
            </h3>
            <button
              onClick={() => setIsListingModalOpen(true)}
              className="h-8 px-3 rounded-lg bg-[#012d1d] text-white hover:bg-[#1b4332] text-xs font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Create New Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-[#c1c8c2] rounded-2xl overflow-hidden hover:border-[#012d1d] transition-all flex flex-col justify-between"
              >
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase text-[#3f6653] bg-[#c1ecd4] px-2 py-0.5 rounded">
                      {listing.grade || 'Standard'}
                    </span>
                    <span className="text-xs text-[#717973]">{listing.locationState}</span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[#012d1d] leading-snug">
                    {listing.title}
                  </h4>

                  <p className="text-xs text-[#414844] line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="pt-2 border-t border-[#e2e2e2] flex justify-between items-baseline">
                    <span className="text-xs text-[#717973]">Price per {listing.unit}</span>
                    <div className="font-heading font-bold text-base text-[#012d1d] tabular-nums">
                      ₦{listing.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-xs text-[#414844]">
                    Available Stock: <strong className="text-[#1a1c1c] tabular-nums">{listing.availableQuantity} {listing.unit}s</strong>
                  </div>
                </div>

                <div className="bg-[#f9f9f9] p-3 border-t border-[#e2e2e2] flex justify-between items-center text-xs">
                  <span className="text-[#3f6653] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Live in Agro Market</span>
                  </span>
                  <button
                    onClick={() => setActiveView('marketplace')}
                    className="text-[#012d1d] font-bold hover:underline"
                  >
                    View in Market →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Generate Delivery Pass */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                  Generate Warehouse Delivery Pass
                </h3>
                <p className="text-xs text-[#717973] mt-0.5">
                  Book an intake weighbridge slot at your cooperative silo depot.
                </p>
              </div>
              <button onClick={() => setIsPassModalOpen(false)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Target Silo Depot *</label>
                <select
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                >
                  <option value="Abeokuta Agro Hub Silo Depot">Abeokuta Agro Hub Silo Depot (Main Union)</option>
                  <option value="Ibadan Central Grain Aggregation Depot">Ibadan Central Grain Aggregation Depot</option>
                  <option value="Kaduna Dawanau Outpost Silo Alpha">Kaduna Dawanau Outpost Silo Alpha</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Crop Type *</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  >
                    <option value="White Maize">White Maize</option>
                    <option value="Yellow Maize">Yellow Maize</option>
                    <option value="Soya Beans">Soya Beans</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Paddy Rice">Paddy Rice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Estimated Bags (50kg) *</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    required
                    value={estimatedBags}
                    onChange={(e) => setEstimatedBags(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Target Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Vehicle Plate Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KRD-442-XA"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Haulier / Driver Name *</label>
                <input
                  type="text"
                  required
                  value={transporterName}
                  onChange={(e) => setTransporterName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="bg-[#f0f7f3] p-3 rounded-xl border border-[#a5d0b9] text-xs text-[#012d1d]">
                <strong className="block font-heading">Weighbridge Assurance:</strong>
                Grains with moisture $\le 13.0\%$ automatically qualify for Grade A premium pricing. Moisture testing happens in your presence.
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Digital Warehouse Receipt */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <span className="text-[10px] font-bold text-[#3f6653] uppercase tracking-wider">
                  Verifiable Digital Warehouse Receipt
                </span>
                <h3 className="font-heading font-bold text-xl text-[#012d1d] mt-0.5">
                  {selectedReceipt.receiptNumber}
                </h3>
              </div>
              <button onClick={() => setIsReceiptModalOpen(false)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-[#f9f9f9] p-4 rounded-xl border border-[#e2e2e2] space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Farmer Depositor:</span>
                <strong className="text-[#1a1c1c]">{selectedReceipt.farmerName}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Cooperative Cluster:</span>
                <span className="text-[#1a1c1c]">{selectedReceipt.clusterName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Commodity:</span>
                <strong className="text-[#012d1d]">{selectedReceipt.crop}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Net Weight / Bags:</span>
                <strong className="text-[#1a1c1c] tabular-nums">{selectedReceipt.netWeightMT} MT ({selectedReceipt.bagCount} Bags)</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Quality Assessment:</span>
                <span className="font-bold text-[#012d1d]">{selectedReceipt.qualityGrade} (Moisture: {selectedReceipt.moistureContent}%)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#717973]">Storage Silo Bin:</span>
                <span className="text-[#1a1c1c]">{selectedReceipt.storageBin} ({selectedReceipt.warehouseLocation})</span>
              </div>
            </div>

            <div className="border-t border-[#e2e2e2] pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#717973]">Gross Commodity Valuation:</span>
                <span className="font-heading font-bold text-[#1a1c1c] tabular-nums">
                  ₦{selectedReceipt.totalValuationNaira.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#ba1a1a]">
                <span>Crop Lien (Input Deductions):</span>
                <span className="font-heading font-bold tabular-nums">
                  -₦{selectedReceipt.harvestDeductionNaira.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#e2e2e2]">
                <strong className="text-[#012d1d]">Net Settlement to Farmer:</strong>
                <strong className="font-heading font-bold text-base text-[#012d1d] tabular-nums">
                  ₦{selectedReceipt.netPayableToFarmerNaira.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Receipt #${selectedReceipt.receiptNumber} verified by Nigeria Commodity Exchange (NCX) standard.`);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
              >
                Download PDF Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Marketplace Listing */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#c1c8c2] shadow-xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#012d1d]">
                  List Produce on Agro Marketplace
                </h3>
                <p className="text-xs text-[#717973] mt-0.5">
                  Sell directly to corporate processors, wholesale aggregators, and buyers nationwide.
                </p>
              </div>
              <button onClick={() => setIsListingModalOpen(false)} className="text-[#717973] hover:text-[#012d1d]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Listing Headline *</label>
                <input
                  type="text"
                  required
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Crop Type *</label>
                  <select
                    value={listCrop}
                    onChange={(e) => setListCrop(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  >
                    <option value="White Maize">White Maize</option>
                    <option value="Yellow Maize">Yellow Maize</option>
                    <option value="Soya Beans">Soya Beans</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Paddy Rice">Paddy Rice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#414844] mb-1">Available Bags (50kg) *</label>
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    required
                    value={listQuantity}
                    onChange={(e) => setListQuantity(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Asking Price per Bag (₦) *</label>
                <input
                  type="number"
                  min="5000"
                  step="500"
                  required
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414844] mb-1">Quality & Description *</label>
                <textarea
                  rows={2}
                  required
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#f9f9f9] border border-[#c1c8c2] rounded-lg focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e2e2]">
                <button
                  type="button"
                  onClick={() => setIsListingModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#414844] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#012d1d] hover:bg-[#1b4332] rounded-lg transition-colors"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
