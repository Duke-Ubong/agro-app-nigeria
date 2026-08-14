import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

// Local Type Definitions
type CropType = 'Maize' | 'Cassava' | 'Rice' | 'Yam' | 'Soybeans';
type GrowthStage = 'Land Preparation' | 'Sowing & Spacing' | 'Fertilizer & Weed Care' | 'Harvesting & Storage';
type LanguageType = 'English' | 'Hausa' | 'Yoruba' | 'Igbo';

interface CropAdvisory {
  task: string;
  spacing: string;
  inputs: string;
  yieldTarget: string;
  details: string;
  hausaTranslation: string;
  yorubaTranslation: string;
  igboTranslation: string;
}

const CROP_ADVISORY_DB: Record<CropType, Record<GrowthStage, CropAdvisory>> = {
  Maize: {
    'Land Preparation': {
      task: 'Plow farm twice and harrow. Apply 5 tons of cured poultry manure per hectare.',
      spacing: 'N/A (Clearing phase)',
      inputs: 'Organic Manure, Lime (if soil pH < 5.5)',
      yieldTarget: '3.5 - 5.0 MT / Hectare',
      details: 'Ensure all weeds are cleared. Incorporate organic material into the top 15cm of soil at least 2 weeks before sowing to allow decomposition.',
      hausaTranslation: 'Yi noma sau biyu sannan ka karkada kasar. Yi amfani da takin kaji tan 5 a kowane hekta.',
      yorubaTranslation: 'Tu ilẹ lẹmeji ki o si kọ rọ. Lo toonu marun-un ti ajile adiye fun saare kan.',
      igboTranslation: 'Kọọ ubi ugboro abụọ tupu ị kọọ ihe. Jiri nri ọkụkọ tọn ise maka otu hekta.'
    },
    'Sowing & Spacing': {
      task: 'Sow high-yielding hybrid seeds (e.g., Oba Super-6 or SC 510) at first steady rains.',
      spacing: '75cm between rows x 25cm between plants (1 seed per hole)',
      inputs: 'Certified Hybrid Seeds, Seed Dressing (Apron Star)',
      yieldTarget: '4.0 - 5.5 MT / Hectare',
      details: 'Dress seeds with fungicide/insecticide before sowing. Plant at a depth of 3-5cm when soil is moist.',
      hausaTranslation: 'Shuka ingantaccen irin masara (Oba Super-6) idan aka fara samun ruwan sama na gari.',
      yorubaTranslation: 'Gbin irugbin agbado alafia (Oba Super-6) ni kete ti ojo ba bẹrẹ si rọ dada.',
      igboTranslation: 'Gha mkpụrụ ọka dị mma (dịka Oba Super-6) mgbe mmiri ozuzo mbụ zosịrị.'
    },
    'Fertilizer & Weed Care': {
      task: 'First fertilizer dose at 2 weeks. Pre-emergence weeding immediately after sowing.',
      spacing: 'N/A',
      inputs: 'NPK 15-15-15 (6 bags/ha), Urea (3 bags/ha), Selective Herbicide',
      yieldTarget: '4.5 - 6.0 MT / Hectare',
      details: 'Apply NPK 15-15-15 at 2 weeks using ring method (5cm away from plant stem). Top-dress with Urea at 6 weeks.',
      hausaTranslation: 'Sanya takin NPK kashi na farko bayan mako biyu. Yi amfani da takin Urea bayan mako shida.',
      yorubaTranslation: 'Lo ajile NPK akọkọ ni ọsẹ meji. Lo ajile Urea ni ọsẹ kẹfa.',
      igboTranslation: 'Tinye fatịlaịza NPK nke mbụ na izu abụọ. Tinye fatịlaịza Urea na izu isii.'
    },
    'Harvesting & Storage': {
      task: 'Harvest when cobs turn yellow-brown. De-husk and sun-dry to safe moisture levels.',
      spacing: 'N/A',
      inputs: 'Hermetic Storage Bags (PICS bags), Aflatoxin field tester',
      yieldTarget: 'N/A (Harvest)',
      details: 'Sun-dry grains on concrete floors or clean tarpaulins. Keep moisture level below 12% to prevent mold and aflatoxin.',
      hausaTranslation: 'Kuna girbi idan ganyen masarar ya bushe. Busar da ita sosai kafin a adana.',
      yorubaTranslation: 'Kore agbado nigba ti o ba rọ dada. Sa a ninu oorun ki o to tọju rẹ.',
      igboTranslation: 'Weere ọka mgbe ọ fọrọ obere ka ọ kpọọ nkụ. Kpọọ ya n’anwụ nke ọma tupu ị chekwaba.'
    }
  },
  Cassava: {
    'Land Preparation': {
      task: 'Prepare high ridges or mounds. Deep loose soil is essential for root expansion.',
      spacing: 'N/A',
      inputs: 'Tractor Ridger or Manual labor, Poultry Manure',
      yieldTarget: '20 - 25 MT / Hectare',
      details: 'Ridgetops provide loose, well-aerated soil. Build ridges 1m apart. Do not compact the soil.',
      hausaTranslation: 'Yi manyan kunya ko tuddai don sauƙaƙa haɓakar jijiyoyi.',
      yorubaTranslation: 'Kọ ebẹ giga tabi lile. Ilẹ ti o rọrun jẹ pataki fun rẹ.',
      igboTranslation: 'Kpụọ rịji ma ọ bụ mgbago dị elu. Ọ dị mkpa maka mgbasawanye mgbọrọgwụ.'
    },
    'Sowing & Spacing': {
      task: 'Plant certified disease-free stem cuttings (TME 419 or TMS 30572) obliquely.',
      spacing: '1m between ridges x 1m between plants (10,000 stands per hectare)',
      inputs: 'Certified Stem Cuttings (25cm length with 4-6 nodes)',
      yieldTarget: '22 - 28 MT / Hectare',
      details: 'Plant stem cuttings at an angle of 45 degrees, burying 2/3 of the length in the soil with buds pointing upward.',
      hausaTranslation: 'Dasa reshen rogo mai inganci mai tsawon santimita 25 kwance ko a tsaye kadan.',
      yorubaTranslation: 'Gbin igi gbaguda ti o ni ilera ni igun 45 pẹlu oju rẹ si oke.',
      igboTranslation: 'Ghaa mkpọrọgwụ akpu dị mma nke nwere ogologo 25cm.'
    },
    'Fertilizer & Weed Care': {
      task: 'Apply NPK 12-12-17 or organic compost at 6-8 weeks. Keep farm weed-free.',
      spacing: 'N/A',
      inputs: 'NPK 12-12-17 (6 bags/ha), Pre-emergence herbicide',
      yieldTarget: '25 - 32 MT / Hectare',
      details: 'Cassava has high potassium demands for starch formation. Apply fertilizer in semi-circles around the stem.',
      hausaTranslation: 'Yi amfani da takin NPK mai yawan Potassium a mako na 6 zuwa 8.',
      yorubaTranslation: 'Lo ajile ti o ni potasiomu giga ni ọsẹ 6 si 8 fun starch rẹ.',
      igboTranslation: 'Tinye fatịlaịza nwere potassium dị elu na izu isii ruo asatọ.'
    },
    'Harvesting & Storage': {
      task: 'Harvest roots 10-12 months after planting. Process within 24 hours to avoid spoilage.',
      spacing: 'N/A',
      inputs: 'Processing tools (graters, pressers), Cold transport stubs',
      yieldTarget: 'N/A (Harvest)',
      details: 'Harvest carefully to avoid breaking roots. Process into Garri, Fufu, or High Quality Cassava Flour immediately.',
      hausaTranslation: 'Yi girbi a cikin mako 10 zuwa 12 sannan a sarrafa shi nan take don kada ya lalace.',
      yorubaTranslation: 'Wa gbaguda ni mako 10 si 12 lẹhin gbingbin rẹ. Se gari tabi fufu ni kete.',
      igboTranslation: 'Gbute akpu n’ọnwa iri ruo iri na abụọ. Sụọ ya n’ime gari ma ọ bụ fufu ozugbo.'
    }
  },
  Rice: {
    'Land Preparation': {
      task: 'Construct bunds for water retention. Plow, flood, and puddle the soil thoroughly.',
      spacing: 'N/A',
      inputs: 'Bund builders, Levelers, Organic Compost',
      yieldTarget: '4.0 - 6.0 MT / Hectare',
      details: 'Leveling is critical for uniform water distribution. Construct sturdy peripheral bunds 50cm high.',
      hausaTranslation: 'Gina shingaye don riƙe ruwa. Nomar ƙasa sannan a jika ta sosai.',
      yorubaTranslation: 'Kọ ebẹ ti yoo di omi mọ. Tu ilẹ ki o si fun ni omi to pọ.',
      igboTranslation: 'Kpụọ mgbidi iji gbochie mmiri ịgbanahụ. Kọọ ubi ma jiri mmiri jupụta ya.'
    },
    'Sowing & Spacing': {
      task: 'Transplant healthy 21-day nursery seedlings (e.g., FARO 44 or FARO 60) into wet mud.',
      spacing: '20cm x 20cm spacing with 2-3 seedlings per hill',
      inputs: 'FARO 44 certified seeds, Nursery trays',
      yieldTarget: '4.5 - 6.5 MT / Hectare',
      details: 'Transplant nursery seedlings at a shallow depth of 2-3cm. Keep water depth at 2-5cm for first 2 weeks.',
      hausaTranslation: 'Dasa tsiro mai kwana 21 daga gidan tsiro zuwa cikin laka mai albarka.',
      yorubaTranslation: 'Gbin tsiro ti o ti lo ọjọ 21 lati ibi osin tsiro sinu amọ tutu.',
      igboTranslation: 'Kụgharịa mkpụrụ osisi ruru ụbọchị iri abụọ na otu n’ime apịtị dị mma.'
    },
    'Fertilizer & Weed Care': {
      task: 'Split application of NPK 15-15-15 at transplanting, and Urea at panicle initiation.',
      spacing: 'N/A',
      inputs: 'NPK 15-15-15 (4 bags/ha), Urea (2 bags/ha), Post-emergence herbicide',
      yieldTarget: '5.0 - 7.0 MT / Hectare',
      details: 'Apply primary NPK fertilizer at transplanting. Top-dress with Urea at 6-7 weeks (panicle initiation phase) in standing water.',
      hausaTranslation: 'Yi amfani da takin NPK lokacin dasawa sannan Urea bayan mako shida.',
      yorubaTranslation: 'Lo ajile NPK nigba gbingbin ati ajile Urea lẹhin ọsẹ isis.',
      igboTranslation: 'Tinye fatịlaịza NPK n’oge mbugharị, na Urea na izu isii gaa n’ihu.'
    },
    'Harvesting & Storage': {
      task: 'Harvest when 80-85% of grains turn golden yellow. Thresh immediately and dry.',
      spacing: 'N/A',
      inputs: 'Thresher, Tarpaulin, Moisture meter',
      yieldTarget: 'N/A (Harvest)',
      details: 'Thresh carefully to minimize grain breakage. Dry on clean surfaces to 13-14% moisture before milling.',
      hausaTranslation: 'Yi girbi idan kashi tamanin na masarar ya zama ruwan gwal sannan a karkade nan take.',
      yorubaTranslation: 'Kore iresi nigba ti o ba rọ dada lẹhinna lọ rẹ kete.',
      igboTranslation: 'Gbute osikapa mgbe ọ tụgharịrị gaa na agba odo. Sụọ ya ozugbo kpọọ ya n’anwụ.'
    }
  },
  Yam: {
    'Land Preparation': {
      task: 'Dig deep planting holes and construct massive mounds (1m wide x 75cm high).',
      spacing: 'N/A',
      inputs: 'Mound spade, Mulching grass/straw',
      yieldTarget: '12 - 18 MT / Hectare',
      details: 'Incorporate decomposed organic manure deep into the mound. Cover mounds with dry grass to prevent heat damage.',
      hausaTranslation: 'Tona zurfafa rami sannan ka gina manyan tuddai na dasa duka.',
      yorubaTranslation: 'Gbẹ ihò jinjin ki o si kọ ebẹ nla fun gbingbin isu.',
      igboTranslation: 'Gwuo olulu miri emi ma kpụọ nnukwu rịji maka ịkọ ji.'
    },
    'Sowing & Spacing': {
      task: 'Plant healthy setts (250g-500g) treated with ash or fungicide early in the dry season.',
      spacing: '1m between mounds x 1m between plants along the ridge',
      inputs: 'Yam seed setts, fungicide/wood ash',
      yieldTarget: '14 - 20 MT / Hectare',
      details: 'Plant setts with the cut surface facing upwards at a depth of 10-15cm. Mulch the top of the mound immediately.',
      hausaTranslation: 'Shuka yankakken doya mai inganci sannan a rufe da ciyawa don kariya.',
      yorubaTranslation: 'Gbin ege isu ti o ni ilera ki o si lo koriko lati bo ori ebẹ naa.',
      igboTranslation: 'Ghaa mkpụrụ ji dị mma nke a rọrọ rọ, kpuchie ya na taya ma ọ bụ ahịhịa.'
    },
    'Fertilizer & Weed Care': {
      task: 'Stake vines immediately after emergence. Apply compound NPK fertilizer at 10 weeks.',
      spacing: 'N/A',
      inputs: 'Staking poles (2-3m height), NPK 15-15-15 (5 bags/ha)',
      yieldTarget: '15 - 22 MT / Hectare',
      details: 'Staking is critical to maximize sunlight capture. Keep vines securely supported. Apply NPK in circular band around mound base.',
      hausaTranslation: 'Kafa katako don goyon bayan rassan doya. Sanya takin NPK bayan mako goma.',
      yorubaTranslation: 'Fi igi ti isu lẹhin ti o ba bẹrẹ si hù. Lo ajile NPK lẹhin ọsẹ mẹwa.',
      igboTranslation: 'Tụọ ji mgbatị ozugbo mkpụrụ osisi pụtara. Tinye fatịlaịza NPK n’izu iri.'
    },
    'Harvesting & Storage': {
      task: 'Harvest carefully when foliage turns yellow and dries. Store in dry, well-ventilated barns.',
      spacing: 'N/A',
      inputs: 'Traditional Yam Barn or Modern ventilated crates',
      yieldTarget: 'N/A (Harvest)',
      details: 'Avoid skin bruising during harvest. Brush off soil. Hang tubers in a shady, traditional vertical timber barn.',
      hausaTranslation: 'Yi girbi da hankali lokacin da ganyen ya bushe. Adana a rumbu mai iska.',
      yorubaTranslation: 'Wa isu jẹjẹ nigba ti ewe rẹ ba rọ. Tọju rẹ si ibi ti isẹgun afẹfẹ rọrun.',
      igboTranslation: 'Gbute ji nke ọma mgbe akwụkwọ ya kpọrọ nkụ. Chekwaba ya n’oba ji nwere ikuku.'
    }
  },
  Soybeans: {
    'Land Preparation': {
      task: 'Harrow field to a fine tilth. Ensure proper drainage to prevent seed rotting.',
      spacing: 'N/A',
      inputs: 'Harrower, Compost, Rhizobium Inoculant',
      yieldTarget: '1.8 - 2.5 MT / Hectare',
      details: 'Soybeans require flat, well-drained seedbeds. Work the soil to break up clods and create a smooth sowing surface.',
      hausaTranslation: 'Karkada kasar noma sosai sannan a samar da hanyar magudanar ruwa.',
      yorubaTranslation: 'Tu ilẹ ki o si rii daju pe omi n ṣan dada lati gba irugbin rẹ laaye.',
      igboTranslation: 'Kọọ ubi ka ọ dị mma nke ọma. Gbaa mbọ hụ na mmiri anaghị eguzo n’ubi.'
    },
    'Sowing & Spacing': {
      task: 'Inoculate seeds with Rhizobium. Sow when rain is fully established.',
      spacing: '50cm between rows x 10cm between plants (plant at 2-3cm depth)',
      inputs: 'Certified TGx seeds, Rhizobium inoculant, Phosphate fertilizer',
      yieldTarget: '2.0 - 2.8 MT / Hectare',
      details: 'Inoculating with Rhizobium ensures nitrogen fixation, reducing synthetic nitrogen fertilizer needs by up to 80%.',
      hausaTranslation: 'Hada irin da kwayoyin cuta na Rhizobium sannan a shuka a zurfin 2-3cm.',
      yorubaTranslation: 'Lo Rhizobium fun irugbin rẹ ki o to gbin lati fun ni nitrogen to pọ.',
      igboTranslation: 'Ghaa mkpụrụ osisi nwere Rhizobium mgbe mmiri ozuzo zuru ezu.'
    },
    'Fertilizer & Weed Care': {
      task: 'Apply Single Super Phosphate (SSP) at planting. Weed early within first 3 weeks.',
      spacing: 'N/A',
      inputs: 'SSP fertilizer (4 bags/ha), Pre-emergence herbicide',
      yieldTarget: '2.2 - 3.2 MT / Hectare',
      details: 'Soybeans fix their own nitrogen but require phosphate for root development and nodulation. Weed twice.',
      hausaTranslation: 'Yi amfani da takin Phosphate lokacin shuka. Yi ciyawa bayan mako uku.',
      yorubaTranslation: 'Lo ajile SSP lakoko gbingbin. Ko koriko kuro ni mako mẹta akọkọ.',
      igboTranslation: 'Tinye fatịlaịza SSP n’oge ọkụkụ. Gbuo ahịhịa n’ime izu atọ mbụ.'
    },
    'Harvesting & Storage': {
      task: 'Harvest when pods are dry and rattle. Thresh instantly to avoid pod shattering.',
      spacing: 'N/A',
      inputs: 'Threshing stick, Polyethylene bags, moisture check',
      yieldTarget: 'N/A (Harvest)',
      details: 'Delay in harvest causes pods to shatter in the sun, leading to massive grain losses. Dry grains to <10% moisture.',
      hausaTranslation: 'Yi girbi lokacin da kwanson ya bushe sannan a daka kwayoyin nan take.',
      yorubaTranslation: 'Kore lẹhin ti o ba gbẹ dada. Sa a ninu oorun to pọ.',
      igboTranslation: 'Gbute mgbe ọ kpọrọ nkụ nke ọma. Sụọ ya ozugbo tupu mkpụrụ ya fesa.'
    }
  }
};

