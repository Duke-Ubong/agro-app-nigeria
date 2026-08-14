import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { getNigerianAvatar } from '../../utils/avatarUtils';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const { user } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const myOrders = orders.filter((o) =>
    o.buyerId === user.id || o.sellerName === user.name || user.role === 'transporter' || user.role === 'super_admin'
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
          <span className="text-xs font-bold uppercase tracking-wider text-[#86af99]">
            Deliveries & Orders
          </span>
          <h1 className="font-heading font-bold text-2xl mt-1">My Orders & Trip Status</h1>
          <p className="text-xs text-[#86af99]">
            Track when your crop is picked up, where the truck is on the road, and when payment is released.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#c1c8c2] p-4 space-y-4">
        <h3 className="font-heading font-bold text-sm text-[#012d1d]">Active Orders ({myOrders.length})</h3>

        <div className="space-y-3">
          {myOrders.map((ord) => {
            const step = getStatusStep(ord.status);
            return (
              <div
                key={ord.id}
                className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-3 hover:border-[#012d1d] transition-colors"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-[#e2e2e2]">
                  <div className="flex items-center gap-3">
                    <img src={ord.imageUrl} alt={ord.cropTitle} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div>
                      <div className="font-bold text-sm text-[#1a1c1c]">{ord.cropTitle}</div>
                      <div className="text-xs text-[#717973] flex items-center gap-1.5 mt-0.5">
                        <img
                          src={getNigerianAvatar(ord.sellerName)}
                          alt={ord.sellerName}
                          className="w-4 h-4 rounded-full object-cover border border-[#c1c8c2]"
                        />
                        <span>Seller: <strong className="text-[#1a1c1c]">{ord.sellerName}</strong> • Quantity: {ord.quantity} Tons</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right self-end sm:self-auto">
                    <div className="font-heading font-bold text-base text-[#012d1d]">
                      ₦{ord.totalPrice.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#c1ecd4] text-[#002114]">
                      {ord.status === 'in_transit'
                        ? 'On the Road'
                        : ord.status === 'delivered'
                        ? 'Arrived at Destination'
                        : ord.status === 'completed'
                        ? 'Completed & Paid'
                        : ord.status}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#717973] uppercase">
                    <span className={step >= 1 ? 'text-[#012d1d]' : ''}>Order Placed</span>
                    <span className={step >= 2 ? 'text-[#012d1d]' : ''}>Picked Up</span>
                    <span className={step >= 3 ? 'text-[#012d1d]' : ''}>On the Road</span>
                    <span className={step >= 4 ? 'text-[#012d1d]' : ''}>Delivered</span>
                    <span className={step >= 5 ? 'text-[#012d1d]' : ''}>Paid</span>
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

                  <div className="flex items-center gap-2">
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
                        <span>Confirm Goods OK & Release Payment</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-[#f3f3f3] border border-[#c1c8c2] text-[#012d1d] text-xs font-bold rounded-lg hover:bg-[#e8e8e8]"
                    >
                      Delivery Receipt
                    </button>
                  </div>
                </div>
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
                Electronic Delivery Receipt
              </span>
              <h3 className="font-heading font-bold text-lg text-[#012d1d] mt-1">
                Receipt #{selectedOrder.trackingCode}
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
                  <span>Total Value</span>
                  <span className="font-bold text-[#012d1d]">₦{selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-[#f3f3f3] rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[#717973]">
                  <span>Seller / Farmer</span>
                  <div className="flex items-center gap-1.5 font-bold text-[#1a1c1c]">
                    <img
                      src={getNigerianAvatar(selectedOrder.sellerName)}
                      alt={selectedOrder.sellerName}
                      className="w-5 h-5 rounded-full object-cover border border-[#c1c8c2]"
                    />
                    <span>{selectedOrder.sellerName}</span>
                  </div>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>From (Pickup Location)</span>
                  <span>{selectedOrder.originState}</span>
                </div>
                <div className="flex justify-between text-[#717973]">
                  <span>To (Delivery Destination)</span>
                  <span>{selectedOrder.destinationState}</span>
                </div>
                <div className="flex justify-between items-center text-[#717973] pt-1 border-t border-[#e2e2e2]">
                  <span>Driver & Truck</span>
                  <div className="flex items-center gap-1.5 font-bold text-[#012d1d]">
                    <img
                      src={getNigerianAvatar(selectedOrder.transporterName || 'Ibrahim Logistics')}
                      alt={selectedOrder.transporterName || 'Driver'}
                      className="w-5 h-5 rounded-full object-cover border border-[#c1c8c2]"
                    />
                    <span>{selectedOrder.transporterName || 'Ibrahim Logistics Ltd'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-[#012d1d] text-white font-bold text-xs rounded-full hover:bg-[#1b4332]"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
