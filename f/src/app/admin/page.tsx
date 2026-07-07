"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  Save,
  Trash2,
  User,
  Briefcase,
  Code,
  FolderKanban,
  Languages,
  Settings,
  Link2,
  Mail,
  Send,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { api, type ContentResponse, type ContactMessage, getUserRoles } from "@/lib/api";
import { TRANSLATION_LABELS } from "@/lib/translation-utils";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { useCVStore } from "@/stores/cv-store";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { ImageUpload } from "@/components/admin/image-upload";
import { resolveProjectImages } from "@/lib/project-images";

type Tab =
  | "personal"
  | "social"
  | "experience"
  | "skills"
  | "projects"
  | "translations"
  | "settings"
  | "seo"
  | "messages";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "personal", label: "Shaxsiy", icon: <User className="size-4" /> },
  { id: "social", label: "Ijtimoiy", icon: <Link2 className="size-4" /> },
  { id: "experience", label: "Tajriba", icon: <Briefcase className="size-4" /> },
  { id: "skills", label: "Ko'nikmalar", icon: <Code className="size-4" /> },
  { id: "projects", label: "Loyihalar", icon: <FolderKanban className="size-4" /> },
  { id: "translations", label: "UI matnlar", icon: <Languages className="size-4" /> },
  { id: "messages", label: "Xabarlar", icon: <Mail className="size-4" /> },
  { id: "seo", label: "SEO", icon: <Search className="size-4" /> },
  { id: "settings", label: "Sayt", icon: <Settings className="size-4" /> },
];

export default function AdminPage() {
  const router = useRouter();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const refreshCVData = useCVStore((s) => s.refreshCVData);

  const [tab, setTab] = useState<Tab>("personal");
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminContent();
      setContent(data);
    } catch {
      setError("Ma'lumotlarni yuklab bo'lmadi. Backend ishlayaptimi?");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    setMessagesLoading(true);
    setError(null);
    try {
      const messages = await api.getContactMessages();
      setContactMessages(messages);
    } catch {
      setError("Xabarlarni yuklab bo'lmadi.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth().then(() => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser || !getUserRoles(currentUser).includes("admin")) {
        router.replace("/");
      }
    });
  }, [checkAuth, router]);

  useEffect(() => {
    if (user && getUserRoles(user).includes("admin") && tab !== "messages") {
      loadContent();
    }
  }, [user, tab, loadContent]);

  useEffect(() => {
    if (user && getUserRoles(user).includes("admin") && tab === "messages") {
      loadMessages();
    }
  }, [user, tab, loadMessages]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async (fn: () => Promise<void>) => {
    setSaving(true);
    setError(null);
    try {
      await fn();
      await loadContent();
      await refreshCVData();
      showMessage("Saqlandi!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Saqlashda xato");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user || !getUserRoles(user).includes("admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Tekshirilmoqda...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" />
            Chiqish
          </Button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.id}
            variant={tab === t.id ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t.id)}
          >
            {t.icon}
            {t.label}
          </Button>
        ))}
      </div>

      {tab === "messages" ? (
        <ContactMessagesTab
          messages={contactMessages}
          loading={messagesLoading}
          saving={saving}
          onDelete={(id) =>
            handleSave(async () => {
              await api.deleteContactMessage(id);
              await loadMessages();
            })
          }
          onSendEmail={(data) =>
            handleSave(() => api.sendContactEmail(data))
          }
          onRefresh={loadMessages}
        />
      ) : loading || !content ? (
        <p className="text-muted-foreground">Yuklanmoqda...</p>
      ) : (
        <>
          {tab === "personal" && (
            <PersonalTab
              content={content}
              saving={saving}
              onSave={(data) =>
                handleSave(() => api.updatePersonal(data))
              }
            />
          )}
          {tab === "social" && (
            <SocialTab
              content={content}
              saving={saving}
              onRefresh={loadContent}
              onSave={handleSave}
            />
          )}
          {tab === "experience" && (
            <ExperienceTab
              content={content}
              saving={saving}
              onRefresh={loadContent}
              onSave={handleSave}
            />
          )}
          {tab === "skills" && (
            <SkillsTab
              content={content}
              saving={saving}
              onRefresh={loadContent}
              onSave={handleSave}
            />
          )}
          {tab === "projects" && (
            <ProjectsTab
              content={content}
              saving={saving}
              onRefresh={loadContent}
              onSave={handleSave}
            />
          )}
          {tab === "translations" && (
            <TranslationsTab
              content={content}
              saving={saving}
              onSave={(translations) =>
                handleSave(() => api.updateTranslations(translations))
              }
            />
          )}
          {tab === "settings" && (
            <SettingsTab
              content={content}
              saving={saving}
              onSave={(data) => handleSave(() => api.updateSiteSettings(data))}
            />
          )}
          {tab === "seo" && (
            <SeoTab
              content={content}
              saving={saving}
              onSave={(data) => handleSave(() => api.updateSeoSettings(data))}
            />
          )}
        </>
      )}
    </div>
  );
}

