import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ROLE_LABELS } from '../../components/common/RoleSwitcher';
import { getNigerianAvatar } from '../../utils/avatarUtils';

interface RegistrationFlowProps {
  selectedRole: UserRole;
  onComplete: () => void;
  onBack: () => void;
}

const NIGERIAN_STATES = [
  'Abia State', 'Adamawa State', 'Akwa Ibom State', 'Anambra State', 'Bauchi State',
  'Bayelsa State', 'Benue State', 'Borno State', 'Cross River State', 'Delta State',
  'Ebonyi State', 'Edo State', 'Ekiti State', 'Enugu State', 'FCT Abuja',
  'Gombe State', 'Imo State', 'Jigawa State', 'Kaduna State', 'Kano State',
  'Katsina State', 'Kebbi State', 'Kogi State', 'Kwara State', 'Lagos State',
  'Nasarawa State', 'Niger State', 'Ogun State', 'Ondo State', 'Osun State',
  'Oyo State', 'Plateau State', 'Rivers State', 'Sokoto State', 'Taraba State',
  'Yobe State', 'Zamfara State'
];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  selectedRole,
  onComplete,
  onBack,
}) => {
  const { updateUser, loginRole } = useAuth();
  const info = ROLE_LABELS[selectedRole];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: 'Kaduna State',
    lga: '',
    address: '',
    companyName: '',
    cacNumber: '',
    nin: '',
    cropTypes: 'Maize, Cassava',
    farmSizeHectares: '5',
    memberCount: '50',
    businessType: 'Wholesaler',
    vehicleType: '30-Ton Flatbed Truck',
    licensePlate: 'KAD-123-AA',
    department: 'Agronomy & Field Services',
    employeeId: 'AGR-8823',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginRole(selectedRole);
    const userName = formData.fullName || `${info.title} User`;
    updateUser({
      name: userName,
      email: formData.email || `${selectedRole}@agro.ng`,
      phone: formData.phone || '+234 800 000 0000',
      state: formData.state,
      lga: formData.lga || 'Central LGA',
      address: formData.address,
      companyName: formData.companyName,
      cacNumber: formData.cacNumber,
      nin: formData.nin,
      cropTypes: formData.cropTypes.split(',').map((s) => s.trim()),
      farmSizeHectares: parseFloat(formData.farmSizeHectares) || 2,
      memberCount: parseInt(formData.memberCount, 10) || 25,
      businessType: formData.businessType,
      vehicleType: formData.vehicleType,
      licensePlate: formData.licensePlate,
      department: formData.department,
      employeeId: formData.employeeId,
      photoUrl: getNigerianAvatar(userName),
      verificationStatus: 'pending',
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col justify-between p-4 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#c1c8c2]">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[#e8e8e8] text-[#012d1d] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h1 className="font-heading font-bold text-lg text-[#012d1d]">{info.title} Registration</h1>
          <p className="text-[10px] text-[#717973]">AgroApp Registration Form</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="my-auto py-6 space-y-4">
        <div className="p-3 bg-white border border-[#c1c8c2] rounded-xl flex items-center gap-3">
          <div className="p-2 bg-[#1b4332] text-[#c1ecd4] rounded-lg">
            <span className="material-symbols-outlined text-[24px]">{info.icon}</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-[#012d1d]">{info.title} Onboarding</h2>
            <p className="text-xs text-[#414844]">{info.subtitle}</p>
          </div>
        </div>

        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
              Full Name / Primary Contact <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ibrahim Abubakar"
              className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c] focus:border-[#012d1d] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
              Phone Number <span className="text-[#ba1a1a]">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234 803 000 0000"
              className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c] focus:border-[#012d1d] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c] focus:border-[#012d1d] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1a1c1c] mb-1">
              Primary Operating State <span className="text-[#ba1a1a]">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c] focus:border-[#012d1d] focus:outline-none"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Specific Additional Fields */}
        {selectedRole === 'farmer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Primary Crops Grown</label>
              <input
                type="text"
                name="cropTypes"
                value={formData.cropTypes}
                onChange={handleChange}
                placeholder="e.g. Maize, Cassava, Yam"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Farm Size (Hectares)</label>
              <input
                type="number"
                name="farmSizeHectares"
                value={formData.farmSizeHectares}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">National Identity Number (NIN)</label>
              <input
                type="text"
                name="nin"
                value={formData.nin}
                onChange={handleChange}
                placeholder="11 Digit NIN Number"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
          </div>
        )}

        {selectedRole === 'cooperative' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Registered Cooperative Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Zaria Farmers Co-op Society"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Active Member Count</label>
              <input
                type="number"
                name="memberCount"
                value={formData.memberCount}
                onChange={handleChange}
                placeholder="120"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">CAC Registration / Registration No.</label>
              <input
                type="text"
                name="cacNumber"
                value={formData.cacNumber}
                onChange={handleChange}
                placeholder="RC-998822"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
          </div>
        )}

        {selectedRole === 'buyer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Company / Enterprise Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Premium Food Processors Ltd"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              >
                <option value="Food Processing">Food Processing Factory</option>
                <option value="Commodity Exporter">Commodity Exporter</option>
                <option value="Wholesaler / Aggregator">Wholesaler & Aggregator</option>
                <option value="Institutional Buyer">Institutional Buyer</option>
              </select>
            </div>
          </div>
        )}

        {selectedRole === 'supplier' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Input Merchant Business Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. AgriGrow Seeds & Fertilizers"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">NAFDAC / License Status</label>
              <input
                type="text"
                name="cacNumber"
                value={formData.cacNumber}
                onChange={handleChange}
                placeholder="License No: NF-8829"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
          </div>
        )}

        {selectedRole === 'transporter' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Vehicle / Haulage Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              >
                <option value="30-Ton Flatbed Truck">30-Ton Flatbed Truck</option>
                <option value="15-Ton Covered Van">15-Ton Covered Van</option>
                <option value="5-Ton Pick-Up">5-Ton Pick-Up Truck</option>
                <option value="Tractor & Trailer">Tractor & Trailer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">License Plate Number</label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                placeholder="KAD-882-X"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
          </div>
        )}

        {(selectedRole === 'institutional_admin' || selectedRole === 'gov_admin' || selectedRole === 'super_admin') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f3f3f3] rounded-xl border border-[#c1c8c2]">
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Ministry Department / Bureau</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. ADP Directorate"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1a1c1c] mb-1">Official Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="FMAFS-8839"
                className="w-full h-11 px-3 rounded-lg border border-[#717973] bg-white text-xs text-[#1a1c1c]"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 bg-[#012d1d] text-white font-heading font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-md mt-4"
        >
          <span>Complete Registration & Verify Identity</span>
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </button>
      </form>
    </div>
  );
};
