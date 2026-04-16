import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Palette, 
  User, 
  Shirt, 
  MapPin, 
  RefreshCw,
  Crown,
  Star,
  Send
} from 'lucide-react';

const apiKey = process.env.REACT_APP_IMAGEN_KEY;

const App = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [status, setStatus] = useState("");

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I can see your look in the studio — loving the vibe so far. What are you going for today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const bottomRef = useRef(null);
  
  const [features, setFeatures] = useState({
    skinTone: 'Fair',
    eyeColor: 'Blue',
    hairColor: 'Platinum Blonde',
    hairStyle: 'Hollywood Waves'
  });
  
  const [makeup, setMakeup] = useState({
    lipstick: 'Soft Pink Gloss',
    eyeshadow: 'Champagne Shimmer',
    blush: 'Rosy Glow'
  });
  
  const [outfit, setOutfit] = useState({
    style: 'Glamour Gown',
    color: 'Hot Pink',
    shoes: 'Crystal Stilettos'
  });
  
  const [setting, setSetting] = useState('Malibu Dreamhouse');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getColor = (type, value) => {
    const map = {
      skin: { 'Fair': '#FFE0BD', 'Tan': '#D2B48C', 'Deep': '#5D4037', 'Sun-kissed': '#E0AC69', 'Cocoa': '#3E2723', 'Olive': '#C5AE91' },
      hair: { 'Platinum Blonde': '#FAF0BE', 'Golden Blonde': '#F5E6AD', 'Brunette': '#4B3621', 'Raven Black': '#000000', 'Auburn': '#A52A2A', 'Pastel Pink': '#FFD1DC', 'Lavender': '#E6E6FA' },
      outfit: { 'Hot Pink': '#FF69B4', 'Lavender': '#E6E6FA', 'Midnight Blue': '#191970', 'Emerald Green': '#50C878', 'Sparkling Gold': '#FFD700', 'Classic Black': '#000000', 'Neon Yellow': '#FFFF00' }
    };
    return map[type][value] || '#FF69B4';
  };

  const options = {
    features: {
      skinTone: ['Fair', 'Tan', 'Deep', 'Sun-kissed', 'Cocoa', 'Olive'],
      eyeColor: ['Blue', 'Green', 'Brown', 'Hazel', 'Violet', 'Amber'],
      hairColor: ['Platinum Blonde', 'Golden Blonde', 'Brunette', 'Raven Black', 'Auburn', 'Pastel Pink', 'Lavender'],
      hairStyle: ['Hollywood Waves', 'Sleek High Pony', 'Space Buns', 'Braided Crown', 'Afro Puff', 'Beachy Waves', 'Pixie Cut', '90s Blowout']
    },
    makeup: {
      lipstick: ['Soft Pink Gloss', 'Ruby Red Matte', 'Nude Silk', 'Glossy Peach', 'Bold Plum'],
      eyeshadow: ['Champagne Shimmer', 'Smokey Eye', 'Electric Blue', 'Golden Glitter', 'Rose Gold'],
      blush: ['Rosy Glow', 'Peachy Sheen', 'Soft Bronze', 'Radiant Berry']
    },
    outfits: {
      style: ['Glamour Gown', 'Career Power Suit', 'Casual Chic', 'Pop Star Sparkle', 'Ethereal Fairy', 'Vintage 1959 Swimsuit', 'Streetwear Hype'],
      color: ['Hot Pink', 'Lavender', 'Midnight Blue', 'Emerald Green', 'Sparkling Gold', 'Classic Black', 'Neon Yellow'],
      shoes: ['Crystal Stilettos', 'Chunky Sneakers', 'Knee-High Boots', 'Strappy Sandals', 'Classic Pumps', 'Platform Platforms']
    },
    settings: ['Malibu Dreamhouse', 'Parisian Runway', 'Enchanted Forest', 'Modern Workspace', 'Tropical Beach', 'Met Gala Red Carpet']
  };

  const generateRealisticBarbie = async () => {
    if (!apiKey) { setStatus("❌ Missing API Key!"); return; }
    
    setStatus("✨ Studio is preparing your 8K photo...");
    setIsGenerating(true);
    setGeneratedImage(null);

    const prompt = `A professional studio portrait of a hyper-realistic premium collector Barbie doll. ${features.skinTone} skin, ${features.eyeColor} eyes, ${features.hairStyle} in ${features.hairColor}. Wearing a ${outfit.color} ${outfit.style}. High-fashion photography.`;

    const modelsToTry = [
      'imagen-3.0-generate-001',
      'imagen-3.0-fast-001',
      'imagen-2.0-generate-001'
    ];

    let success = false;

    for (const modelName of modelsToTry) {
      if (success) break;
      try {
        setStatus(`✨ Trying AI Artist: ${modelName.split('-')[1]}...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            instances: [{ prompt }], 
            parameters: { sampleCount: 1 } 
          })
        });
        const result = await response.json();
        if (result.predictions && result.predictions[0]) {
          setGeneratedImage(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
          setStatus("");
          success = true;
        } else if (result.error && result.error.code === 403) {
          setStatus("❌ Permission Denied: Enable the 'Imagen' API in your Google Cloud Console.");
          break;
        }
      } catch (error) {
        console.error("Model failed: ", modelName);
      }
    }

    if (!success && !status.includes("❌")) {
      setStatus("❌ All AI Artists are busy. Check your AI Studio permissions!");
    }
    
    setIsGenerating(false);
  };

  const sendChatMessage = async (text) => {
    const userText = text || chatInput.trim();
    if (!userText) return;

    setChatInput('');
    setChatLoading(true);

    const newHistory = [...chatHistory, { role: 'user', content: userText }];
    setChatHistory(newHistory);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    const lookDesc = `${features.skinTone} skin, ${features.hairStyle} in ${features.hairColor}, ${features.eyeColor} eyes, ${makeup.lipstick} lips, wearing a ${outfit.color} ${outfit.style} with ${outfit.shoes}, setting: ${setting}.`;

    const systemPrompt = `You are Barbie — upbeat, warm, confident, and genuinely supportive. You love fashion, careers, adventure, and helping people feel their best. You speak in a fun, modern way — not over the top, just naturally enthusiastic. The user's current look: ${lookDesc}. Reference it when relevant. Keep replies to 2-3 sentences max. Never be preachy.`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Oops, my glam squad is on a break — try again!";
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Wi-Fi in the Dreamhouse is acting up — try again!" }]);
    }

    setChatLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] font-sans text-gray-800">
      <header className="bg-white border-b-4 border-[#FF69B4] p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF69B4] p-2 rounded-full shadow-lg">
            <Crown className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#FF69B4] tracking-tighter uppercase italic">
            Barbie <span className="text-pink-400">Super Studio</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
          <Sparkles className="text-pink-400 w-4 h-4" />
          <span className="text-pink-500 font-bold italic text-sm">Hi, Cara!</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Style Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col h-[700px]">
            <div className="grid grid-cols-4 bg-pink-50 p-2 gap-1">
              {[{ id: 'features', icon: User, label: 'Body' }, { id: 'glam', icon: Palette, label: 'Glam' }, { id: 'outfit', icon: Shirt, label: 'Closet' }, { id: 'setting', icon: MapPin, label: 'World' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 flex flex-col items-center gap-1 rounded-xl transition-all ${activeTab === tab.id ? 'bg-[#FF69B4] text-white shadow-md scale-105' : 'text-pink-400 hover:bg-pink-100'}`}>
                  <tab.icon size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'features' && (
                <div className="space-y-6">
                  {Object.entries(options.features).map(([key, vals]) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-xs font-black text-pink-500 uppercase tracking-widest mb-3">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {vals.map(val => (
                          <button key={val} onClick={() => setFeatures(prev => ({...prev, [key]: val}))} className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${features[key] === val ? 'border-[#FF69B4] bg-pink-50 text-[#FF69B4] shadow-sm' : 'border-gray-50 text-gray-400'}`}>{val}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'glam' && (
                <div className="space-y-6">
                  {Object.entries(options.makeup).map(([key, vals]) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-xs font-black text-pink-500 uppercase tracking-widest mb-3">{key}</label>
                      <div className="grid grid-cols-2 gap-2">
                        {vals.map(val => (
                          <button key={val} onClick={() => setMakeup(prev => ({...prev, [key]: val}))} className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all ${makeup[key] === val ? 'border-[#FF69B4] bg-pink-50 text-[#FF69B4]' : 'border-gray-50 text-gray-400'}`}>{val}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'outfit' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-black text-pink-500 uppercase tracking-widest mb-3">Outfit Color</label>
                    <div className="grid grid-cols-3 gap-2">
                      {options.outfits.color.map(val => (
                        <button key={val} onClick={() => setOutfit(prev => ({...prev, color: val}))} className={`px-2 py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${outfit.color === val ? 'border-[#FF69B4] bg-pink-50 text-[#FF69B4]' : 'border-gray-50 text-gray-400'}`}>{val}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-black text-pink-500 uppercase tracking-widest mb-3">Style</label>
                    {options.outfits.style.map(val => (
                      <button key={val} onClick={() => setOutfit(prev => ({...prev, style: val}))} className={`w-full px-4 py-3 rounded-xl border-2 text-left flex justify-between items-center transition-all ${outfit.style === val ? 'border-[#FF69B4] bg-pink-50 text-[#FF69B4]' : 'border-gray-50 text-gray-400'}`}>
                        <span className="font-bold text-sm">{val}</span>
                        {outfit.style === val && <Star className="fill-[#FF69B4] w-4 h-4 text-[#FF69B4]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'setting' && (
                <div className="space-y-4">
                  {options.settings.map(val => (
                    <button key={val} onClick={() => setSetting(val)} className={`w-full px-4 py-4 rounded-2xl border-2 text-left transition-all ${setting === val ? 'border-[#FF69B4] bg-pink-50 text-[#FF69B4] shadow-sm' : 'border-gray-50 text-gray-400'}`}>
                      <div className="flex items-center gap-3">
                        <MapPin size={18} />
                        <span className="font-black text-sm uppercase tracking-tight">{val}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-pink-50">
              {status && <div className={`mb-4 p-3 rounded-xl text-xs font-bold text-center ${status.includes('❌') ? 'bg-red-50 text-red-500' : 'bg-pink-50 text-pink-500 animate-pulse'}`}>{status}</div>}
              <button onClick={generateRealisticBarbie} disabled={isGenerating} className="w-full bg-[#FF69B4] hover:bg-[#FF1493] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95 disabled:bg-pink-200">
                <div className="flex items-center justify-center gap-3">
                  {isGenerating ? <><RefreshCw className="animate-spin" /> Designing...</> : <><Sparkles /> Render Realistic Barbie</>}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview + Chat */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Live Preview / Generated Image */}
          <div className="bg-white rounded-[40px] shadow-2xl p-4 md:p-8 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
            {generatedImage ? (
              <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                <img src={generatedImage} alt="Barbie" className="w-full max-w-lg rounded-[2.5rem] shadow-2xl border-[12px] border-white" />
                <p className="mt-6 text-[#FF69B4] font-black text-2xl uppercase italic tracking-tighter">Absolutely Iconic!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative w-36 h-[300px]">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <svg viewBox="0 0 200 600" className="w-full h-full transition-all duration-500">
                      <path d="M60 80 Q60 20 140 80 Q145 160 100 160 Q55 160 60 80" fill={getColor('hair', features.hairColor)} className="transition-all duration-500" />
                      <path d="M100 50 Q115 50 125 80 L135 180 Q145 280 115 380 L125 580 H75 L85 380 Q55 280 65 180 L75 80 Q85 50 100 50" fill={getColor('skin', features.skinTone)} className="transition-all duration-500" />
                      <circle cx="100" cy="80" r="38" fill={getColor('skin', features.skinTone)} className="transition-all duration-500" />
                      <path d="M80 180 L120 180 L150 500 H50 Z" fill={getColor('outfit', outfit.color)} opacity="0.8" className="transition-all duration-500" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-pink-500 uppercase tracking-tighter italic">Designing Your Icon</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    <b>{features.hairColor} hair</b> · <b>{outfit.color} {outfit.style}</b>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Barbie Companion Chat */}
          <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden" style={{ height: '380px' }}>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-pink-50 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#FF69B4] flex items-center justify-center text-white font-black text-sm flex-shrink-0">B</div>
              <div>
                <p className="font-black text-sm text-[#FF69B4]">Barbie</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <p className="text-xs text-gray-400">Your style bestie</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#FF69B4] flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-1">B</div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#FF69B4] text-white rounded-tr-sm'
                      : 'bg-pink-50 text-gray-700 border border-pink-100 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#FF69B4] flex items-center justify-center text-white text-xs font-black">B</div>
                  <div className="bg-pink-50 border border-pink-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies — only on first message */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
                {["Rate my look!", "Outfit advice?", "What's your dream job?"].map(q => (
                  <button key={q} onClick={() => sendChatMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-pink-200 text-pink-500 hover:bg-pink-50 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-pink-50 flex gap-2 flex-shrink-0">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                placeholder="Chat with Barbie..."
                className="flex-1 px-4 py-2 rounded-full border border-pink-100 text-sm outline-none focus:border-pink-300 bg-pink-50 text-gray-700"
              />
              <button
                onClick={() => sendChatMessage()}
                disabled={chatLoading || !chatInput.trim()}
                className="w-9 h-9 rounded-full bg-[#FF69B4] hover:bg-[#FF1493] disabled:bg-pink-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send size={14} color="white" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
