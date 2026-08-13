import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const CreateListingView: React.FC = () => {
  const { user } = useAuth();
  const { createListing, setActiveView } = useApp();

  const [formData, setFormData] = useState({
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
        availableQuantity: Number(formData.availableQuantity),
        minOrder: Number(formData.minOrder),
        locationState: formData.locationState,
        description: formData.description || 'High quality harvest sourced directly from smallholder farm clusters.',
        imageUrl: formData.imageUrl,
        sellerId: user.id,
        sellerName: user.name,
        sellerVerified: user.verificationStatus === 'verified',
        rating: 4.9,
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
            Federal Digital Commodity Registry
          </span>
          <h1 className="font-heading font-bold text-xl text-[#012d1d] mt-1">Post Agricultural Listing</h1>
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
          <label className="block font-bold text-[#1a1c1c] mb-1">Listing Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Premium White Maize (2026 Dry Season Harvest)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full h-11 px-3 rounded-xl border border-[#717973] focus:ring-2 focus:ring-[#012d1d]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Crop / Input Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973] font-bold"
            >
              <option value="Grains">Grains (Maize, Rice, Sorghum)</option>
              <option value="Tubers">Tubers (Yam, Cassava)</option>
              <option value="Vegetables">Vegetables & Legumes (Soybeans, Tomatoes)</option>
              <option value="Inputs">Inputs (Fertilizer, Seeds, Chemicals)</option>
              <option value="Processed">Processed (Cassava Flour, Palm Oil)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Specific Commodity Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Yellow Maize, TME 419 Cassava"
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
            <label className="block font-bold text-[#1a1c1c] mb-1">Unit Type</label>
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
            <label className="block font-bold text-[#1a1c1c] mb-1">Available Supply</label>
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
            <label className="block font-bold text-[#1a1c1c] mb-1">Origin State</label>
            <input
              type="text"
              required
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              className="w-full h-11 px-3 rounded-xl border border-[#717973]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1a1c1c] mb-1">Minimum Order Quantity</label>
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
          <label className="block font-bold text-[#1a1c1c] mb-1">Detailed Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe harvest date, storage condition, variety, quality certifications..."
            className="w-full p-3 rounded-xl border border-[#717973]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full hover:bg-[#1b4332] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Publishing to Marketplace...</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>Publish Verified Listing</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