export const AdvisoryView: React.FC = () => {
  const { user } = useAuth();
  const { weather, marketPrices, pestAlerts, extensionGuides } = useApp();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'planner' | 'calculator' | 'scanner' | 'markets' | 'broadcasts'>('planner');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('English');

  // Interactive Planner states
  const [selectedCrop, setSelectedCrop] = useState<CropType>('Maize');
  const [selectedStage, setSelectedStage] = useState<GrowthStage>('Sowing & Spacing');

  // Audio Playback states (Simulated voice-over reader)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioPlaybackText, setAudioPlaybackText] = useState('');

  // Input Calculator states
  const [farmSize, setFarmSize] = useState<number>(2.5); // Hectares
  const [sizeUnit, setSizeUnit] = useState<'Hectares' | 'Acres'>('Hectares');

  // Pest Scanner states
  const [scannedFile, setScannedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<{
    status: 'healthy' | 'infected' | null;
    pestName: string;
    confidence: number;
    description: string;
    treatment: string;
  }>({ status: null, pestName: '', confidence: 0, description: '', treatment: '' });

  // Cargo Value Calculator states
  const [cargoCrop, setCargoCrop] = useState(marketPrices[0]?.cropTitle || marketPrices[0]?.crop || 'Maize');
  const [cargoWeight, setCargoWeight] = useState(50); // bags
  const [cargoMarket, setCargoMarket] = useState(marketPrices[0]?.marketName || `${marketPrices[0]?.topState || 'Kano'} Central Market`);

  // Audio simulator loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const currentAdvisory = CROP_ADVISORY_DB[selectedCrop][selectedStage];

  // Dynamically set speaking voice text depending on language selection
  const handlePlayVoiceOver = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    let msg = '';
    if (selectedLanguage === 'Hausa') {
      msg = currentAdvisory.hausaTranslation;
    } else if (selectedLanguage === 'Yoruba') {
      msg = currentAdvisory.yorubaTranslation;
    } else if (selectedLanguage === 'Igbo') {
      msg = currentAdvisory.igboTranslation;
    } else {
      msg = currentAdvisory.task;
    }

    setAudioPlaybackText(msg);
    setAudioProgress(0);
    setIsPlayingAudio(true);
  };

  // Image Upload Diagnostic Flow Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScannedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult({ status: null, pestName: '', confidence: 0, description: '', treatment: '' });
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStep('Enhancing image contrast...');

    setTimeout(() => {
      setScanProgress(30);
      setScanStep('Isolating plant leaf foliage patterns...');
    }, 1200);

    setTimeout(() => {
      setScanProgress(65);
      setScanStep('Querying Federal Ministry of Agriculture Diagnostic DB...');
    }, 2400);

    setTimeout(() => {
      setScanProgress(90);
      setScanStep('Matching infestation symptoms...');
    }, 3600);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanStep('');

      // Random diagnostic report depending on selected crop
      if (selectedCrop === 'Maize') {
        setScanResult({
          status: 'infected',
          pestName: 'Fall Armyworm (Spodoptera frugiperda)',
          confidence: 94.6,
          description: 'Early-stage leaf-feeding identified. Distinct pinholes and ragged leaf margins with frass are present.',
          treatment: 'Apply Emamectin Benzoate or bio-pesticide (Neem Extract) early morning. Spray directly into the whorl.',
        });
      } else if (selectedCrop === 'Cassava') {
        setScanResult({
          status: 'infected',
          pestName: 'Cassava Mosaic Disease (CMD)',
          confidence: 88.2,
          description: 'Severe mosaic patterns with leaf chlorosis and puckered leaf margins observed.',
          treatment: 'Uproot infected stems immediately. Next season, source certified disease-free stems (TME 419) from cooperative hub.',
        });
      } else {
        setScanResult({
          status: 'healthy',
          pestName: 'Healthy Crop Profile',
          confidence: 97.4,
          description: 'Chlorophyll levels normal. Leaf surface shows no active lesions, fungal spores, or insect chew damage.',
          treatment: 'Maintain current wetting schedule. Apply split compound fertilizer according to growth guidelines.',
        });
      }
    }, 4500);
  };

  // Input Calculator Values
  const sizeInHectares = sizeUnit === 'Hectares' ? farmSize : farmSize * 0.404686;
  const calculatedSeedsKg = Math.round(sizeInHectares * (selectedCrop === 'Maize' ? 20 : selectedCrop === 'Rice' ? 50 : selectedCrop === 'Soybeans' ? 60 : 1));
  const calculatedNpkBags = Math.round(sizeInHectares * (selectedCrop === 'Yam' ? 5 : selectedCrop === 'Cassava' ? 6 : selectedCrop === 'Rice' ? 4 : 6));
  const calculatedUreaBags = Math.round(sizeInHectares * (selectedCrop === 'Maize' ? 3 : selectedCrop === 'Rice' ? 2 : selectedCrop === 'Soybeans' ? 0 : 2));
  const expectedYieldMT = (sizeInHectares * (selectedCrop === 'Maize' ? 4.5 : selectedCrop === 'Cassava' ? 24 : selectedCrop === 'Rice' ? 5.2 : selectedCrop === 'Yam' ? 16 : 2.2)).toFixed(1);

  // Wholesale Grains Index Lookup
  const activeMarketPrice = marketPrices.find((m) => ((m.cropTitle || m.crop) || '').toLowerCase().includes((cargoCrop || '').toLowerCase())) || marketPrices[0];
  const activePriceValue = activeMarketPrice ? (activeMarketPrice.currentPrice || activeMarketPrice.priceNaira || 0) : 0;
  const cargoEstValue = activePriceValue * cargoWeight;

  return (
    <div className="space-y-6">
      {/* Unified Banner & Multilingual Selector */}
      <div className="bg-[#012d1d] text-white p-6 rounded-2xl shadow-sm border border-[#1b4332] space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#86af99] bg-[#1b4332] px-3 py-1 rounded-full border border-[#86af99]/30">
              Weather & Farm Advice
            </span>
            <h1 className="font-heading font-extrabold text-2xl mt-2 tracking-tight">
              Farming Advice & Guides
            </h1>
            <p className="text-xs text-[#86af99] max-w-xl">
              Get planting tips, check your farm size to know how many seed and fertilizer bags you need, and test crop health.
            </p>
          </div>

          {/* Voice Language Picker */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-[#1b4332]/50 p-2 rounded-xl border border-white/10 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#c1ecd4] font-semibold pl-1">
              <span className="material-symbols-outlined text-[18px]">g_translate</span>
              <span>Listen in Your Language:</span>
            </div>
            <div className="grid grid-cols-4 gap-1 w-full sm:w-auto">
              {(['English', 'Hausa', 'Yoruba', 'Igbo'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    if (isPlayingAudio) setIsPlayingAudio(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-[#e0a000] text-black shadow-xs'
                      : 'text-[#86af99] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time State Specific Weather banner */}
        {weather && (
          <div className="bg-[#1b4332] p-4 rounded-xl border border-[#274e3d] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#012d1d] text-[#c1ecd4] flex items-center justify-center border border-[#274e3d]">
                <span className="material-symbols-outlined text-[28px] animate-pulse">partly_cloudy_day</span>
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-[#c1ecd4] flex items-center gap-2">
                  <span>{weather.temperatureC ?? weather.tempCelsius ?? 29}°C</span>
                  <span className="text-xs font-medium text-white/90 bg-[#012d1d] px-2 py-0.5 rounded-full">
                    {weather.condition}
                  </span>
                </div>
                <div className="text-[11px] text-[#86af99] font-medium">
                  State: <strong className="text-white">{weather.state}</strong> • LGA: <strong className="text-white">{weather.lga || 'National Central'}</strong> • Chance of Rain: <strong className="text-white">{weather.rainProbability ?? weather.rainForecastPercent ?? 15}%</strong>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto bg-[#012d1d] p-3 rounded-xl border border-[#274e3d] flex-1 max-w-lg">
              <div className="text-[10px] font-bold text-[#e0a000] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                <span>Today's Farm Advice:</span>
              </div>
              <p className="text-white text-xs leading-relaxed mt-1 font-medium italic">
                {selectedLanguage === 'Hausa'
                  ? 'Kyakkyawan lokaci don shuka masara da waken soya. Danshi kasar ya isa.'
                  : selectedLanguage === 'Yoruba'
                  ? 'Akokọ to dara fun gbingbin agbado ati ewe nitori ojo to rọ dada.'
                  : selectedLanguage === 'Igbo'
                  ? 'Oge magburu onwe ya maka ịkọ ọka na akpu. Mmiri dị n’ala dị mma.'
                  : 'Soil has good water. It is a great time to plant seeds and apply fertilizer.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Robust Segmented Navigation Bar */}
      <div className="flex border-b border-[#c1c8c2] overflow-x-auto gap-1 no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('planner')}
          className={`px-4 py-2.5 font-heading font-bold text-xs rounded-t-xl shrink-0 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'planner'
              ? 'border-[#012d1d] text-[#012d1d] bg-white'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>🌱 Crop Planting Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2.5 font-heading font-bold text-xs rounded-t-xl shrink-0 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'calculator'
              ? 'border-[#012d1d] text-[#012d1d] bg-white'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calculate</span>
          <span>🧮 Farm Size & Seed Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2.5 font-heading font-bold text-xs rounded-t-xl shrink-0 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'scanner'
              ? 'border-[#012d1d] text-[#012d1d] bg-white'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">biotech</span>
          <span>🔬 Plant Doctor (Leaf Checker)</span>
        </button>

        <button
          onClick={() => setActiveTab('markets')}
          className={`px-4 py-2.5 font-heading font-bold text-xs rounded-t-xl shrink-0 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'markets'
              ? 'border-[#012d1d] text-[#012d1d] bg-white'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span>📈 Market Prices & Harvest Value</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`px-4 py-2.5 font-heading font-bold text-xs rounded-t-xl shrink-0 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'broadcasts'
              ? 'border-[#012d1d] text-[#012d1d] bg-white'
              : 'border-transparent text-[#717973] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">radio</span>
          <span>📻 Radio Programs & Extension Officers</span>
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. SMART CROP PLANNER TAB */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Crop & Stage Selectors */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-5">
            <div>
              <label className="block text-[10px] font-extrabold text-[#717973] uppercase tracking-wider mb-2">
                1. Select Target Crop
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Maize', 'Cassava', 'Rice', 'Yam', 'Soybeans'] as CropType[]).map((crop) => (
                  <button
                    key={crop}
                    onClick={() => {
                      setSelectedCrop(crop);
                      setIsPlayingAudio(false);
                    }}
                    className={`p-3 rounded-xl border font-heading font-bold text-xs flex items-center gap-2 transition-all ${
                      selectedCrop === crop
                        ? 'bg-[#012d1d] text-white border-transparent'
                        : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#414844] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    <span>
                      {crop === 'Maize' && '🌽'}
                      {crop === 'Cassava' && '🌿'}
                      {crop === 'Rice' && '🌾'}
                      {crop === 'Yam' && '🥔'}
                      {crop === 'Soybeans' && '🌱'}
                    </span>
                    <span>{crop}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-[#717973] uppercase tracking-wider mb-2">
                2. Select Farm Growth Stage
              </label>
              <div className="space-y-2">
                {(['Land Preparation', 'Sowing & Spacing', 'Fertilizer & Weed Care', 'Harvesting & Storage'] as GrowthStage[]).map((stage) => (
                  <button
                    key={stage}
                    onClick={() => {
                      setSelectedStage(stage);
                      setIsPlayingAudio(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border font-body text-xs font-bold text-left flex items-center justify-between transition-all ${
                      selectedStage === stage
                        ? 'bg-[#e0a000] text-black border-transparent shadow-xs'
                        : 'bg-[#f9f9f9] border-[#e2e2e2] text-[#414844] hover:bg-[#e8e8e8]'
                    }`}
                  >
                    <span>{stage}</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Detailed Advisory Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e2e2e2]">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-[#012d1d] flex items-center gap-1.5">
                    <span>{selectedCrop}</span>
                    <span className="text-xs text-[#717973]">•</span>
                    <span className="text-xs text-[#e0a000] uppercase font-bold">{selectedStage}</span>
                  </h3>
                  <p className="text-[10px] text-[#717973] font-semibold">
                    Federally Approved Practice Protocol
                  </p>
                </div>

                <span className="text-xs font-bold text-[#012d1d] bg-[#c1ecd4] px-2.5 py-1 rounded-full self-start">
                  Target: {currentAdvisory.yieldTarget !== 'N/A' ? currentAdvisory.yieldTarget : 'High Efficiency'}
                </span>
              </div>

              {/* Multilingual Voice Over Card Panel */}
              <div className="bg-[#f2fcf6] rounded-xl p-4 border border-[#c1ecd4] relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold text-[#3f6653] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-ping" />
                      <span>National Extension Audio Reader</span>
                    </span>
                    <p className="text-xs font-bold text-[#012d1d]">
                      Listen to instructions in <strong className="text-[#e0a000]">{selectedLanguage}</strong>
                    </p>
                  </div>

                  <button
                    onClick={handlePlayVoiceOver}
                    className="h-10 px-4 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-lg flex items-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isPlayingAudio ? 'pause' : 'volume_up'}
                    </span>
                    <span>{isPlayingAudio ? 'Pause Voice' : 'Play Audio'}</span>
                  </button>
                </div>

                {/* Progress bar visualizer */}
                {isPlayingAudio && (
                  <div className="mt-3.5 space-y-1.5">
                    <div className="w-full bg-[#c1ecd4] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#012d1d] h-full transition-all duration-300"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                    {/* Simulated Voice Waveform Bars */}
                    <div className="flex items-center gap-0.5 justify-center h-4 py-0.5">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-[#16a34a] rounded-full transition-all duration-300"
                          style={{
                            height: `${15 + Math.sin(audioProgress * 0.4 + i) * 12}px`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="p-2 bg-white rounded border border-[#c1ecd4] text-[10px] font-medium text-[#414844] italic">
                      "{audioPlaybackText}"
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Guideline List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                  <div className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#012d1d]">assignment</span>
                    <span>Core Task</span>
                  </div>
                  <p className="text-xs font-bold text-[#1a1c1c] leading-relaxed">
                    {currentAdvisory.task}
                  </p>
                </div>

                <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                  <div className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#e0a000]">grid_3x3</span>
                    <span>Spacing & Placement</span>
                  </div>
                  <p className="text-xs font-bold text-[#1a1c1c] leading-relaxed">
                    {currentAdvisory.spacing}
                  </p>
                </div>

                <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2 md:col-span-2">
                  <div className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#16a34a]">shopping_bag</span>
                    <span>Recommended Staged Inputs</span>
                  </div>
                  <p className="text-xs font-extrabold text-[#012d1d] leading-relaxed">
                    {currentAdvisory.inputs}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e2e2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#fcfcfc] -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="flex items-center gap-2 text-xs text-[#717973]">
                <span className="material-symbols-outlined text-[#012d1d]">verified_user</span>
                <span>Reviewed by Nigerian Seed Council & Ministry Agronomists</span>
              </div>
              <button
                onClick={() => setActiveTab('calculator')}
                className="text-xs font-extrabold text-[#012d1d] hover:underline flex items-center gap-1"
              >
                <span>Calculate inputs for my farm size</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. YIELD & INPUT CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#e2e2e2]">
            <div>
              <h3 className="font-heading font-extrabold text-base text-[#012d1d]">
                Smart Farming Input Calculator
              </h3>
              <p className="text-xs text-[#717973]">
                Enter your agricultural land area size to estimate seed rates, NPK/Urea fertilizers, and expected harvest output.
              </p>
            </div>

            {/* Toggle unit */}
            <div className="flex bg-[#f3f3f3] p-1 rounded-lg border border-[#c1c8c2]">
              {(['Hectares', 'Acres'] as const).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSizeUnit(unit)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    sizeUnit === unit ? 'bg-white text-[#012d1d] shadow-xs' : 'text-[#717973]'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Selection & Farm Slider */}
            <div className="space-y-4 bg-[#f9f9f9] p-5 rounded-xl border border-[#e2e2e2]">
              <div>
                <label className="block text-xs font-bold text-[#1a1c1c] mb-1.5">
                  Select Crop Category
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                  className="w-full h-11 px-3 bg-white border border-[#c1c8c2] rounded-xl text-xs font-bold text-[#1a1c1c] focus:outline-none focus:border-[#012d1d]"
                >
                  <option value="Maize">Maize 🌽</option>
                  <option value="Cassava">Cassava 🌿</option>
                  <option value="Rice">Rice 🌾</option>
                  <option value="Yam">Yam 🥔</option>
                  <option value="Soybeans">Soybeans 🌱</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#1a1c1c]">
                    Input Farm Size Area
                  </label>
                  <span className="text-xs font-black text-[#012d1d] bg-[#c1ecd4] px-2 py-0.5 rounded">
                    {farmSize} {sizeUnit}
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="range"
                    min="0.5"
                    max="15"
                    step="0.5"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#e2e2e2] rounded-lg appearance-none cursor-pointer accent-[#012d1d]"
                  />
                  <div className="flex justify-between text-[10px] text-[#717973] font-bold">
                    <span>0.5 {sizeUnit}</span>
                    <span>5.0 {sizeUnit}</span>
                    <span>10.0 {sizeUnit}</span>
                    <span>15.0 {sizeUnit}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 bg-[#e0a000]/10 rounded-lg border border-[#e0a000]/30 text-xs text-[#523700] flex gap-2">
                  <span className="material-symbols-outlined text-[18px]">info</span>
                  <p className="text-[11px] leading-relaxed">
                    Estimates are calculated using standard <strong>Federal Ministry Extension templates</strong> for sub-Saharan smallholders.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculations Outputs Results cards */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Output Seeds */}
              <div className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex items-start gap-3">
                <div className="p-3 rounded-lg bg-[#f0fdf4] text-[#16a34a]">
                  <span className="material-symbols-outlined text-[28px]">eco</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider block">
                    Estimated Seed Rate Needed
                  </span>
                  <div className="font-heading font-black text-2xl text-[#012d1d] mt-1">
                    {calculatedSeedsKg.toLocaleString()} {selectedCrop === 'Cassava' ? 'Stems' : selectedCrop === 'Yam' ? 'Setts' : 'Kg'}
                  </div>
                  <p className="text-[11px] text-[#717973] mt-1">
                    {selectedCrop === 'Maize' && 'Approx. Oba Super-6 hybrid seed bags'}
                    {selectedCrop === 'Cassava' && 'Certified virus-free stem cuttings bundle'}
                    {selectedCrop === 'Rice' && 'High viability nursery starter grains'}
                    {selectedCrop === 'Yam' && 'Seed tuber sets (250g-350g pieces)'}
                    {selectedCrop === 'Soybeans' && 'TGx rhizobium pre-coated beans'}
                  </p>
                </div>
              </div>

              {/* Output NPK */}
              <div className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex items-start gap-3">
                <div className="p-3 rounded-lg bg-[#fef3c7] text-[#d97706]">
                  <span className="material-symbols-outlined text-[28px]">compost</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider block">
                    Compound NPK Fertilizer
                  </span>
                  <div className="font-heading font-black text-2xl text-[#012d1d] mt-1">
                    {calculatedNpkBags} Bags <span className="text-xs font-normal text-[#717973]">(50kg ea)</span>
                  </div>
                  <p className="text-[11px] text-[#717973] mt-1">
                    Recommended application: {selectedCrop === 'Cassava' ? 'NPK 12-12-17' : 'NPK 15-15-15'} in ring pattern around stems.
                  </p>
                </div>
              </div>

              {/* Output Urea */}
              <div className="p-4 bg-white border border-[#c1c8c2] rounded-xl flex items-start gap-3">
                <div className="p-3 rounded-lg bg-[#ecfdf5] text-[#059669]">
                  <span className="material-symbols-outlined text-[28px]">science</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider block">
                    Nitrogen Top-Dressing (Urea)
                  </span>
                  <div className="font-heading font-black text-2xl text-[#012d1d] mt-1">
                    {calculatedUreaBags} Bags <span className="text-xs font-normal text-[#717973]">(50kg ea)</span>
                  </div>
                  <p className="text-[11px] text-[#717973] mt-1">
                    Apply at 6-8 weeks during active vegetative growth or panicle phase.
                  </p>
                </div>
              </div>

              {/* Output Expected Yield */}
              <div className="p-4 bg-[#012d1d] text-white rounded-xl flex items-start gap-3 shadow-md">
                <div className="p-3 rounded-lg bg-white/10 text-[#c1ecd4]">
                  <span className="material-symbols-outlined text-[28px]">inventory_2</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#86af99] uppercase tracking-wider block">
                    Expected Gross Harvest Output
                  </span>
                  <div className="font-heading font-black text-3xl text-[#c1ecd4] mt-1">
                    {expectedYieldMT} Metric Tons
                  </div>
                  <p className="text-[11px] text-[#86af99] mt-1">
                    Approx. {Math.round(parseFloat(expectedYieldMT) * 20)} standard 50kg bags.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SMART DIAGNOSTIC SCANNER TAB */}
      {activeTab === 'scanner' && (
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-6">
          <div className="pb-4 border-b border-[#e2e2e2]">
            <h3 className="font-heading font-extrabold text-base text-[#012d1d]">
              Interactive Crop Health Diagnostician
            </h3>
            <p className="text-xs text-[#717973]">
              Upload a snapshot of your crop foliage or leaf damage to simulate a rapid diagnostic analysis using the Ministry's national pest warning index.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Upload Scanner Panel */}
            <div className="border-2 border-dashed border-[#c1c8c2] rounded-xl p-6 text-center bg-[#fcfcfc] flex flex-col items-center justify-center space-y-4">
              {previewUrl ? (
                <div className="relative max-w-xs w-full rounded-lg overflow-hidden border border-[#c1c8c2] shadow-sm">
                  <img src={previewUrl} alt="Crop Scan Target" className="w-full aspect-[4/3] object-cover" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-[#012d1d]/40 flex flex-col justify-center items-center p-4">
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden max-w-[200px]">
                        <div
                          className="bg-[#c1ecd4] h-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase text-white tracking-widest mt-2 animate-pulse">
                        {scanStep}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-[64px] text-[#717973]">photo_camera</span>
                  <p className="text-xs font-bold text-[#1a1c1c]">Take photo or upload leaf image</p>
                  <p className="text-[10px] text-[#717973]">Supports JPG, PNG formats up to 5MB</p>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  id="diagnostics-upload"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  disabled={isScanning}
                />
                <label
                  htmlFor="diagnostics-upload"
                  className={`h-11 px-5 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#1b4332] cursor-pointer shadow-sm active:scale-95 transition-all ${
                    isScanning ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>{previewUrl ? 'Choose Another Photo' : 'Upload Plant Photo'}</span>
                </label>

                {previewUrl && !isScanning && (
                  <button
                    onClick={triggerAnalysis}
                    className="h-11 px-5 bg-[#e0a000] text-black font-heading font-bold text-xs rounded-full flex items-center gap-2 hover:bg-[#c99000] active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">biotech</span>
                    <span>Re-Run Diagnostics</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Diagnostic Reports Output */}
            <div className="space-y-4">
              {!previewUrl && !isScanning && (
                <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl min-h-[250px]">
                  <span className="material-symbols-outlined text-[40px] text-[#c1c8c2] mb-2">analytics</span>
                  <h4 className="font-heading font-bold text-sm text-[#717973]">No Active Analysis</h4>
                  <p className="text-[11px] text-[#717973] max-w-xs mt-1">
                    Select a target crop in the left dropdown and upload a leaf photo to trigger the real-time simulation model.
                  </p>
                </div>
              )}

              {isScanning && (
                <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl min-h-[250px] space-y-3">
                  <div className="w-10 h-10 rounded-full border-4 border-[#012d1d] border-t-transparent animate-spin" />
                  <h4 className="font-heading font-bold text-sm text-[#012d1d]">Running Diagnostics...</h4>
                  <p className="text-xs text-[#717973] max-w-xs italic animate-pulse">
                    "{scanStep}"
                  </p>
                </div>
              )}

              {scanResult.status && !isScanning && (
                <div className={`p-5 rounded-xl border space-y-4 ${
                  scanResult.status === 'infected'
                    ? 'bg-[#fff8f6] border-[#ffdad6]'
                    : 'bg-[#f2fcf6] border-[#c1ecd4]'
                }`}>
                  <div className="flex justify-between items-start pb-2.5 border-b border-black/10">
                    <div>
                      <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                        scanResult.status === 'infected' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#c1ecd4] text-[#002114]'
                      }`}>
                        {scanResult.status === 'infected' ? '⚠️ Infestation Detected' : '✅ Healthy Foliage'}
                      </span>
                      <h4 className="font-heading font-black text-base text-[#1a1c1c] mt-1.5">
                        {scanResult.pestName}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#717973] block font-semibold">Confidence</span>
                      <span className="font-heading font-black text-sm text-[#012d1d]">{scanResult.confidence}%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider block">
                      Diagnostic Symptoms
                    </span>
                    <p className="text-xs text-[#414844] leading-relaxed">
                      {scanResult.description}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-black/5 text-xs">
                    <span className="text-[10px] font-extrabold text-[#012d1d] uppercase tracking-wider block mb-1">
                      Recommended Mitigation Protocol
                    </span>
                    <p className="text-[#414844] font-medium leading-relaxed">
                      {scanResult.treatment}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[10px] text-[#717973] font-bold">
                    <span>Diagnostic Ref: DIAG-NG-{(Math.random() * 10000).toFixed(0)}</span>
                    <button
                      onClick={() => alert('Diagnostic Report logged to Ministry Registry successfully.')}
                      className="text-[#012d1d] hover:underline"
                    >
                      Report Outbreak to Cluster Officer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. REAL-TIME WHOLESALE GRAIN INDEX */}
      {activeTab === 'markets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market index listings */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#e2e2e2]">
              <div>
                <h3 className="font-heading font-bold text-base text-[#012d1d]">
                  National Grain Price benchmarks (Today)
                </h3>
                <p className="text-[11px] text-[#717973]">
                  Sourced from real wholesale trades at verified agricultural hub terminals.
                </p>
              </div>

              <span className="text-[9px] bg-[#c1ecd4] text-[#002114] font-extrabold px-2.5 py-1 rounded">
                VERIFIED DAILY INDEX
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {marketPrices.map((mp) => {
                const title = mp.cropTitle || mp.crop;
                const market = mp.marketName || `${mp.topState || 'Central'} Market`;
                const price = mp.currentPrice || mp.priceNaira || 0;
                const stateName = mp.state || mp.topState;
                const changeStr = mp.priceChange != null ? String(mp.priceChange) : (mp.changePercent >= 0 ? `+${mp.changePercent}%` : `${mp.changePercent}%`);
                const isPositive = changeStr.startsWith('+');

                return (
                  <div key={mp.id} className="p-3.5 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                    <div className="flex justify-between items-start font-bold text-xs">
                      <div>
                        <span className="text-sm text-[#012d1d]">{title}</span>
                        <span className="block text-[10px] text-[#717973] font-medium mt-0.5">{market}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-[#012d1d]">
                          ₦{price.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-[#717973] font-medium mt-0.5">/ {mp.unit}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-2 border-t border-[#e2e2e2]">
                      <span className="text-[#717973] font-medium">{stateName} State</span>
                      <span className={`font-extrabold flex items-center gap-0.5 ${
                        isPositive ? 'text-[#16a34a]' : 'text-[#ba1a1a]'
                      }`}>
                        <span className="material-symbols-outlined text-[12px]">
                          {isPositive ? 'trending_up' : 'trending_down'}
                        </span>
                        <span>{changeStr}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Harvest Cargo Value Calculator */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
            <h3 className="font-heading font-extrabold text-base text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#e0a000]">payments</span>
              <span>Cargo Value Estimator</span>
            </h3>
            <p className="text-xs text-[#717973]">
              Quickly estimate the commercial wholesale value of your produce before listing or transporting.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] font-extrabold text-[#717973] uppercase tracking-wider mb-1.5">
                  Produce Commodity
                </label>
                <select
                  value={cargoCrop}
                  onChange={(e) => setCargoCrop(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f9f9f9] border border-[#c1c8c2] rounded-xl text-xs font-bold text-[#1a1c1c] focus:outline-none focus:border-[#012d1d]"
                >
                  <option value="Maize">White Maize 🌽</option>
                  <option value="Sorghum">Brown Sorghum 🌾</option>
                  <option value="Soybeans">Soybeans 🌱</option>
                  <option value="Cassava">Cassava Root 🌿</option>
                  <option value="Paddy Rice">Paddy Rice 🌾</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-extrabold text-[#717973] uppercase tracking-wider">
                    Quantity (50kg Bags)
                  </label>
                  <span className="text-xs font-black text-[#012d1d]">{cargoWeight} Bags</span>
                </div>
                <input
                  type="number"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full h-10 px-3 border border-[#c1c8c2] rounded-xl text-xs font-bold text-[#1a1c1c] focus:outline-none focus:border-[#012d1d]"
                />
              </div>

              <div className="p-4 bg-[#f2fcf6] rounded-xl border border-[#c1ecd4] space-y-1">
                <span className="text-[10px] font-bold text-[#3f6653] uppercase tracking-wider block">
                  Estimated Gross Commodity Value
                </span>
                <div className="font-heading font-black text-2xl text-[#012d1d]">
                  ₦{cargoEstValue.toLocaleString()}
                </div>
                <p className="text-[10px] text-[#717973] font-medium">
                  Based on wholesale benchmark of ₦{activePriceValue.toLocaleString() || '24,000'} per {activeMarketPrice?.unit || 'bag'}.
                </p>
              </div>

              <button
                onClick={() => alert('Proceeding to market listing creator...')}
                className="w-full h-11 bg-[#012d1d] text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
              >
                <span>List Produce For Sale</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. BROADCASTS & CONTACTS */}
      {activeTab === 'broadcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radio Broadcast schedules */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">radio</span>
              <span>Federal Agricultural Radio & Extension Broadcasts</span>
            </h3>
            <p className="text-xs text-[#717973]">
              Daily agricultural advisory broadcasts scheduled across national and regional stations in multiple languages.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] bg-[#e0a000] text-black font-extrabold px-2 py-0.5 rounded">
                    HAUSA • 06:15 AM DAILY
                  </span>
                  <h4 className="font-heading font-bold text-sm text-[#012d1d] mt-1.5">
                    "Kasar Noma" Program on FRCN Kaduna
                  </h4>
                  <p className="text-xs text-[#717973] mt-0.5">
                    Wet-season fertilizer strategies and early armyworm spray warnings.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#012d1d] text-[24px]">play_circle</span>
              </div>

              <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] bg-[#34d399] text-black font-extrabold px-2 py-0.5 rounded">
                    YORUBA • 07:00 AM DAILY
                  </span>
                  <h4 className="font-heading font-bold text-sm text-[#012d1d] mt-1.5">
                    "Agbe Onise Oloyin" on Amuludun FM Ibadan
                  </h4>
                  <p className="text-xs text-[#717973] mt-0.5">
                    Post-harvest cassava handling and modern solar drying tips.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#012d1d] text-[24px]">play_circle</span>
              </div>

              <div className="p-4 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[9px] bg-[#60a5fa] text-black font-extrabold px-2 py-0.5 rounded">
                    PIGIDN / ENGLISH • 08:30 PM DAILY
                  </span>
                  <h4 className="font-heading font-bold text-sm text-[#012d1d] mt-1.5">
                    "Agro Connect" on Wazobia FM Abuja / Lagos
                  </h4>
                  <p className="text-xs text-[#717973] mt-0.5">
                    Credit facilities, digital wallet payouts, and off-take contracts.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#012d1d] text-[24px]">play_circle</span>
              </div>
            </div>
          </div>

          {/* Ministry Extension Officer Contacts */}
          <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#16a34a]">support_agent</span>
              <span>Cluster Extension Officers</span>
            </h3>
            <p className="text-xs text-[#717973]">
              Need direct assistance? Get in touch with the nearest FMFS field officers stationed in your agricultural cluster.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#012d1d] text-white font-heading font-extrabold text-xs flex items-center justify-center">
                    AU
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#012d1d]">Alhaji Umar Ibrahim</h4>
                    <span className="text-[10px] text-[#717973] font-semibold">Zone A Lead Agronomist</span>
                  </div>
                </div>
                <div className="flex gap-2 text-[10px] font-bold">
                  <a href="tel:+2348030000000" className="flex-1 h-8 bg-white border border-[#c1c8c2] rounded-lg flex items-center justify-center gap-1 hover:bg-[#e8e8e8]">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    <span>Call Officer</span>
                  </a>
                  <button onClick={() => alert('SMS request sent.')} className="flex-1 h-8 bg-[#012d1d] text-white rounded-lg flex items-center justify-center gap-1 hover:bg-[#1b4332]">
                    <span className="material-symbols-outlined text-[14px]">sms</span>
                    <span>Send SMS</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#012d1d] text-white font-heading font-extrabold text-xs flex items-center justify-center">
                    FA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#012d1d]">Mrs. Funmilayo Adebayo</h4>
                    <span className="text-[10px] text-[#717973] font-semibold">Soil & Fert Management Specialist</span>
                  </div>
                </div>
                <div className="flex gap-2 text-[10px] font-bold">
                  <a href="tel:+2348050000000" className="flex-1 h-8 bg-white border border-[#c1c8c2] rounded-lg flex items-center justify-center gap-1 hover:bg-[#e8e8e8]">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    <span>Call Officer</span>
                  </a>
                  <button onClick={() => alert('SMS request sent.')} className="flex-1 h-8 bg-[#012d1d] text-white rounded-lg flex items-center justify-center gap-1 hover:bg-[#1b4332]">
                    <span className="material-symbols-outlined text-[14px]">sms</span>
                    <span>Send SMS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Early Warning Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts index */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">warning</span>
            <span>Early Warning Pest & Disease outbreaks</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {pestAlerts.map((pa) => (
              <div key={pa.id} className="p-3.5 bg-[#fff8f6] border border-[#ffdad6] rounded-xl space-y-2">
                <div className="flex justify-between items-start font-bold text-xs text-[#ba1a1a]">
                  <div>
                    <span>{pa.title}</span>
                    <span className="block text-[10px] text-[#717973] font-medium mt-0.5">Crop: {pa.crop}</span>
                  </div>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#ffdad6] font-extrabold">
                    {pa.threatLevel || pa.severity}
                  </span>
                </div>
                <p className="text-[#414844] text-[11px] leading-snug">{pa.description}</p>
                <div className="p-2 bg-white rounded border border-[#ffdad6] text-[10px] font-semibold text-[#012d1d]">
                  Mitigation Action: {pa.preventionAdvice || 'Consult nearest extension hub immediately.'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extension Guides index */}
        <div className="bg-white rounded-2xl border border-[#c1c8c2] p-5 space-y-4">
          <h3 className="font-heading font-bold text-base text-[#012d1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>Federal Agronomy Guides</span>
          </h3>

          <div className="space-y-3.5">
            {extensionGuides.map((eg) => (
              <div key={eg.id} className="p-3 bg-[#f9f9f9] border border-[#e2e2e2] rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-heading font-bold text-xs text-[#012d1d] leading-snug">{eg.title}</h4>
                  <span className="text-[9px] font-bold bg-[#c1ecd4] text-[#002114] px-1.5 py-0.2 rounded shrink-0">
                    {eg.category}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-[#e2e2e2] text-[#717973]">
                  <span>Est. Read: {eg.readTime}</span>
                  <button className="font-bold text-[#012d1d] hover:underline flex items-center gap-0.5">
                    <span>Read</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
