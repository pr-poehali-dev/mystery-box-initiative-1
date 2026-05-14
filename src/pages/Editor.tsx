import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

const CATEGORIES = ["Традиции", "Кухня", "Люди", "Места"];

interface Block {
  type: "text" | "heading" | "quote" | "image";
  value: string;
  caption?: string;
}

export default function Editor() {
  const { isAuthenticated, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [lead, setLead] = useState("");
  const [category, setCategory] = useState("Традиции");
  const [imageUrl, setImageUrl] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([{ type: "text", value: "" }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated, navigate]);

  const addBlock = (type: Block["type"]) => {
    setBlocks(b => [...b, { type, value: "", caption: "" }]);
  };

  const updateBlock = (i: number, field: keyof Block, value: string) => {
    setBlocks(b => b.map((bl, idx) => idx === i ? { ...bl, [field]: value } : bl));
  };

  const removeBlock = (i: number) => {
    setBlocks(b => b.filter((_, idx) => idx !== i));
  };

  const moveBlock = (i: number, dir: -1 | 1) => {
    const newBlocks = [...blocks];
    const target = i + dir;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[i], newBlocks[target]] = [newBlocks[target], newBlocks[i]];
    setBlocks(newBlocks);
  };

  const save = async (status: "draft" | "pending") => {
    if (!title.trim() || !accessToken) return;
    setSaving(true);
    const res = await fetch(`${API_URL}?action=publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ title, lead, category, image_url: imageUrl, content: blocks, status }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.slug) {
      setSaved(true);
      setTimeout(() => navigate("/profile"), 1000);
    }
  };

  const blockTypeLabel: Record<Block["type"], string> = {
    text: "Текст", heading: "Заголовок", quote: "Цитата", image: "Изображение"
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <JournalHeader />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors cursor-pointer">
            <Icon name="ArrowLeft" size={16} /> Назад
          </button>
          <div className="flex gap-2">
            <button onClick={() => save("draft")} disabled={saving || !title.trim()}
              className="px-4 py-2 rounded-full text-sm border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-40">
              Сохранить черновик
            </button>
            <button onClick={() => save("pending")} disabled={saving || !title.trim()}
              className="px-4 py-2 rounded-full text-sm bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {saved ? "✓ Отправлено!" : "Отправить на публикацию"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Рубрика</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${category === cat ? "bg-black text-white border-black" : "border-neutral-300 text-neutral-600 hover:border-neutral-500"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Заголовок *</label>
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Напишите заголовок статьи..."
              rows={2}
              className="w-full text-2xl font-bold border-0 outline-none resize-none placeholder:text-neutral-300 leading-tight"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Лид (вступление)</label>
            <textarea
              value={lead}
              onChange={e => setLead(e.target.value)}
              placeholder="Кратко о чём статья — 1-2 предложения..."
              rows={2}
              className="w-full text-base text-neutral-600 border-0 outline-none resize-none placeholder:text-neutral-300 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">URL обложки</label>
            <input
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors"
            />
            {imageUrl && <img src={imageUrl} alt="" className="mt-2 w-full h-40 object-cover rounded-lg" />}
          </div>

          <div className="border-t border-neutral-100 pt-6">
            <label className="text-xs uppercase tracking-widest text-neutral-400 mb-4 block">Содержание статьи</label>
            <div className="space-y-4">
              {blocks.map((block, i) => (
                <div key={i} className="group relative bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400">{blockTypeLabel[block.type]}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveBlock(i, -1)} className="p-1 hover:bg-neutral-200 rounded cursor-pointer"><Icon name="ChevronUp" size={14} /></button>
                      <button onClick={() => moveBlock(i, 1)} className="p-1 hover:bg-neutral-200 rounded cursor-pointer"><Icon name="ChevronDown" size={14} /></button>
                      <button onClick={() => removeBlock(i)} className="p-1 hover:bg-red-100 rounded cursor-pointer text-red-500"><Icon name="Trash2" size={14} /></button>
                    </div>
                  </div>

                  {block.type === "image" ? (
                    <div className="space-y-2">
                      <input value={block.value} onChange={e => updateBlock(i, "value", e.target.value)}
                        placeholder="URL изображения..."
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-neutral-400" />
                      <input value={block.caption || ""} onChange={e => updateBlock(i, "caption", e.target.value)}
                        placeholder="Подпись (необязательно)..."
                        className="w-full border border-neutral-200 rounded px-3 py-2 text-sm outline-none focus:border-neutral-400 text-neutral-500" />
                      {block.value && <img src={block.value} alt="" className="w-full h-32 object-cover rounded" />}
                    </div>
                  ) : (
                    <textarea
                      value={block.value}
                      onChange={e => updateBlock(i, "value", e.target.value)}
                      placeholder={block.type === "heading" ? "Заголовок раздела..." : block.type === "quote" ? "Цитата..." : "Текст абзаца..."}
                      rows={block.type === "text" ? 4 : 2}
                      className={`w-full border-0 outline-none resize-none bg-transparent placeholder:text-neutral-300 leading-relaxed ${
                        block.type === "heading" ? "text-xl font-bold" :
                        block.type === "quote" ? "text-lg italic text-neutral-600" : "text-base text-neutral-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {(["text", "heading", "quote", "image"] as Block["type"][]).map(type => (
                <button key={type} onClick={() => addBlock(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:text-black transition-colors cursor-pointer">
                  <Icon name="Plus" size={12} /> {blockTypeLabel[type]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}