function ContactMessagesTab({
  messages,
  loading,
  saving,
  onDelete,
  onRefresh,
  onSendEmail,
}: {
  messages: ContactMessage[];
  loading: boolean;
  saving: boolean;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onSendEmail: (data: { to: string; subject: string; message: string }) => Promise<void>;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const resetCompose = () => {
    setExpandedId(null);
    setSubject("");
    setMessage("");
  };

  const handleToggleCompose = (msg: ContactMessage) => {
    if (expandedId === msg.id) {
      resetCompose();
      return;
    }

    setExpandedId(msg.id);
    setSubject("Javob: xabaringiz haqida");
    setMessage("");
  };

  const handleSend = async (to: string) => {
    await onSendEmail({ to, subject, message });
    resetCompose();
  };

  if (loading) {
    return <p className="text-muted-foreground">Xabarlar yuklanmoqda...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Jami: {messages.length} ta xabar
        </p>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          Yangilash
        </Button>
      </div>

      {messages.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Hali hech kim yozmagan
        </Card>
      ) : (
        messages.map((msg) => (
          <Card key={msg.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Google akkaunt</p>
                  <a
                    href={`mailto:${msg.googleAccount}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {msg.googleAccount}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Maqsad</p>
                  <p className="whitespace-pre-wrap text-sm">{msg.purpose}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString("uz-UZ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => handleToggleCompose(msg)}
                >
                  <Mail className="size-4" />
                  Email yuborish
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={saving}
                  onClick={() => onDelete(msg.id)}
                >
                  <Trash2 className="size-4" />
                  O'chirish
                </Button>
              </div>
            </div>

            {expandedId === msg.id && (
              <div className="mt-5 space-y-4 border-t pt-5">
                <div className="space-y-2">
                  <Label htmlFor={`subject-${msg.id}`}>Mavzu</Label>
                  <Input
                    id={`subject-${msg.id}`}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Email mavzusi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`message-${msg.id}`}>Xabar</Label>
                  <Textarea
                    id={`message-${msg.id}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Email matnini yozing..."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={saving || !subject.trim() || !message.trim()}
                    onClick={() => handleSend(msg.googleAccount)}
                  >
                    <Send className="size-4" />
                    Yuborish
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetCompose}>
                    Bekor qilish
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

function PersonalTab({
  content,
  saving,
  onSave,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (data: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    avatar?: string;
    gallery?: string[];
    bio: string;
    aboutDetails?: string[];
    highlights?: { label: string; value: string }[];
    interests?: string[];
  }) => void;
}) {
  const [form, setForm] = useState(content.cv.personal);

  useEffect(() => {
    setForm(content.cv.personal);
  }, [content]);

  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            name: form.name,
            title: form.title,
            email: form.email,
            phone: form.phone,
            location: form.location,
            avatar: form.avatar?.trim() || undefined,
            gallery: form.gallery,
            bio: form.bio,
            aboutDetails: form.aboutDetails,
            highlights: form.highlights,
            interests: form.interests,
          });
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <Field label="Ism" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Lavozim" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
        <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Telefon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Manzil" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <div className="md:col-span-2">
          <ImageUpload
            label="Avatar"
            value={form.avatar}
            onChange={(avatar) => setForm({ ...form, avatar })}
            disabled={saving}
            hint="Kompyuterdan avatar rasmini tanlang"
          />
        </div>
        <div className="md:col-span-2">
          <GalleryUpload
            images={form.gallery ?? []}
            onChange={(gallery) => setForm({ ...form, gallery })}
            disabled={saving}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Asosiy bio (qisqa kirish)</Label>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>
            O&apos;zingiz haqingizda batafsil (har bo&apos;sh qator — yangi paragraf)
          </Label>
          <Textarea
            value={(form.aboutDetails ?? []).join("\n\n")}
            onChange={(e) =>
              setForm({
                ...form,
                aboutDetails: e.target.value
                  .split(/\n\s*\n/)
                  .map((part) => part.trim())
                  .filter(Boolean),
              })
            }
            rows={12}
            placeholder="Tajribangiz, qiziqishlaringiz, ishlash uslubingiz va boshqa shaxsiy ma'lumotlaringizni yozing.&#10;&#10;Har bir bo'limni bo'sh qator bilan ajrating."
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving}>
            <Save className="size-4" />
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SocialTab({
  content,
  saving,
  onSave,
  onRefresh,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (fn: () => Promise<void>) => void;
  onRefresh: () => void;
}) {
  const [items, setItems] = useState(content.cv.personal.social);
  const [newItem, setNewItem] = useState({ platform: "", url: "", icon: "" });

  useEffect(() => {
    setItems(content.cv.personal.social);
  }, [content]);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Platform" value={item.platform} onChange={(v) => setItems(items.map((i) => i.id === item.id ? { ...i, platform: v } : i))} />
            <Field label="URL" value={item.url} onChange={(v) => setItems(items.map((i) => i.id === item.id ? { ...i, url: v } : i))} />
            <Field label="Icon" value={item.icon} onChange={(v) => setItems(items.map((i) => i.id === item.id ? { ...i, icon: v } : i))} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              disabled={saving}
              onClick={() =>
                onSave(() =>
                  api.updateSocialLink(item.id, {
                    platform: items.find((i) => i.id === item.id)!.platform,
                    url: items.find((i) => i.id === item.id)!.url,
                    icon: items.find((i) => i.id === item.id)!.icon,
                  }),
                )
              }
            >
              <Save className="size-4" /> Saqlash
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={saving}
              onClick={() =>
                onSave(async () => {
                  await api.deleteSocialLink(item.id);
                  onRefresh();
                })
              }
            >
              <Trash2 className="size-4" /> O'chirish
            </Button>
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <h3 className="mb-3 font-medium">Yangi qo'shish</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Platform" value={newItem.platform} onChange={(v) => setNewItem({ ...newItem, platform: v })} />
          <Field label="URL" value={newItem.url} onChange={(v) => setNewItem({ ...newItem, url: v })} />
          <Field label="Icon" value={newItem.icon} onChange={(v) => setNewItem({ ...newItem, icon: v })} />
        </div>
        <Button
          className="mt-3"
          size="sm"
          disabled={saving || !newItem.platform}
          onClick={() =>
            onSave(async () => {
              await api.createSocialLink(newItem);
              setNewItem({ platform: "", url: "", icon: "" });
              onRefresh();
            })
          }
        >
          <Plus className="size-4" /> Qo'shish
        </Button>
      </Card>
    </div>
  );
}

function ExperienceTab({
  content,
  saving,
  onSave,
  onRefresh,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (fn: () => Promise<void>) => void;
  onRefresh: () => void;
}) {
  return (
    <CrudList
      items={content.cv.experiences}
      saving={saving}
      emptyLabel="Tajriba yo'q"
      renderFields={(item, setItem) => (
        <>
          <Field label="Kompaniya" value={item.company} onChange={(v) => setItem({ ...item, company: v })} />
          <Field label="Lavozim" value={item.role} onChange={(v) => setItem({ ...item, role: v })} />
          <Field label="Davr" value={item.period} onChange={(v) => setItem({ ...item, period: v })} />
          <Field label="Texnologiyalar (vergul bilan)" value={item.technologies.join(", ")} onChange={(v) => setItem({ ...item, technologies: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <div className="md:col-span-2 space-y-2">
            <Label>Tavsif</Label>
            <Textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} rows={3} />
          </div>
        </>
      )}
      onUpdate={(item) =>
        onSave(() =>
          api.updateExperience(item.id, {
            company: item.company,
            role: item.role,
            period: item.period,
            description: item.description,
            technologies: item.technologies,
          }),
        )
      }
      onDelete={(id) =>
        onSave(async () => {
          await api.deleteExperience(id);
          onRefresh();
        })
      }
      onCreate={(item) =>
        onSave(async () => {
          await api.createExperience(item);
          onRefresh();
        })
      }
      newItemDefaults={{
        company: "",
        role: "",
        period: "",
        description: "",
        technologies: [] as string[],
      }}
    />
  );
}

function SkillsTab({
  content,
  saving,
  onSave,
  onRefresh,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (fn: () => Promise<void>) => void;
  onRefresh: () => void;
}) {
  return (
    <CrudList
      items={content.cv.skills}
      saving={saving}
      emptyLabel="Ko'nikma yo'q"
      renderFields={(item, setItem) => (
        <>
          <Field label="Nomi" value={item.name} onChange={(v) => setItem({ ...item, name: v })} />
          <div className="space-y-2">
            <Label>Kategoriya</Label>
            <select
              value={item.category}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
              className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field label="Daraja (0-100)" value={String(item.level)} onChange={(v) => setItem({ ...item, level: Number(v) || 0 })} />
        </>
      )}
      onUpdate={(item) =>
        onSave(() =>
          api.updateSkill(item.id, {
            name: item.name,
            category: item.category,
            level: item.level,
          }),
        )
      }
      onDelete={(id) =>
        onSave(async () => {
          await api.deleteSkill(id);
          onRefresh();
        })
      }
      onCreate={(item) =>
        onSave(async () => {
          await api.createSkill(item);
          onRefresh();
        })
      }
      newItemDefaults={{ name: "", category: "frontend", level: 50 }}
    />
  );
}

function ProjectsTab({
  content,
  saving,
  onSave,
  onRefresh,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (fn: () => Promise<void>) => void;
  onRefresh: () => void;
}) {
  return (
    <CrudList
      items={content.cv.projects}
      saving={saving}
      emptyLabel="Loyiha yo'q"
      renderFields={(item, setItem) => (
        <>
          <Field label="Sarlavha" value={item.title} onChange={(v) => setItem({ ...item, title: v })} />
          <div className="md:col-span-2">
            <GalleryUpload
              label="Loyiha rasmlari"
              hint="Bir nechta rasm yuklashingiz mumkin · birinchi rasm kartada ko'rinadi"
              previewAspectClassName="aspect-[16/10]"
              images={resolveProjectImages(item)}
              onChange={(images) =>
                setItem({
                  ...item,
                  images,
                  image: images[0],
                })
              }
              disabled={saving}
            />
          </div>
          <Field label="Live URL" value={item.liveUrl ?? ""} onChange={(v) => setItem({ ...item, liveUrl: v })} />
          <Field label="Repo URL" value={item.repoUrl ?? ""} onChange={(v) => setItem({ ...item, repoUrl: v })} />
          <Field label="Texnologiyalar" value={item.technologies.join(", ")} onChange={(v) => setItem({ ...item, technologies: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
          <div className="md:col-span-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5">
            <input
              id={`pin-${item.id}`}
              type="checkbox"
              checked={Boolean(item.isPinned)}
              onChange={(e) => setItem({ ...item, isPinned: e.target.checked })}
              className="size-4 rounded border-border"
            />
            <Label htmlFor={`pin-${item.id}`} className="cursor-pointer text-sm font-normal">
              Pin — taklif bannerida ko&apos;rsatish (2 ta loyiha ko&apos;rilgandan keyin)
            </Label>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Tavsif</Label>
            <Textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} rows={3} />
          </div>
        </>
      )}
      onUpdate={(item) =>
        onSave(() =>
          api.updateProject(item.id, {
            title: item.title,
            description: item.description,
            image: item.images?.[0] ?? item.image,
            images: resolveProjectImages(item),
            technologies: item.technologies,
            liveUrl: item.liveUrl,
            repoUrl: item.repoUrl,
            isPinned: Boolean(item.isPinned),
          }),
        )
      }
      onDelete={(id) =>
        onSave(async () => {
          await api.deleteProject(id);
          onRefresh();
        })
      }
      onCreate={(item) =>
        onSave(async () => {
          await api.createProject(item);
          onRefresh();
        })
      }
      newItemDefaults={{
        title: "",
        description: "",
        technologies: [] as string[],
        images: [] as string[],
        image: undefined,
        liveUrl: "",
        repoUrl: "",
        isPinned: false,
      }}
    />
  );
}

function TranslationsTab({
  content,
  saving,
  onSave,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (translations: Record<string, string>) => void;
}) {
  const [translations, setTranslations] = useState(content.translations);

  useEffect(() => {
    setTranslations(content.translations);
  }, [content]);

  const keys = Object.keys(TRANSLATION_LABELS);

  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(translations);
        }}
        className="space-y-4"
      >
        {keys.map((key) => (
          <div key={key} className="space-y-1">
            <Label>{TRANSLATION_LABELS[key] ?? key}</Label>
            <Input
              value={translations[key] ?? ""}
              onChange={(e) =>
                setTranslations({ ...translations, [key]: e.target.value })
              }
            />
          </div>
        ))}
        <Button type="submit" disabled={saving}>
          <Save className="size-4" />
          {saving ? "Saqlanmoqda..." : "Barchasini saqlash"}
        </Button>
      </form>
    </Card>
  );
}

function SettingsTab({
  content,
  saving,
  onSave,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (data: { name: string; description: string; url: string }) => void;
}) {
  const [form, setForm] = useState(content.siteSettings);

  useEffect(() => {
    setForm(content.siteSettings);
  }, [content]);

  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="grid max-w-lg gap-4"
      >
        <Field label="Sayt nomi" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Tavsif" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <Field label="URL" value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
        <Button type="submit" disabled={saving}>
          <Save className="size-4" />
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </form>
    </Card>
  );
}

const EMPTY_SEO: ContentResponse["seoSettings"] = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  hiddenContent: "",
  twitterHandle: "",
};

function SeoTab({
  content,
  saving,
  onSave,
}: {
  content: ContentResponse;
  saving: boolean;
  onSave: (data: ContentResponse["seoSettings"]) => void;
}) {
  const [form, setForm] = useState(content.seoSettings ?? EMPTY_SEO);

  useEffect(() => {
    setForm(content.seoSettings ?? EMPTY_SEO);
  }, [content]);

  return (
    <Card className="p-6">
      <div className="mb-6 max-w-2xl space-y-2">
        <h2 className="text-lg font-semibold">SEO sozlamalari</h2>
        <p className="text-sm text-muted-foreground">
          Bu matnlar saytda ko&apos;rinmaydi. Faqat Google, Telegram, LinkedIn va
          boshqa qidiruv tizimlari uchun ishlatiladi.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="grid max-w-2xl gap-5"
      >
        <Field
          label="Google sarlavhasi (title)"
          value={form.metaTitle}
          onChange={(v) => setForm({ ...form, metaTitle: v })}
          placeholder="Islom Anvarov — Full Stack Developer | Toshkent"
          hint="Qidiruv natijasidagi ko'k sarlavha. Bo'sh qoldirsangiz, ism + lavozim avtomatik ishlatiladi."
        />

        <TextareaField
          label="Google tavsifi (description)"
          value={form.metaDescription}
          onChange={(v) => setForm({ ...form, metaDescription: v })}
          rows={3}
          placeholder="Toshkentdagi Full Stack dasturchi. React, Node.js, TypeScript..."
          hint={`${form.metaDescription.length}/160 belgi — qisqa va aniq yozing.`}
        />

        <TextareaField
          label="Kalit so'zlar"
          value={form.keywords}
          onChange={(v) => setForm({ ...form, keywords: v })}
          rows={3}
          placeholder="full stack developer, react developer, nodejs, toshkent dasturchi"
          hint="Vergul bilan ajrating. Masalan: react, nodejs, portfolio, toshkent"
        />

        <Field
          label="Telegram / LinkedIn sarlavhasi"
          value={form.ogTitle}
          onChange={(v) => setForm({ ...form, ogTitle: v })}
          placeholder="Islom Anvarov — Portfolio"
          hint="Havola ulashganda chiqadigan sarlavha. Bo'sh bo'lsa, Google sarlavhasi ishlatiladi."
        />

        <TextareaField
          label="Telegram / LinkedIn tavsifi"
          value={form.ogDescription}
          onChange={(v) => setForm({ ...form, ogDescription: v })}
          rows={3}
          placeholder="Zamonaviy veb ilovalar yaratuvchi dasturchi..."
          hint="Havola preview matni. Bo'sh bo'lsa, Google tavsifi ishlatiladi."
        />

        <Field
          label="Twitter username"
          value={form.twitterHandle}
          onChange={(v) => setForm({ ...form, twitterHandle: v })}
          placeholder="islomanvarov"
          hint="@ belgisiz yozing. Masalan: islomanvarov"
        />

        <TextareaField
          label="Yashirin SEO matni"
          value={form.hiddenContent}
          onChange={(v) => setForm({ ...form, hiddenContent: v })}
          rows={8}
          placeholder={"Men Islom Anvarov — Full Stack dasturchiman.\nToshkentda React, Node.js, TypeScript bilan ishlayman.\nKorporativ va startup loyihalar qilganman."}
          hint="Saytda ko'rinmaydi. Google botlari uchun qo'shimcha matn. Har yangi fikrni yangi qatorga yozing."
        />

        <Button type="submit" disabled={saving}>
          <Save className="size-4" />
          {saving ? "Saqlanmoqda..." : "SEO ni saqlash"}
        </Button>
      </form>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function CrudList<T extends { id: string }>({
  items,
  saving,
  emptyLabel,
  renderFields,
  onUpdate,
  onDelete,
  onCreate,
  newItemDefaults,
}: {
  items: T[];
  saving: boolean;
  emptyLabel: string;
  renderFields: (item: T, setItem: (item: T) => void) => React.ReactNode;
  onUpdate: (item: T) => void;
  onDelete: (id: string) => void;
  onCreate: (item: Omit<T, "id">) => void;
  newItemDefaults: Omit<T, "id">;
}) {
  const [edited, setEdited] = useState<Record<string, T>>({});
  const [newItem, setNewItem] = useState(newItemDefaults);

  useEffect(() => {
    const map: Record<string, T> = {};
    for (const item of items) map[item.id] = { ...item };
    setEdited(map);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">{emptyLabel}</p>
        <Card className="p-4">
          <h3 className="mb-3 font-medium">Yangi qo'shish</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {renderFields(newItem as T, (item) => setNewItem(item as Omit<T, "id">))}
          </div>
          <Button
            className="mt-3"
            size="sm"
            disabled={saving}
            onClick={() => onCreate(newItem)}
          >
            <Plus className="size-4" /> Qo'shish
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const current = edited[item.id] ?? item;
        return (
          <Card key={item.id} className="p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {renderFields(current, (updated) =>
                setEdited({ ...edited, [item.id]: updated }),
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" disabled={saving} onClick={() => onUpdate(current)}>
                <Save className="size-4" /> Saqlash
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={saving}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="size-4" /> O'chirish
              </Button>
            </div>
          </Card>
        );
      })}

      <Card className="p-4">
        <h3 className="mb-3 font-medium">Yangi qo'shish</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {renderFields(newItem as T, (item) => setNewItem(item as Omit<T, "id">))}
        </div>
        <Button
          className="mt-3"
          size="sm"
          disabled={saving}
          onClick={() => onCreate(newItem)}
        >
          <Plus className="size-4" /> Qo'shish
        </Button>
      </Card>
    </div>
  );
}
