import React, { useState, useRef } from 'react';
import {
  Home,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  Car,
  Download,
  Upload,
  Palette,
  Sparkles
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PropertyData {
  title: string;
  price: string;
  location: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  image: string | null;
  image2: string | null;
  image3: string | null;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  propertyType: 'venda' | 'locação';
}

const DEFAULT_DATA: PropertyData = {
  title: '',
  price: '',
  location: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  parking: '',
  image: null,
  image2: null,
  image3: null,
  logo: null,
  primaryColor: '#ffffff',
  secondaryColor: '#d4af37',
  textColor: '#1a1a1a',
  propertyType: 'venda',
};

const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, value, onChange }: any) => (
  <div className="flex flex-col gap-2 w-full group">
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-slate-900 transition-colors">
      {Icon && <Icon size={12} />} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-400 transition-all placeholder:text-slate-300 text-sm shadow-sm"
    />
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<PropertyData>(DEFAULT_DATA);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'image2' | 'image3' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `postimoveis-${data.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row overflow-hidden font-['Inter']">
      {/* Left Column: Light Form */}
      <div className="w-full md:w-1/2 lg:w-[500px] p-8 md:p-14 overflow-y-auto max-h-screen scrollbar-hide border-r border-slate-200 bg-white">
        <header className="mb-14 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
            <div className="p-3 bg-slate-900 rounded-[1.25rem] shadow-xl shadow-slate-200">
              <Sparkles className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight font-['Outfit'] text-slate-900">POSTIMOVEIS</h1>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">Gere materiais de venda premium com sofisticação e clareza.</p>
        </header>

        <section className="space-y-12">
          {/* Toggle Type */}
          <div className="space-y-5">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              Tipo de Negócio <div className="flex-1 h-px bg-slate-100" />
            </h2>
            <div className="flex p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setData(prev => ({ ...prev, propertyType: 'venda' }))}
                className={cn(
                  "flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300",
                  data.propertyType === 'venda' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Venda
              </button>
              <button
                onClick={() => setData(prev => ({ ...prev, propertyType: 'locação' }))}
                className={cn(
                  "flex-1 py-3.5 rounded-xl text-xs font-bold transition-all duration-300",
                  data.propertyType === 'locação' ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Locação
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              Informações <div className="flex-1 h-px bg-slate-100" />
            </h2>
            <InputField label="Título do Imóvel" name="title" placeholder="Ex: Casa Jardim Europa" value={data.title} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-5">
              <InputField label="Preço" name="price" placeholder="Ex: R$ 2.500.000" value={data.price} onChange={handleInputChange} />
              <InputField label="Metragem (m²)" name="area" type="number" placeholder="450" icon={Maximize2} value={data.area} onChange={handleInputChange} />
            </div>
            <InputField label="Localização" name="location" placeholder="Ex: Itaim Bibi, São Paulo" icon={MapPin} value={data.location} onChange={handleInputChange} />
          </div>

          <div className="space-y-8">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              Atributos <div className="flex-1 h-px bg-slate-100" />
            </h2>
            <div className="grid grid-cols-3 gap-5">
              <InputField label="Quartos" name="bedrooms" type="number" placeholder="4" icon={BedDouble} value={data.bedrooms} onChange={handleInputChange} />
              <InputField label="Banheiros" name="bathrooms" type="number" placeholder="6" icon={Bath} value={data.bathrooms} onChange={handleInputChange} />
              <InputField label="Vagas" name="parking" type="number" placeholder="4" icon={Car} value={data.parking} onChange={handleInputChange} />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              Mídia & Design <div className="flex-1 h-px bg-slate-100" />
            </h2>

            <div className="grid grid-cols-3 gap-5">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Foto 1</label>
                <div className="relative group cursor-pointer h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center transition-all hover:bg-slate-100">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {data.image ? (
                    <img src={data.image} alt="Preview" className="h-full w-full object-cover rounded-[1.4rem]" />
                  ) : (
                    <Upload className="text-slate-300" size={24} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Foto 2</label>
                <div className="relative group cursor-pointer h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center transition-all hover:bg-slate-100">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {data.image2 ? (
                    <img src={data.image2} alt="Preview" className="h-full w-full object-cover rounded-[1.4rem]" />
                  ) : (
                    <Upload className="text-slate-300" size={24} />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Foto 3</label>
                <div className="relative group cursor-pointer h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center transition-all hover:bg-slate-100">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image3')} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {data.image3 ? (
                    <img src={data.image3} alt="Preview" className="h-full w-full object-cover rounded-[1.4rem]" />
                  ) : (
                    <Upload className="text-slate-300" size={24} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Seu Logotipo</label>
              <div className="relative group cursor-pointer h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center transition-all hover:bg-slate-100">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                {data.logo ? (
                  <img src={data.logo} alt="Logo" className="h-full w-full object-contain p-4 rounded-[1.4rem]" />
                ) : (
                  <Upload className="text-slate-300" size={24} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} /> Fundo
                </label>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input type="color" name="primaryColor" value={data.primaryColor} onChange={handleInputChange} className="w-8 h-8 rounded-xl bg-transparent cursor-pointer border-none shadow-sm" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{data.primaryColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} /> Cor do Texto
                </label>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input type="color" name="textColor" value={data.textColor} onChange={handleInputChange} className="w-8 h-8 rounded-xl bg-transparent cursor-pointer border-none shadow-sm" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{data.textColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} /> Cor de Destaque
                </label>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <input type="color" name="secondaryColor" value={data.secondaryColor} onChange={handleInputChange} className="w-8 h-8 rounded-xl bg-transparent cursor-pointer border-none shadow-sm" />
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{data.secondaryColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={downloadImage}
            disabled={isExporting}
            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-slate-200 text-sm mt-10"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={20} />
            )}
            {isExporting ? 'Exportando...' : 'Baixar Lâmina em Alta Definição'}
          </button>

          <p className="text-center text-slate-300 text-xs font-medium">Design by POSTIMOVEIS • Premium Edition</p>
        </section>
      </div>

      {/* Right Column: High-End Preview */}
      <div className="flex-1 bg-slate-100/30 flex items-center justify-center p-8 md:p-14 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200 rounded-full blur-[120px] -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200 rounded-full blur-[120px] -ml-48 -mb-48 opacity-50" />

        <div className="relative w-full max-w-[600px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden border-[12px] border-white ring-1 ring-slate-100">
          {/* Card aspect-ratio 9:16 */}
          <div
            ref={cardRef}
            className="w-full aspect-[9/16] bg-slate-50 relative flex flex-col"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Image Section (Top 58%) */}
            <div className="h-[58%] w-full relative flex flex-col bg-slate-200">
              {/* Main Photo (Top 70% of image section) */}
              <div className="h-[75%] w-full relative overflow-hidden">
                {data.image ? (
                  <img src={data.image} alt="Property" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <Home className="text-slate-400" size={60} />
                  </div>
                )}
              </div>

              {/* Secondary Photos (Bottom 25% of image section) */}
              <div className="h-[25%] w-full flex border-t-2 border-white">
                <div className="flex-1 h-full border-r-2 border-white overflow-hidden relative">
                  {data.image2 ? (
                    <img src={data.image2} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Home className="text-slate-200" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 h-full overflow-hidden relative">
                  {data.image3 ? (
                    <img src={data.image3} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Home className="text-slate-200" size={24} />
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Type Badge */}
              <div className="absolute top-8 left-8 z-20">
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-xl border border-white/50">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.secondaryColor }} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-900/90">
                    {data.propertyType === 'venda' ? 'Venda Exclusiva' : 'Oportunidade de Locação'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section (Bottom 42%) */}
            <div
              className="h-[42%] w-full relative z-10 p-9 flex flex-col justify-between"
              style={{ backgroundColor: data.primaryColor, color: data.textColor }}
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: data.secondaryColor }} />
                  <h3 className="text-3xl font-extrabold leading-tight font-['Outfit'] tracking-tight" style={{ color: data.textColor }}>
                    {data.title || 'Incrível Mansão Moderna'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase opacity-60">
                    <MapPin size={16} /> {data.location || 'Localização Premium'}
                  </div>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-4 gap-4 pt-6 border-t" style={{ borderColor: `${data.textColor}20` }}>
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <Maximize2 size={24} />
                    <span className="text-xs font-bold">{data.area || '0'}m²</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <BedDouble size={24} />
                    <span className="text-xs font-bold">{data.bedrooms || '0'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <Bath size={24} />
                    <span className="text-xs font-bold">{data.bathrooms || '0'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 opacity-60">
                    <Car size={24} />
                    <span className="text-xs font-bold">{data.parking || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Footer Investment */}
              <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: `${data.textColor}20` }}>
                <div className="space-y-0">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Investimento</p>
                  <p className="text-2xl font-extrabold font-['Outfit'] tracking-tighter" style={{ color: data.textColor }}>
                    {data.price || 'Sob Consulta'}
                  </p>
                </div>

                {data.logo && (
                  <img src={data.logo} alt="Logo" className="h-24 w-auto object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
