import { useState, useEffect } from "react";
import { ConfigProvider, Select, Input, Button, Tag, Segmented } from "antd";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/Dashboard.css";
import {
  HelpCircle, ArrowRight, Check, Bold, Italic, Underline, List, ListOrdered,
  Link as LinkIcon, ChevronLeft, ChevronRight, Play, Lightbulb, X, Copy,
  Trash2, Save, Sparkles, FileStack, Wand2, BookOpen, PenTool, Plus,
} from "lucide-react";

/* ─── Types & Mock Data ────────────────────────────────────── */

interface Flashcard { id: number; question: string; answer: string; color: CardColor; }
type CardColor = "purple" | "green" | "yellow" | "red" | "blue" | "teal";
type EditTab = "manual" | "ai" | "batch";

const TOTAL_CARDS = 12;

const MOCK_CARDS: Flashcard[] = [
  { id: 1, question: "Cấu trúc dữ liệu là gì?", answer: "Cấu trúc dữ liệu là cách tổ chức, lưu trữ và quản lý dữ liệu để có thể sử dụng hiệu quả.", color: "purple" },
  ...Array.from({ length: TOTAL_CARDS - 1 }, (_, i) => ({
    id: i + 2, question: `Câu hỏi mẫu ${i + 2}`, answer: `Câu trả lời mẫu ${i + 2}.`, color: "green" as CardColor
  })),
];

const CARD_COLORS: { key: CardColor; bg: string }[] = [
  { key: "purple", bg: "bg-[#7856FF]" }, { key: "green", bg: "bg-[#10B981]" }, { key: "yellow", bg: "bg-[#F59E0B]" },
  { key: "red", bg: "bg-[#EF4444]" }, { key: "blue", bg: "bg-[#3B82F6]" }, { key: "teal", bg: "bg-[#14B8A6]" },
];

const GRADIENT_MAP: Record<CardColor, string> = {
  purple: "from-[#6366F1] to-[#A855F7]", green: "from-[#10B981] to-[#059669]",
  yellow: "from-[#F59E0B] to-[#D97706]", red: "from-[#EF4444] to-[#DC2626]",
  blue: "from-[#3B82F6] to-[#2563EB]", teal: "from-[#14B8A6] to-[#0D9488]",
};

const INITIAL_TAGS = [
  { label: "cấu trúc dữ liệu", color: "green" as const },
  { label: "lập trình", color: "blue" as const },
  { label: "cs", color: "purple" as const },
];

const TAG_COLORS = {
  green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
};

const INPUT_STYLE = { padding: "12px 16px", fontSize: 14, color: "#000000", lineHeight: 1.6 };

