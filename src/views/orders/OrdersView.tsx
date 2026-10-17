import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { SatelliteOrderTracker } from '../../components/orders/SatelliteOrderTracker';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [fullscreenSatelliteOrder, setFullscreenSatelliteOrder] = useState<Order | null>(null);

  const myOrders = orders.filter((o) =>
    o.buyerId === user.id || o.sellerName === user.name || user.role === 'transporter' || user.role === 'super_admin'
  );

  // Default expanded to the first order to immediately present the satellite tracking imagery
  const [expandedSatelliteOrderId, setExpandedSatelliteOrderId] = useState<string | null>(
    myOrders[0]?.id || null
  );

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'accepted':
        return 2;
      case 'in_transit':
        return 3;
      case 'delivered':
        return 4;
      case 'completed':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#86af99]">
              National Escrow & Waybill Tracking
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
              <span>SATELLITE RADAR CONNECTED</span>
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl">Contract Orders & Freight Tracking</h1>
          <p className="text-xs text-[#86af99]">
            Monitor produce dispatch, transit milestones, GPS waybills, and secure escrow settlement.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading font-bold text-sm text-[#012d1d]">
            Active Trade Contracts ({myOrders.length})
          </h3>
          <span className="text-xs text-[#717973] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#10b981]">satellite_alt</span>
            <span>Live telemetry synced with Federal Agricultural Transport Corridor</span>
          </span>
        </div>

        <div className="space-y-3">
          {myOrders.map((ord) => {
            const step = getStatusStep(ord.status);
            const isSatelliteOpen = expandedSatelliteOrderId === ord.id;
            return (
              <div
                key={ord.id}
                className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-3 hover:border-[#012d1d] transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e2e2e2]">
                  <div className="flex items-center gap-3">
                    <img src={ord.imageUrl} alt={ord.cropTitle} className="w-12 h-12 rounded-lg object-cover border border-[#c1c8c2]" />
                    <div>
                      <div className="font-bold text-sm text-[#1a1c1c] flex items-center gap-2">
                        <span>{ord.cropTitle}</span>
                        {ord.status === 'in_transit' && (
                          <span className="px-2 py-0.5 rounded-full bg-[#012d1d] text-[#c1ecd4] font-bold text-[9px] border border-[#10b981]/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
                            <span>GPS ACTIVE</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#717973]">
                        Seller: {ord.sellerName} • Quantity: {ord.quantity} Tons • Transporter: {ord.transporterName || 'Fleet Dispatch'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-auto flex flex-col items-end">
                    <div className="font-heading font-bold text-base text-[#012d1d]">
                      ₦{ord.totalPrice.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#c1ecd4] text-[#002114]">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#717973] uppercase">
                    <span className={step >= 1 ? 'text-[#012d1d]' : ''}>Order Locked</span>
                    <span className={step >= 2 ? 'text-[#012d1d]' : ''}>Dispatched</span>
                    <span className={step >= 3 ? 'text-[#012d1d] font-black' : ''}>In Transit (GPS)</span>
                    <span className={step >= 4 ? 'text-[#012d1d]' : ''}>Delivered</span>
                    <span className={step >= 5 ? 'text-[#012d1d]' : ''}>Escrow Paid</span>
                  </div>

                  <div className="w-full bg-[#e8e8e8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#012d1d] h-full transition-all duration-500"
                      style={{ width: `${(step / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Tracking & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-[11px] text-[#414844]">
                    Route: <span className="font-bold text-[#1a1c1c]">{ord.originState}</span> →{' '}
                    <span className="font-bold text-[#1a1c1c]">{ord.destinationState}</span> • Tracking Code:{' '}
                    <span className="font-mono font-bold text-[#012d1d]">{ord.trackingCode}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Satellite Map Toggle */}
                    <button
                      onClick={() => setExpandedSatelliteOrderId(isSatelliteOpen ? null : ord.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                        isSatelliteOpen
                          ? 'bg-[#012d1d] text-[#c1ecd4] border border-[#10b981]'
                          : 'bg-[#e7f5e8] text-[#0a3826] hover:bg-[#c1ecd4] border border-[#0a3826]/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#10b981] animate-pulse">
                        satellite_alt
                      </span>
                      <span>{isSatelliteOpen ? 'Collapse Satellite Feed' : '🛰️ Live Satellite Map'}</span>
                    </button>

                    <button
                      onClick={() => setFullscreenSatelliteOrder(ord)}
                      className="p-1.5 bg-[#f3f3f3] hover:bg-[#e8e8e8] text-[#012d1d] rounded-lg border border-[#c1c8c2] transition-colors"
                      title="Open Fullscreen Satellite Radar Command Center"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_full</span>
                    </button>

                    {ord.status === 'in_transit' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'delivered')}
                        className="px-3 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-lg hover:bg-[#1b4332]"
                      >
                        Confirm Arrival
                      </button>
                    )}

                    {ord.status === 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'completed')}
                        className="px-3 py-1.5 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#274e3d] flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span>Sign Waybill & Release Escrow</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] text-xs font-bold rounded-lg hover:bg-[#e8e8e8]"
                    >
                      Digital Waybill
                    </button>
                  </div>
                </div>

                {/* Inline Simulated Satellite Map Tracking for Order */}
                {isSatelliteOpen && (
                  <div className="pt-3 border-t border-[#e2e2e2] animate-fadeIn">
                    <SatelliteOrderTracker
                      order={ord}
                      isInline={true}
                      onClose={() => setExpandedSatelliteOrderId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Digital Waybill Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#e8e8e8] text-[#717973]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center pb-3 border-b border-[#e2e2e2]">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c1ecd4] text-[#002114] px-2.5 py-0.5 rounded-full">
                Federal Ministry Official Digital Waybill
              </span>
              <h3 className="font-heading font-bold text-lg text-[#012d1d] mt-1">
                Waybill #{selectedOrder.trackingCode}
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#f3f3f3] rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-[#1a1c1c]">
                  <span>Produce</span>
                  <span>{selectedOrder.cropTitle}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>Quantity</span>
                  <span>{selectedOrder.quantity} MT</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>Escrow Value</span>
                  <span className="font-bold text-[#012d1d]">₦{selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-[#f3f3f3] rounded-xl space-y-1">
                <div className="flex justify-between text-[#717973]">
                  <span>Shipper / Seller</span>
                  <span className="font-bold text-[#1a1c1c]">{selectedOrder.sellerName}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>Origin Warehouse</span>
                  <span>{selectedOrder.originState}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>Destination Processing Hub</span>
                  <span>{selectedOrder.destinationState}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>Assigned Driver</span>
                  <span className="font-bold text-[#012d1d]">{selectedOrder.transporterName}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1b4332] text-white p-3 rounded-xl text-center space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#86af99]">Digital Verification Hash</div>
              <div className="font-mono text-[10px] text-[#c1ecd4] break-all">
                AGRO-NG-WAYBILL-2026-X88921-VERIFIED-OK
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  const ord = selectedOrder;
                  setSelectedOrder(null);
                  setFullscreenSatelliteOrder(ord);
                }}
                className="w-full py-2.5 bg-[#012d1d] text-[#c1ecd4] font-bold text-xs rounded-full hover:bg-[#1b4332] flex items-center justify-center gap-1.5 border border-[#10b981]/50 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] text-[#10b981] animate-pulse">satellite_alt</span>
                <span>Launch Live Satellite Radar Tracking</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-[#f3f3f3] text-[#414844] font-bold text-xs rounded-full hover:bg-[#e8e8e8]"
              >
                Close Waybill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Satellite Command Radar Modal */}
      {fullscreenSatelliteOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl w-full my-auto">
            <SatelliteOrderTracker
              order={fullscreenSatelliteOrder}
              isInline={false}
              onClose={() => setFullscreenSatelliteOrder(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
