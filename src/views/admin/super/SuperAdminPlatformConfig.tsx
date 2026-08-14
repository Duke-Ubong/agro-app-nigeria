import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Smartphone,
  Globe,
  Bell,
  CheckCircle2,
  Lock,
  Save,
  MessageSquare,
  Building,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface SuperAdminPlatformConfigProps {
  onSaveConfig: (section: string, data: any) => void;
  subTab?: 'system' | 'payments' | 'notifications' | 'content';
  onSubTabChange?: (tab: 'system' | 'payments' | 'notifications' | 'content') => void;
}

export const SuperAdminPlatformConfig: React.FC<SuperAdminPlatformConfigProps> = ({
  onSaveConfig,
  subTab = 'system',
  onSubTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'system' | 'payments' | 'notifications' | 'content'>(subTab);

  React.useEffect(() => {
    if (subTab) setInternalTab(subTab);
  }, [subTab]);

  const activeTab = subTab || internalTab;
  const setActiveTab = (t: 'system' | 'payments' | 'notifications' | 'content') => {
    setInternalTab(t);
    if (onSubTabChange) onSubTabChange(t);
  };

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // System Settings State
  const [maxTransactionCeiling, setMaxTransactionCeiling] = useState('50000000');
  const [ussdTimeoutSeconds, setUssdTimeoutSeconds] = useState('45');
  const [maxDailyOtpAttempts, setMaxDailyOtpAttempts] = useState('5');
  const [enableGpsTracking, setEnableGpsTracking] = useState(true);

  // Payment & Wallet Settings State
  const [escrowFeePercentage, setEscrowFeePercentage] = useState('1.0');
  const [minimumWithdrawal, setMinimumWithdrawal] = useState('2000');
  const [settlementWindowHours, setSettlementWindowHours] = useState('24');
  const [primaryBankGateway, setPrimaryBankGateway] = useState('NIBSS_INSTANT_PAYMENT');
  const [boaInterestRateAnnual, setBoaInterestRateAnnual] = useState('5.0');

  // Notification Settings State
  const [smsGatewayProvider, setSmsGatewayProvider] = useState('AFRICASTALKING_DIRECT');
  const [ussdFlashPriority, setUssdFlashPriority] = useState('HIGH_RELIABILITY');
  const [webhookUrlAlerts, setWebhookUrlAlerts] = useState('https://alerts.fmafs.gov.ng/v1/inbound');

  // Languages & Content State
  const [smsLanguageDefault, setSmsLanguageDefault] = useState('ha');
  const [hausaSmsTemplate, setHausaSmsTemplate] = useState(
    'AgroApp: An ajiye kudin amfanin gonarka ₦{{amount}} a cikin asusunka na escrow. Lambar oda: #{{orderId}}'
  );
  const [englishSmsTemplate, setEnglishSmsTemplate] = useState(
    'AgroApp: Escrow payment of ₦{{amount}} secured for Order #{{orderId}}. Dispatch truck assigned.'
  );
  const [yorubaSmsTemplate, setYorubaSmsTemplate] = useState(
    'AgroApp: Owo oko re ₦{{amount}} wa ni ipamo escrow. Nomba aṣẹ: #{{orderId}}'
  );
  const [igboSmsTemplate, setIgboSmsTemplate] = useState(
    'AgroApp: Edebere ego ihe ubi gi ₦{{amount}} na escrow. Nọmba iwu: #{{orderId}}'
  );

  const handleSave = (section: string) => {
    let payload = {};
    if (section === 'system') {
      payload = { maxTransactionCeiling, ussdTimeoutSeconds, maxDailyOtpAttempts, enableGpsTracking };
    } else if (section === 'payments') {
      payload = { escrowFeePercentage, minimumWithdrawal, settlementWindowHours, primaryBankGateway, boaInterestRateAnnual };
    } else if (section === 'notifications') {
      payload = { smsGatewayProvider, ussdFlashPriority, webhookUrlAlerts };
    } else {
      payload = { smsLanguageDefault, hausaSmsTemplate, englishSmsTemplate, yorubaSmsTemplate, igboSmsTemplate };
    }

    onSaveConfig(section, payload);
    setSaveMessage(`Configuration for ${section.toUpperCase()} saved and deployed.`);
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2b22] pb-2 overflow-x-auto">
        {[
          { id: 'system' as const, label: 'System Settings', icon: Sliders },
          { id: 'payments' as const, label: 'Payment & Wallet Config', icon: DollarSign },
          { id: 'notifications' as const, label: 'Notifications', icon: Bell },
          { id: 'content' as const, label: 'Languages & Content', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#10b981] text-[#0a0f0d]'
                  : 'bg-[#0f1713] text-[#8fa89b] hover:bg-[#1b2b22] border border-[#1b2b22]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {saveMessage && (
        <div className="p-3 bg-[#064e3b] text-[#6ee7b7] border border-[#10b981]/40 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tab 1: System Settings */}
      {activeTab === 'system' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22]">
            <h3 className="font-bold text-sm text-white">Platform Throughput & Gateway Controls</h3>
            <p className="text-xs text-[#8fa89b]">
              Configure national transaction limits, USSD session timeouts, and rate limits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Single Transaction Ceiling (₦ Naira)
              </label>
              <input
                type="text"
                value={maxTransactionCeiling}
                onChange={(e) => setMaxTransactionCeiling(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
              <span className="text-[11px] text-[#5a7266]">
                Transactions above this threshold trigger mandatory BOA dual-sign approval.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                USSD Session Timeout (*384*247#)
              </label>
              <input
                type="number"
                value={ussdTimeoutSeconds}
                onChange={(e) => setUssdTimeoutSeconds(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
              <span className="text-[11px] text-[#5a7266]">
                Seconds before telco session termination (MTN/Airtel standard: 45s).
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Max Daily OTP Verification Attempts
              </label>
              <input
                type="number"
                value={maxDailyOtpAttempts}
                onChange={(e) => setMaxDailyOtpAttempts(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Haulage GPS Telematics Logging
              </label>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableGpsTracking}
                    onChange={(e) => setEnableGpsTracking(e.target.checked)}
                    className="rounded border-[#1b2b22] bg-[#0a0f0d] text-[#10b981]"
                  />
                  <span className="text-white">Enforce Real-time Truck Fleet IoT Polling</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1b2b22] flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('system')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Payments & Escrow Rules */}
      {activeTab === 'payments' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22]">
            <h3 className="font-bold text-sm text-white">Banking, Escrow & Wallet Fee Architecture</h3>
            <p className="text-xs text-[#8fa89b]">
              Configure platform service fees, settlement clearing windows, and primary NIBSS routing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Platform Escrow Service Fee (%)
              </label>
              <input
                type="text"
                value={escrowFeePercentage}
                onChange={(e) => setEscrowFeePercentage(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
              <span className="text-[11px] text-[#5a7266]">
                Statutory transaction fee collected into USUCO platform revenue pool.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Minimum Farmer Wallet Withdrawal (₦)
              </label>
              <input
                type="text"
                value={minimumWithdrawal}
                onChange={(e) => setMinimumWithdrawal(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Automatic Settlement Clearing Window (Hours)
              </label>
              <input
                type="number"
                value={settlementWindowHours}
                onChange={(e) => setSettlementWindowHours(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono focus:outline-hidden focus:border-[#10b981]"
              />
              <span className="text-[11px] text-[#5a7266]">
                Hours after delivery confirmation before auto-disbursement from escrow to farmer wallet.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Primary Interbank Settlement Switch
              </label>
              <select
                value={primaryBankGateway}
                onChange={(e) => setPrimaryBankGateway(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
              >
                <option value="NIBSS_INSTANT_PAYMENT">NIBSS Instant Payment (NIP Direct Direct)</option>
                <option value="INTERSWITCH_PAYNET">Interswitch Paynet Gateway</option>
                <option value="REMITA_CENTRAL_PAY">Remita Central CBN Treasury Pool</option>
                <option value="BOA_DIRECT_CLEARING">Bank of Agriculture Core Microfinance Switch</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1b2b22] flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('payments')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Rules</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22]">
            <h3 className="font-bold text-sm text-white">National Notification & Gateway Infrastructure</h3>
            <p className="text-xs text-[#8fa89b]">
              Configure telecommunication SMS relays, USSD flash priority, and institutional webhook feeds
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">Primary SMS Gateway Provider</label>
              <select
                value={smsGatewayProvider}
                onChange={(e) => setSmsGatewayProvider(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
              >
                <option value="AFRICASTALKING_DIRECT">Africa's Talking (Direct Telco Shortcode 34091)</option>
                <option value="INFOBIP_ENTERPRISE">Infobip Enterprise Government Route</option>
                <option value="TERMII_NIGERIA">Termii Nigeria High-Delivery Route</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">USSD Session Flash Priority</label>
              <select
                value={ussdFlashPriority}
                onChange={(e) => setUssdFlashPriority(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
              >
                <option value="HIGH_RELIABILITY">High Reliability (Immediate failover to secondary aggregator)</option>
                <option value="BALANCED">Balanced Routing across MTN / Airtel / Glo / 9mobile</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">National Security Webhook Feed (FMAFS / NCC)</label>
              <input
                type="text"
                value={webhookUrlAlerts}
                onChange={(e) => setWebhookUrlAlerts(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#1b2b22] flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('notifications')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Gateway Config</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Languages & Content */}
      {activeTab === 'content' && (
        <div className="bg-[#0f1713] border border-[#1b2b22] rounded-2xl p-5 shadow-md space-y-4">
          <div className="pb-3 border-b border-[#1b2b22]">
            <h3 className="font-bold text-sm text-white">Multilingual Localization & Content Matrix</h3>
            <p className="text-xs text-[#8fa89b]">
              Manage native translations for rural farmer communications across 4 official national languages
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Default Rural Fallback Language
              </label>
              <select
                value={smsLanguageDefault}
                onChange={(e) => setSmsLanguageDefault(e.target.value)}
                className="w-full sm:w-64 p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white focus:outline-hidden focus:border-[#10b981]"
              >
                <option value="ha">Hausa (Northern Agro-Corridor)</option>
                <option value="en">English (Official Standard)</option>
                <option value="yo">Yoruba (South-West Belt)</option>
                <option value="ig">Igbo (South-East Belt)</option>
                <option value="pcm">Nigerian Pidgin (General)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Hausa SMS Template (Escrow Deposit Secured)
              </label>
              <textarea
                rows={2}
                value={hausaSmsTemplate}
                onChange={(e) => setHausaSmsTemplate(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                English SMS Template (Escrow Deposit Secured)
              </label>
              <textarea
                rows={2}
                value={englishSmsTemplate}
                onChange={(e) => setEnglishSmsTemplate(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Yoruba SMS Template (Escrow Deposit Secured)
              </label>
              <textarea
                rows={2}
                value={yorubaSmsTemplate}
                onChange={(e) => setYorubaSmsTemplate(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#8fa89b] font-semibold">
                Igbo SMS Template (Escrow Deposit Secured)
              </label>
              <textarea
                rows={2}
                value={igboSmsTemplate}
                onChange={(e) => setIgboSmsTemplate(e.target.value)}
                className="w-full p-2.5 bg-[#0a0f0d] border border-[#1b2b22] rounded-xl text-white font-mono text-xs focus:outline-hidden focus:border-[#10b981]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#1b2b22] flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('content')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-[#0a0f0d] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Multilingual Localization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