const antdTheme = {
  token: { colorPrimary: "#10b981", borderRadius: 6, colorText: "#000000", controlHeight: 40, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
};

/* ─── Components ───────────────────────────────────────────── */

function FieldLabel({ children, counter }: { children: React.ReactNode, counter?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="flex items-center gap-1.5 text-sm font-bold !text-black !leading-normal">
        {children} <HelpCircle size={14} className="text-gray-400"/>
      </label>
      {counter && <span className="text-xs font-semibold text-gray-500 !leading-normal">{counter}</span>}
    </div>
  );
}

function Stepper() {
  const steps = [
    { num: 1, label: "Chọn nguồn", text: "text-emerald-600", circle: "bg-emerald-100 text-emerald-600" },
    { num: 2, label: "AI xử lý", text: "text-blue-600", circle: "bg-blue-500 text-white" },
    { num: 3, label: "Chỉnh sửa thẻ", text: "text-purple-600", circle: "bg-purple-600 text-white" },
    { num: 4, label: "Lưu & Học", text: "text-amber-600", circle: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 shadow-sm px-6 py-4">
      {steps.map((step, idx) => (
        <div key={step.num} className="contents">
          {idx > 0 && <ArrowRight size={16} className="text-gray-300 shrink-0 hidden sm:block" />}
          <div className={`flex items-center gap-2 font-semibold text-sm shrink-0 ${step.text}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step.circle}`}>{step.num}</span>
            <span className="whitespace-nowrap hidden md:inline !leading-normal">{step.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function RichTextToolbar() {
  const tools = [
    { icon: Bold, label: "Bold" }, { icon: Italic, label: "Italic" }, { icon: Underline, label: "Underline" },
    { icon: List, label: "Bullet list" }, { icon: ListOrdered, label: "Numbered list" }, { icon: LinkIcon, label: "Link" },
  ];
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 px-3 py-1.5 bg-gray-50/80">
      {tools.map(({ icon: Icon, label }, i) => (
        <span key={label}>
          {i === 3 && <span className="inline-block w-px h-4 bg-gray-300 mx-1.5 align-middle" />}
          <button type="button" aria-label={label} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-700 transition-colors cursor-pointer border-none bg-transparent">
            <Icon size={15} />
          </button>
        </span>
      ))}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function CreateFlashcardPage() {
  const [activeTab, setActiveTab] = useState<EditTab>("manual");
  const [activeColor, setActiveColor] = useState<CardColor>("purple");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(MOCK_CARDS[0].question);
  const [currentAnswer, setCurrentAnswer] = useState(MOCK_CARDS[0].answer);
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [category, setCategory] = useState("cs");
  const [difficulty, setDifficulty] = useState("medium");
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const card = MOCK_CARDS[currentIndex];
    setCurrentQuestion(card.question);
    setCurrentAnswer(card.answer);
    setActiveColor(card.color);
  }, [currentIndex]);

  const cardShell = "bg-white rounded-lg border border-gray-200 shadow-sm";

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="page">
        <Header />
        <div className="dashboard">
          <Sidebar />
          <main className="main-content !p-6 lg:!p-8 !bg-[#F6F8FA] overflow-y-auto !pt-12 !pb-12">
           <div className="max-w-[1560px] mx-auto flex flex-col gap-6">
              
              {/* Header Page */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFF8E6] rounded-full flex items-center justify-center text-[#F59E0B] shrink-0"><Wand2 size={20} /></div>
                    <h1 className="text-[26px] font-extrabold !text-black !leading-none">Tạo Flashcard</h1>
                  </div>
                  <p className="text-sm text-gray-500 font-medium ml-[52px] mt-1.5 !leading-normal">Biến tài liệu thành những thẻ ghi nhớ thông minh</p>
                </div>
                <div className="flex gap-2 shrink-0 mt-1 sm:mt-0">
                  <Button className="!h-auto !py-2 !px-4 !rounded-md !font-bold !text-sm !bg-white !text-black !border-gray-300 flex items-center justify-center gap-1.5"><HelpCircle size={16} /> Hướng dẫn</Button>
                  <Button type="primary" className="!h-auto !py-2 !px-4 !rounded-md !font-bold !text-sm !bg-[#7856FF] hover:!bg-[#6845EE] !border-none flex items-center justify-center gap-1.5"><BookOpen size={16} /> Thư viện Flashcard</Button>
                </div>
              </div>

              {/* Stepper */}
              <div className="mb-10">
                 <Stepper />
              </div>

              {/* Grid Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 items-start">
                
                {/* ======== LEFT COLUMN ======== */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <section className={`${cardShell} p-6 sm:p-7 flex flex-col gap-5`}>
                    <h2 className="text-lg font-extrabold !text-black !leading-normal">3. Chỉnh sửa Flashcard</h2>
                    
                    <Segmented 
                      block 
                      className="p-1 bg-gray-50/80 rounded-lg border border-gray-100" 
                      value={activeTab} onChange={(val) => setActiveTab(val as EditTab)}
                      options={[
                        {label: <span className="flex items-center justify-center gap-1.5 py-1 text-sm font-semibold"><PenTool size={15}/> Chỉnh sửa thủ công</span>, value: "manual"}, 
                        {label: <span className="flex items-center justify-center gap-1.5 py-1 text-sm font-semibold"><Sparkles size={15}/> AI gợi ý</span>, value: "ai"}, 
                        {label: <span className="flex items-center justify-center gap-1.5 py-1 text-sm font-semibold"><FileStack size={15}/> Nhập hàng loạt</span>, value: "batch"}
                      ]} 
                    />

                    <div className="flex flex-col gap-6">
                      <div>
                        <FieldLabel counter={`${currentQuestion.length}/300`}>Câu hỏi (Mặt trước)</FieldLabel>
                        <Input.TextArea rows={2} className="!rounded-md !border-gray-300 !text-black" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} styles={{ textarea: INPUT_STYLE }} />
                      </div>

                      <div>
                        <FieldLabel counter={`${currentAnswer.length}/500`}>Câu trả lời (Mặt sau)</FieldLabel>
                        <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/20">
                          <RichTextToolbar />
                          <Input.TextArea rows={4} className="!border-none !rounded-none !text-black" value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)} styles={{ textarea: INPUT_STYLE }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <FieldLabel>Danh mục</FieldLabel>
                            <Select value={category} onChange={setCategory} className="w-full !rounded-md" options={[{value: "cs", label: <span className="flex items-center gap-2 font-medium !text-black"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Cấu trúc dữ liệu và giải thuật</span>}]} />
                         </div>
                         <div>
                            <FieldLabel>Độ khó</FieldLabel>
                            <Select value={difficulty} onChange={setDifficulty} className="w-full !rounded-md" options={[{value: "medium", label: <span className="font-medium !text-black">📊 Trung bình</span>}]} />
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                         <div>
                           <FieldLabel>Thẻ</FieldLabel>
                           <div className="flex flex-wrap gap-1.5 border border-gray-300 rounded-md p-2.5 min-h-[42px] items-center bg-white">
                             {tags.map(({ label, color }) => (
                               <Tag key={label} closable onClose={() => setTags(prev => prev.filter(t => t.label !== label))} className={`!m-0 !px-2 !py-0.5 !rounded-md !text-xs !font-bold !border ${TAG_COLORS[color]}`}>{label}</Tag>
                             ))}
                           </div>
                         </div>
                         <div>
                           <FieldLabel>Màu sắc thẻ</FieldLabel>
                           <div className="flex gap-2.5 pt-1 h-[42px] items-center">
                             {CARD_COLORS.map(({ key, bg }) => (
                               <button key={key} type="button" aria-label={`Color ${key}`} onClick={() => setActiveColor(key)} className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${bg} ${activeColor === key ? "ring-2 ring-offset-1 ring-gray-400" : "opacity-80 hover:opacity-100"}`}>
                                 {activeColor === key && <Check size={12} className="text-white" />}
                               </button>
                             ))}
                           </div>
                         </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-1">
                        <Button className="!h-auto !py-2 !px-4 !rounded-md !font-bold !text-sm !bg-white !text-black !border-gray-300 flex items-center justify-center gap-1.5"><Plus size={16}/> Thêm thẻ mới</Button>
                        <Button type="primary" className="!h-auto !py-2 !px-6 !rounded-md !font-bold !text-sm !bg-[#10b981] hover:!bg-[#059669] !border-none flex items-center justify-center gap-1.5"><Save size={16}/> Lưu thẻ</Button>
                      </div>
                    </div>
                  </section>
                  
                  <div className="flex justify-between items-center px-2">
                    <span className="font-extrabold !text-black text-[15px]">Tổng số thẻ: {TOTAL_CARDS} thẻ</span>
                    <Button type="text" aria-label="Xóa tất cả" className="!text-gray-600 hover:!text-red-500 !font-bold flex items-center gap-1.5 text-[15px] !px-2 !py-1 !h-auto">
                      <Trash2 size={18}/> Xóa tất cả
                    </Button>
                  </div>
                </div>

                {/* ======== RIGHT COLUMN (SỬA LỖI BÓP THẺ) ======== */}
                <section className={`lg:col-span-5 ${cardShell} p-8 flex flex-col gap-6 min-w-[380px]`}>
                   <h2 className="text-xl font-extrabold !text-black">Xem trước Flashcard</h2>
                   
                   {/* Dùng flex-1 bọc ngoài thẻ vuông để chống flexbox bóp dẹt */}
                   <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
                      <button type="button" aria-label="Thẻ trước" onClick={() => setCurrentIndex((p) => (p - 1 + TOTAL_CARDS) % TOTAL_CARDS)} className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:text-purple-600 transition-colors"><ChevronLeft size={20}/></button>
                      
                      <div className="flex-1 flex justify-center w-full">
                        <div className={`w-full max-w-[340px] aspect-square bg-gradient-to-br ${GRADIENT_MAP[activeColor]} rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col justify-between relative`}>
                          <div className="flex justify-between text-xs font-semibold opacity-90 !leading-normal">
                            <span>Câu hỏi</span>
                            <span>{currentIndex + 1} / {TOTAL_CARDS}</span>
                          </div>
                          
                          <div className="flex-1 flex items-center justify-center px-2">
                            <p className="font-bold text-xl sm:text-2xl text-center leading-snug break-words !leading-normal">
                              {currentQuestion || "Nhập câu hỏi..."}
                            </p>
                          </div>
                          
                          <div className="relative w-full">
                            <div className="w-full h-px bg-white/25 mb-3" />
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1 !leading-normal">Câu trả lời</p>
                            <p className="text-sm font-medium leading-relaxed line-clamp-3 opacity-95 break-words !leading-normal pr-8">
                              {currentAnswer || "Nhập câu trả lời..."}
                            </p>
                            <button type="button" aria-label="Sao chép thẻ" className="absolute bottom-0 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors cursor-pointer"><Copy size={16} /></button>
                          </div>
                        </div>
                      </div>

                      <button type="button" aria-label="Thẻ sau" onClick={() => setCurrentIndex((p) => (p + 1) % TOTAL_CARDS)} className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:text-purple-600 transition-colors"><ChevronRight size={20}/></button>
                   </div>
                   
                   <div className="flex justify-center items-center gap-2 flex-wrap w-full mt-2">
                      {Array.from({length: 8}).map((_, i) => (
                        <button key={i} type="button" aria-label={`Đi đến thẻ ${i+1}`} onClick={() => setCurrentIndex(i)} className={`w-2.5 h-2.5 rounded-full cursor-pointer border-none p-0 transition-colors ${i === currentIndex ? 'bg-purple-600' : 'bg-gray-200 hover:bg-gray-300'}`}></button>
                      ))}
                   </div>
                   
                   <Button block className="!h-11 !rounded-md !font-bold !text-[15px] !text-black !border-gray-300 flex items-center justify-center gap-1.5 !leading-normal mt-2">
                     <Play size={18} /> Xem chế độ học thử
                   </Button>

                   {showTip && (
                     <div className="bg-purple-50/80 border border-purple-100 rounded-lg p-4 relative mt-2">
                        <button type="button" aria-label="Đóng mẹo" onClick={() => setShowTip(false)} className="absolute top-3 right-3 text-purple-300 hover:text-purple-600 bg-transparent border-none cursor-pointer p-0"><X size={16} /></button>
                        <div className="flex items-center gap-1.5 text-purple-700 font-bold text-sm mb-1.5 !leading-normal"><Lightbulb size={16} /> Mẹo hay</div>
                        <p className="text-sm text-gray-700 leading-relaxed pr-8 font-medium">Sử dụng câu hỏi ngắn gọn, rõ ràng và câu trả lời súc tích để giúp ghi nhớ hiệu quả hơn!</p>
                     </div>
                   )}
                </section>

              </div>
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}