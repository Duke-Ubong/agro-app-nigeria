import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const CreateListingView: React.FC = () => {
  const { user } = useAuth();
  const { createListing, setActiveView } = useApp();

  const [formData, setFormData] = useState<{
    title: string;
    cropType: string;
    category: 'Grains' | 'Tubers' | 'Vegetables' | 'Fruits' | 'Inputs' | 'Processed';
    price: number;
    unit: string;
    availableQuantity: number;
    minOrder: number;
    locationState: string;
    description: string;
    imageUrl: string;
    moistureContent: string;
    grade: string;
  }>({
    title: '',
    cropType: 'Maize',
    category: 'Grains',
    price: 180000,
    unit: 'Ton',
    availableQuantity: 50,
    minOrder: 5,
    locationState: user.state || 'Benue State',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=800',
    moistureContent: '12%',
    grade: 'Grade A Export Quality',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createListing({
        title: formData.title || `${formData.cropType} Bulk Harvest`,
        cropType: formData.cropType,
        category: formData.category,
        price: Number(formData.price),
        unit: formData.unit,
        quantity: Number(formData.availableQuantity),
        availableQuantity: Number(formData.availableQuantity),
        minOrder: Number(formData.minOrder),
        locationState: formData.locationState,
        locationLga: user.lga || 'Central',
        description: formData.description || 'High quality harvest sourced directly from smallholder farm clusters.',
        imageUrl: formData.imageUrl,
        sellerId: user.id,
        sellerName: user.name,
        sellerRole: user.role,
        sellerVerified: user.verificationStatus === 'verified',
        moistureContent: formData.moistureContent,
        grade: formData.grade,
      });

      setIsSubmitting(false);
      setActiveView('marketplace');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#c1c8c2] p-6 space-y-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#e2e2e2]">
        <div>
          <span className="text-xs font-bold uppercase text-[#012d1d] bg-[#c1ecd4] px-2.5 py-0.5 rounded-full">
            Sell Farm Produce or Supplies
          </span>
          <h1 className="font-heading font-bold text-xl text-[#012d1d] mt-1">Post Item for Sale</h1>
        </div>
        <button
          onClick={() => setActiveView('marketplace')}
          className="text-xs font-bold text-[#717973] hover:text-[#012d1d]"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#1a1c1c] mb-1">Item Title / Headline</label>
          <input
            type="text"
            required
            placeholder="e.g. Clean Dry White Maize (Bag or Ton)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-11 px-3 rounded-xl border border-[#717973] focus:ring-2 focus:ring-[#012d1d]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Type of Crop or Item</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
            >
              <option value="Grains">Grains (Maize, Rice, Sorghum)</option>
              <option value="Tubers">Tubers (Yam, Cassava)</option>
              <option value="Vegetables">Vegetables & Beans (Soybeans, Tomatoes)</option>
              <option value="Inputs">Farm Supplies (Fertilizer, Seeds, Chemicals)</option>
              <option value="Processed">Processed Foods (Cassava Flour, Palm Oil)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Exact Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Yellow Maize, Cassava Roots"
              value={formData.cropType}
              onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Price per Unit (₦)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">How is it Measured?</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
            >
              <option value="Ton">Ton (MT)</option>
              <option value="50kg Bag">50kg Bag</option>
              <option value="Basket">Basket</option>
              <option value="Litre">Litre</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Quantity Available to Sell</label>
            <input
              type="number"
              required
              value={formData.availableQuantity}
              onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Farm / Storage Location (State)</label>
            <input
              type="text"
              required
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Smallest Amount a Buyer Can Order</label>
            <input
              type="number"
              required
              value={formData.minOrder}
              onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#1a1c1c] mb-1">Tell Buyers More About Your Crop</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tell buyers about harvest date, quality, storage conditions..."
            className="w-full p-3 rounded-xl border border-[#717973]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full hover:bg-[#1b4332] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Posting Item...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Post Item for Sale</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
