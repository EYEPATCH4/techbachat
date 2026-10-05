import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  ImagePlus,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Pencil,
  Plus,
  Settings,
  Search,
  ShieldCheck,
  Smartphone,
  Tag,
  Trash2,
  Upload,
  X,
  Instagram,
  Send,
  Youtube,
} from "lucide-react";

import { supabase, uploadImage, siteUrl } from "./lib";
import type { Product, Article } from "./lib";

const fallbackSettings: any = {
  site_name: "TechBachat",
  tagline: "SMART TECH. BETTER PRICES.",
  hero_title: "Don't overpay for tech.",
  hero_subtitle:
    "Discover useful tech deals, price drops, buying guides and practical technology articles.",
  hero_cta: "Explore Deals",
  whatsapp_url: "",
  instagram_url: "",
  telegram_url: "",
  youtube_url: "",
  contact_email: "",
  footer_text:
    "TechBachat is a public tech discovery platform. Browse freely — no sign-up required.",
  show_hero: true,
  show_featured: true,
  show_articles: true,
  show_price_drops: true,
  show_guides: true,
  show_whatsapp: true,
};

function nav(path: string) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

function usePath() {
  const [path, setPath] = useState(
    window.location.pathname + window.location.search
  );

  useEffect(() => {
    const handle = () =>
      setPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", handle);

    return () => window.removeEventListener("popstate", handle);
  }, []);

  return path;
}

function useSiteSettings() {
  const [settings, setSettings] = useState<any>(fallbackSettings);

  useEffect(() => {
    let mounted = true;

    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (mounted) {
          setSettings({
            ...fallbackSettings,
            ...(data || {}),
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}

function Logo() {
  return (
    <button
      type="button"
      onClick={() => nav("/")}
      aria-label="TechBachat home"
      className="shrink-0"
    >
      <img
        src="/techbachat-website-logo.png"
        alt="TechBachat"
        className="block h-11 w-auto max-w-[210px] object-contain"
      />
    </button>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
}) {
  const styles =
    variant === "primary"
      ? "bg-lime-500 text-slate-950 hover:bg-lime-600"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "border border-slate-200 bg-white text-slate-800 hover:border-lime-400 hover:bg-lime-50";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${styles}`}
    >
      {children}
    </button>
  );
}

function Header() {
  const settings = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const whatsapp = String(settings.whatsapp_url || "").trim();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    nav(`/deals?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {[
            ["/deals", "Deals"],
            ["/price-drops", "Price Drops"],
            ["/categories", "Categories"],
            ["/articles", "Articles"],
            ["/guides", "Guides"],
          ].map(([path, label]) => (
            <button
              key={path}
              type="button"
              onClick={() => nav(path)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-lime-50 hover:text-lime-700"
            >
              {label}
            </button>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden min-w-0 max-w-md flex-1 md:flex"
        >
          <div className="flex w-full items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-lime-400">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, SSDs, gaming mice..."
              className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
          </div>
        </form>

        <div className="hidden sm:block">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-4 py-2.5 text-sm font-black text-slate-900 transition hover:bg-lime-600"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-500">
              <MessageCircle className="h-4 w-4" />
              WhatsApp soon
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-xl border border-slate-300 p-2 text-slate-700 lg:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">
              <Search className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tech deals..."
                className="w-full bg-transparent px-2 py-3 text-sm text-slate-900 outline-none"
              />
            </div>
          </form>

          <div className="grid gap-1">
            {[
              ["/deals", "Deals"],
              ["/price-drops", "Price Drops"],
              ["/categories", "Categories"],
              ["/articles", "Articles"],
              ["/guides", "Guides"],
            ].map(([path, label]) => (
              <button
                key={path}
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  nav(path);
                }}
                className="rounded-lg px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-white hover:text-lime-700"
              >
                {label}
              </button>
            ))}

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-lime-500 px-3 py-3 text-sm font-black text-slate-950"
              >
                <MessageCircle className="h-4 w-4" />
                Join WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
function Footer() {
  const settings = useSiteSettings();

  const whatsapp = String(settings.whatsapp_url || "").trim();
  const instagram = String(settings.instagram_url || "").trim();
  const telegram = String(settings.telegram_url || "").trim();
  const youtube = String(settings.youtube_url || "").trim();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">

        {/* Brand + Social Links */}
        <div className="md:col-span-2">
          <Logo />

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            {settings.footer_text ||
              "TechBachat is a public tech deal discovery platform. Browse deals, price drops and buying guides without creating an account."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-400 hover:text-lime-600"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}

            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-400 hover:text-lime-600"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            )}

            {telegram && (
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-400 hover:text-lime-600"
              >
                <Send className="h-4 w-4" />
                Telegram
              </a>
            )}

            {youtube && (
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-lime-400 hover:text-lime-600"
              >
                <Youtube className="h-4 w-4" />
                YouTube
              </a>
            )}

          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-black text-slate-900">
            Explore
          </h3>

          <div className="mt-4 grid gap-3">

            <button
              onClick={() => nav("/deals")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Deals
            </button>

            <button
              onClick={() => nav("/price-drops")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Price Drops
            </button>

            <button
              onClick={() => nav("/categories")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Categories
            </button>

            <button
              onClick={() => nav("/guides")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Buying Guides
            </button>

          </div>
        </div>

        {/* Company & Legal */}
        <div>
          <h3 className="font-black text-slate-900">
            Company & Legal
          </h3>

          <div className="mt-4 grid gap-3">

            <button
              onClick={() => nav("/about")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              About
            </button>

            <button
              onClick={() => nav("/contact")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Contact
            </button>

            <button
              onClick={() => nav("/affiliate-disclosure")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Affiliate Disclosure
            </button>

            <button
              onClick={() => nav("/privacy")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Privacy
            </button>

            <button
              onClick={() => nav("/terms")}
              className="text-left text-sm font-semibold text-slate-500 hover:text-lime-700"
            >
              Terms
            </button>

          </div>
        </div>

      </div>

      <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TechBachat. Prices and availability are
        provided by external retailers.
      </div>
    </footer>
  );
}
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const affiliate = p.affiliate_url || "#";

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-60 items-center justify-center bg-slate-50 p-5">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlus className="h-10 w-10 text-slate-300" />
        )}

        {p.is_price_drop && (
          <span className="absolute left-3 top-3 rounded-full bg-lime-500 px-2.5 py-1 text-[10px] font-black text-slate-950">
            PRICE DROP
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {p.retailer || "Retailer"} · {p.category}
        </p>

        <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-black text-slate-900">
          {p.name}
        </h3>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-black text-slate-950">
            ₹{Number(p.current_price || 0).toLocaleString("en-IN")}
          </span>

          {p.previous_price ? (
            <del className="text-sm text-slate-400">
              ₹{Number(p.previous_price).toLocaleString("en-IN")}
            </del>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav("/product/" + p.slug)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-black text-slate-700 hover:border-lime-400 hover:bg-lime-50"
          >
            View
          </button>

          <a
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime-500 px-3 py-2.5 text-sm font-black text-slate-950 hover:bg-lime-600"
            href={affiliate}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
          >
            Check Deal
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      onClick={() => nav("/article/" + a.slug)}
    >
      <div className="h-52 overflow-hidden bg-slate-100">
        {a.featured_image_url ? (
          <img
            src={a.featured_image_url}
            alt={a.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-slate-300" />
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-wide text-lime-700">
          {a.category}
        </p>

        <h3 className="mt-2 text-lg font-black text-slate-900">{a.title}</h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {a.excerpt}
        </p>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-lime-700">
          Read article
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

function Section({
  title,
  label,
  more,
  children,
}: {
  title: string;
  label: string;
  more?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
            {label}
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
        </div>

        {more && (
          <button
            type="button"
            onClick={() => nav(more)}
            className="shrink-0 text-sm font-black text-slate-600 hover:text-lime-700"
          >
            View all →
          </button>
        )}
      </div>

      {children}
    </section>
  );
}

function WhatsAppCTA() {
  const settings = useSiteSettings();
  const whatsapp = String(settings.whatsapp_url || "").trim();

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-lime-200 bg-slate-950 p-7 shadow-sm sm:p-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-400/10 px-3 py-1 text-xs font-black text-lime-300">
              <MessageCircle className="h-3.5 w-3.5" />
              DEAL ALERTS
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Never miss a good deal.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Get TechBachat deal and price-drop alerts directly on WhatsApp.
              No account on TechBachat is required.
            </p>
          </div>

          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-lime-500 px-5 py-3 font-black text-slate-950 transition hover:bg-lime-400"
            >
              Join WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 font-black text-slate-400">
              WhatsApp channel coming soon
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const settings = useSiteSettings();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [productsResult, articlesResult] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false }),

        supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(6),
      ]);

      if (!mounted) return;

      setProducts(productsResult.data || []);
      setArticles(articlesResult.data || []);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Shell>
      <main>
        {settings.show_hero && (
          <section className="border-b border-slate-100 bg-gradient-to-b from-lime-50/70 to-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-700">
                {settings.tagline}
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {settings.hero_title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                {settings.hero_subtitle}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={() => nav("/deals")}>
                  {settings.hero_cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => nav("/articles")}
                >
                  Read Articles
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                <span>✓ No sign-up</span>
                <span>✓ Useful tech information</span>
                <span>✓ External retailer checkout</span>
              </div>
            </div>
          </section>
        )}

        {settings.show_featured && (
          <Section title="Today's Deals" label="DEALS" more="/deals">
            {products.filter((x) => x.is_featured).length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products
                  .filter((x) => x.is_featured)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
              </div>
            ) : (
              <EmptyDeals />
            )}
          </Section>
        )}

        {settings.show_articles && articles.length > 0 && (
          <Section title="Latest Articles" label="LEARN" more="/articles">
            <div className="grid gap-5 md:grid-cols-3">
              {articles.slice(0, 3).map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          </Section>
        )}

        {settings.show_price_drops && (
          <Section
            title="Recent Price Drops"
            label="PRICE INTELLIGENCE"
            more="/price-drops"
          >
            {products.filter((x) => x.is_price_drop).length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products
                  .filter((x) => x.is_price_drop)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
              </div>
            ) : (
              <EmptyDeals title="No price drops right now" />
            )}
          </Section>
        )}

        {settings.show_guides && (
          <Section title="Buying Guides" label="GUIDES" more="/guides">
            <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <BookOpen className="h-8 w-8 text-lime-600" />

                <h3 className="mt-4 text-xl font-black text-slate-900">
                  Practical buying guides
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Understand what matters before spending your money.
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={() => nav("/guides")}
              >
                Browse Guides
              </Button>
            </div>
          </Section>
        )}

        {settings.show_whatsapp && <WhatsAppCTA />}
      </main>
    </Shell>
  );
}

function EmptyDeals({
  title = "Deals are being verified",
}: {
  title?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-50 text-lime-600">
        <ShieldCheck className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-xl font-black text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        We are preparing verified TechBachat deals. No fake prices or
        placeholder affiliate links are shown here.
      </p>
    </div>
  );
}

function Listing({
  kind,
}: {
  kind: "deals" | "drops" | "articles";
}) {
  const [items, setItems] = useState<any[]>([]);

  const query = new URLSearchParams(window.location.search).get("q") || "";
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (kind === "articles") {
        const result = await supabase
          .from("articles")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        if (mounted) setItems(result.data || []);
        return;
      }

      let queryBuilder = supabase
        .from("products")
        .select("*")
        .eq("is_published", true);

      if (kind === "drops") {
        queryBuilder = queryBuilder.eq("is_price_drop", true);
      }

      const result = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (mounted) setItems(result.data || []);
    })();

    return () => {
      mounted = false;
    };
  }, [kind]);

  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        const searchable =
          kind === "articles"
            ? `${item.title || ""} ${item.category || ""} ${item.excerpt || ""}`
            : `${item.name || ""} ${item.category || ""} ${item.retailer || ""} ${item.description || ""}`;

        return searchable.toLowerCase().includes(normalizedQuery);
      })
    : items;

  const title =
    kind === "articles"
      ? "Articles"
      : kind === "drops"
        ? "Price Drops"
        : normalizedQuery
          ? `Search results for "${query}"`
          : "Tech Deals";

  return (
    <Shell>
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-700">
          TECHBACHAT
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {kind === "articles"
            ? "Technology articles, comparisons, explainers and buying guides."
            : normalizedQuery
              ? `Showing published products matching "${query}".`
              : "Browse real products and deal information. Verify the final price at the retailer."}
        </p>

        <div className="mt-10">
          {filteredItems.length === 0 ? (
            <EmptyDeals
              title={
                normalizedQuery
                  ? "No matching products found"
                  : kind === "articles"
                    ? "No articles published yet"
                    : "No deals found"
              }
            />
          ) : kind === "articles" ? (
            <div className="grid gap-5 md:grid-cols-3">
              {filteredItems.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}
function ProductPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => setProduct(data));
  }, [slug]);

  if (!product) {
    return (
      <Shell>
        <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-slate-950">
            Product not found
          </h1>
        </main>
      </Shell>
    );
  }

  const affiliate = product.affiliate_url || "#";

  return (
    <Shell>
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-slate-50 p-8">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[520px] w-full object-contain"
          />
        </div>

        <div className="self-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-700">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-base leading-7 text-slate-600">
              {product.description}
            </p>
          )}

          <div className="mt-7 flex items-end gap-3">
            <span className="text-3xl font-black text-slate-950">
              ₹{Number(product.current_price || 0).toLocaleString("en-IN")}
            </span>

            {product.previous_price ? (
              <del className="text-lg text-slate-400">
                ₹{Number(product.previous_price).toLocaleString("en-IN")}
              </del>
            ) : null}
          </div>

          {Array.isArray(product.specifications) &&
            product.specifications.length > 0 && (
              <div className="mt-7 grid gap-2">
                {product.specifications.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <Check className="h-4 w-4 shrink-0 text-lime-600" />
                    {spec}
                  </div>
                ))}
              </div>
            )}

          <a
            href={affiliate}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-500 px-6 py-3 font-black text-slate-950 hover:bg-lime-600"
          >
            Check Deal
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </main>
    </Shell>
  );
}

function ArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => setArticle(data));
  }, [slug]);

  if (!article) {
    return (
      <Shell>
        <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-slate-950">
            Article not found
          </h1>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-700">
          {article.category}
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {article.title}
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-500">
          {article.excerpt}
        </p>

        {article.featured_image_url && (
          <img
            className="mt-8 max-h-[520px] w-full rounded-3xl object-cover"
            src={article.featured_image_url}
            alt={article.title}
          />
        )}

        <article
          className="mt-10 text-base leading-8 text-slate-700 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-black [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:font-bold [&_a]:text-lime-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </main>
    </Shell>
  );
}

function Simple({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <Shell>
      <main className="mx-auto min-h-[60vh] max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          {title}
        </h1>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-7 text-base leading-7 text-slate-600">
          {text}
        </div>
      </main>
    </Shell>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <Logo />

        <h1 className="mt-7 text-3xl font-black text-slate-950">
          Admin login
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage TechBachat without editing code.
        </p>

        <div className="mt-7 grid gap-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-500"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-500"
          />

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <Button
            onClick={async () => {
              setError("");

              const result = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (result.error) {
                setError(result.error.message);
              } else {
                onLogin();
              }
            }}
          >
            Sign in
            <LogIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (value: string) => void;
  folder: "products" | "articles" | "media";
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-full w-full object-contain p-3"
          />
        ) : (
          <ImagePlus className="h-10 w-10 text-slate-300" />
        )}
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:border-lime-400">
        <Upload className="h-4 w-4" />

        {busy ? "Uploading..." : "Upload image"}

        <input
          hidden
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            setBusy(true);

            try {
              const url = await uploadImage(file, folder);
              onChange(url);
            } catch (error: any) {
              alert(error?.message || "Image upload failed");
            } finally {
              setBusy(false);
              event.target.value = "";
            }
          }}
        />
      </label>
    </div>
  );
}

function Form({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-lime-500 focus:ring-2 focus:ring-lime-100";

function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>

          <button
            type="button"
            onClick={close}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-72px)] overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      setSession(sessionData);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <AdminLogin
        onLogin={() =>
          supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
          })
        }
      />
    );
  }

  return <AdminApp />;
}

type AdminTab =
  | "dashboard"
  | "products"
  | "articles"
  | "homepage"
  | "media"
  | "settings";

function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const refresh = async () => {
    const [productsResult, articlesResult, categoriesResult] =
      await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase.from("categories").select("*").order("sort_order"),
      ]);

    setProducts(productsResult.data || []);
    setArticles(articlesResult.data || []);
    setCategories(categoriesResult.data || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const tabs: {
    id: AdminTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Products",
      icon: Tag,
    },
    {
      id: "articles",
      label: "Articles",
      icon: BookOpen,
    },
    {
      id: "homepage",
      label: "Homepage",
      icon: Smartphone,
    },
    {
      id: "media",
      label: "Media",
      icon: ImagePlus,
    },
    {
      id: "settings",
      label: "Site Settings",
      icon: Settings,
    },
  ];

  const currentTab = tabs.find((x) => x.id === tab);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                tab === id
                  ? "bg-lime-100 text-lime-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lime-700">
                TECHBACHAT CMS
              </p>

              <h1 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                {currentTab?.label}
              </h1>
            </div>

            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:border-lime-400"
            >
              View site ↗
            </a>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto lg:hidden">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold ${
                  tab === id
                    ? "bg-lime-100 text-lime-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {tab === "dashboard" && (
            <Dashboard products={products} articles={articles} />
          )}

          {tab === "products" && (
            <Products products={products} refresh={refresh} />
          )}

          {tab === "articles" && (
            <Articles
              articles={articles}
              products={products}
              refresh={refresh}
            />
          )}

          {tab === "homepage" && (
            <Homepage products={products} articles={articles} />
          )}

          {tab === "media" && <Media />}

          {tab === "settings" && (
            <SettingsPanel
              categories={categories}
              refresh={refresh}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Dashboard({
  products,
  articles,
}: {
  products: Product[];
  articles: Article[];
}) {
  const stats = [
    ["Products", products.length],
    [
      "Published deals",
      products.filter((x) => x.is_published).length,
    ],
    ["Articles", articles.length],
    [
      "Published articles",
      articles.filter((x) => x.is_published).length,
    ],
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([label, value]) => (
        <div
          key={String(label)}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="text-3xl font-black text-slate-950">
            {value}
          </div>

          <div className="mt-1 text-sm font-bold text-slate-500">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Products({
  products,
  refresh,
}: {
  products: Product[];
  refresh: () => void;
}) {
  const empty: Product = {
    slug: "",
    name: "",
    image_url: "",
    category: "Smartphones",
    retailer: "",
    current_price: 0,
    affiliate_url: "",
    is_price_drop: false,
    is_featured: false,
    is_published: false,
  };

  const [edit, setEdit] = useState<Product | null>(null);

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setEdit(empty)}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No products added yet.
          </div>
        ) : (
          products.map((p) => (
            <div
              className="flex flex-col gap-4 border-b border-slate-100 p-4 last:border-0 sm:flex-row sm:items-center"
              key={p.id}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-slate-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <b className="block truncate font-black text-slate-900">
                  {p.name}
                </b>

                <small className="text-slate-500">
                  {p.retailer || "No retailer"} · ₹
                  {Number(p.current_price || 0).toLocaleString("en-IN")}
                </small>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  p.is_published
                    ? "bg-lime-100 text-lime-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {p.is_published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEdit(p)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-lime-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete product?")) return;

                    await supabase
                      .from("products")
                      .delete()
                      .eq("id", p.id);

                    refresh();
                  }}
                  className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {edit && (
        <ProductEditor
          value={edit}
          close={() => setEdit(null)}
          refresh={() => {
            setEdit(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function ProductEditor({
  value,
  close,
  refresh,
}: {
  value: Product;
  close: () => void;
  refresh: () => void;
}) {
  const [product, setProduct] = useState<Product>({
    ...value,
    name: value.name || "",
    slug: value.slug || "",
    image_url: value.image_url || "",
    category: value.category || "",
    retailer: value.retailer || "",
    affiliate_url: value.affiliate_url || "",
    description: value.description || "",
    specifications: Array.isArray(value.specifications)
      ? value.specifications
      : [],
  });

  const save = async () => {
    const payload: any = { ...product };
    delete payload.id;
    delete payload.created_at;

    const result = value.id
      ? await supabase
          .from("products")
          .update(payload)
          .eq("id", value.id)
      : await supabase.from("products").insert(payload);

    if (result.error) {
      alert(result.error.message);
    } else {
      refresh();
    }
  };

  return (
    <Modal
      title={value.id ? "Edit Product" : "Add Product"}
      close={close}
    >
      <div className="grid gap-5">
        <Form label="Product name">
          <input
            className={inputClass}
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Slug">
          <input
            className={inputClass}
            value={product.slug}
            onChange={(e) =>
              setProduct({
                ...product,
                slug: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Product image">
          <ImageUpload
            value={product.image_url}
            onChange={(value) =>
              setProduct({
                ...product,
                image_url: value,
              })
            }
            folder="products"
          />
        </Form>

        <div className="grid gap-5 sm:grid-cols-2">
          <Form label="Category">
            <input
              className={inputClass}
              value={product.category || ""}
              onChange={(e) =>
                setProduct({
                  ...product,
                  category: e.target.value,
                })
              }
            />
          </Form>

          <Form label="Retailer">
            <input
              className={inputClass}
              value={product.retailer || ""}
              onChange={(e) =>
                setProduct({
                  ...product,
                  retailer: e.target.value,
                })
              }
            />
          </Form>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Form label="Current price">
            <input
              className={inputClass}
              type="number"
              value={product.current_price ?? 0}
              onChange={(e) =>
                setProduct({
                  ...product,
                  current_price: Number(e.target.value),
                })
              }
            />
          </Form>

          <Form label="Previous price">
            <input
              className={inputClass}
              type="number"
              value={product.previous_price ?? ""}
              onChange={(e) =>
                setProduct({
                  ...product,
                  previous_price: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />
          </Form>
        </div>

        <Form label="Affiliate URL">
          <input
            className={inputClass}
            value={product.affiliate_url || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                affiliate_url: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Description">
          <textarea
            rows={6}
            className={inputClass}
            value={product.description || ""}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Specifications (one per line)">
          <textarea
            rows={7}
            className={inputClass}
            value={(Array.isArray(product.specifications) ? product.specifications : []).join("\n")}
            onChange={(e) =>
              setProduct({
                ...product,
                specifications: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </Form>

        <div className="flex flex-wrap gap-5 rounded-2xl bg-slate-50 p-4">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!product.is_featured}
              onChange={(e) =>
                setProduct({
                  ...product,
                  is_featured: e.target.checked,
                })
              }
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!product.is_price_drop}
              onChange={(e) =>
                setProduct({
                  ...product,
                  is_price_drop: e.target.checked,
                })
              }
            />
            Price drop
          </label>

          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!product.is_published}
              onChange={(e) =>
                setProduct({
                  ...product,
                  is_published: e.target.checked,
                })
              }
            />
            Published
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={save}>
            <Check className="h-4 w-4" />
            Save Product
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Articles({
  articles,
  products,
  refresh,
}: {
  articles: Article[];
  products: Product[];
  refresh: () => void;
}) {
  const blank: Article = {
    slug: "",
    title: "",
    excerpt: "",
    featured_image_url: "",
    category: "Tech",
    content:
      "<h2>Start writing...</h2><p>Your article content goes here.</p>",
    author: "TechBachat Editorial",
    is_featured: false,
    is_published: false,
  };

  const [edit, setEdit] = useState<Article | null>(null);

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setEdit(blank)}>
          <Plus className="h-4 w-4" />
          New Article
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {articles.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No articles created yet.
          </div>
        ) : (
          articles.map((article) => (
            <div
              className="flex flex-col gap-4 border-b border-slate-100 p-4 last:border-0 sm:flex-row sm:items-center"
              key={article.id}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                {article.featured_image_url ? (
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="h-6 w-6 text-slate-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <b className="block truncate font-black">
                  {article.title}
                </b>
                <small className="text-slate-500">
                  {article.category}
                </small>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  article.is_published
                    ? "bg-lime-100 text-lime-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {article.is_published ? "Published" : "Draft"}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEdit(article)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:border-lime-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete article?")) return;

                    await supabase
                      .from("articles")
                      .delete()
                      .eq("id", article.id);

                    refresh();
                  }}
                  className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {edit && (
        <ArticleEditor
          value={edit}
          products={products}
          close={() => setEdit(null)}
          refresh={() => {
            setEdit(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

function ArticleEditor({
  value,
  products,
  close,
  refresh,
}: {
  value: Article;
  products: Product[];
  close: () => void;
  refresh: () => void;
}) {
  const [article, setArticle] = useState<Article>({
    ...value,
    title: value.title || "",
    slug: value.slug || "",
    excerpt: value.excerpt || "",
    featured_image_url: value.featured_image_url || "",
    category: value.category || "Tech",
    author: value.author || "TechBachat Editorial",
    content: value.content || "",
  });

  const [insert, setInsert] = useState("");

  const save = async () => {
    const payload: any = {
      ...article,
      published_at: article.is_published
        ? article.published_at || new Date().toISOString()
        : null,
    };

    delete payload.id;
    delete payload.created_at;

    const result = value.id
      ? await supabase
          .from("articles")
          .update(payload)
          .eq("id", value.id)
      : await supabase.from("articles").insert(payload);

    if (result.error) {
      alert(result.error.message);
    } else {
      refresh();
    }
  };

  const addProduct = () => {
    const product = products.find((x) => x.id === insert);

    if (!product) return;

    const html = `
<div>
  <img src="${product.image_url}" alt="${product.name}">
  <div>
    <b>${product.name}</b>
    <strong>₹${Number(product.current_price || 0).toLocaleString(
      "en-IN"
    )}</strong>
    <a href="${product.affiliate_url}" target="_blank" rel="noopener noreferrer nofollow sponsored">Check Price</a>
  </div>
</div>`;

    setArticle({
      ...article,
      content: article.content + "\n" + html,
    });

    setInsert("");
  };

  return (
    <Modal
      title={value.id ? "Edit Article" : "New Article"}
      close={close}
    >
      <div className="grid gap-5">
        <Form label="Title">
          <input
            className={inputClass}
            value={article.title}
            onChange={(e) =>
              setArticle({
                ...article,
                title: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Slug">
          <input
            className={inputClass}
            value={article.slug}
            onChange={(e) =>
              setArticle({
                ...article,
                slug: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Featured image">
          <ImageUpload
            value={article.featured_image_url || ""}
            onChange={(value) =>
              setArticle({
                ...article,
                featured_image_url: value,
              })
            }
            folder="articles"
          />
        </Form>

        <div className="grid gap-5 sm:grid-cols-2">
          <Form label="Category">
            <input
              className={inputClass}
              value={article.category || ""}
              onChange={(e) =>
                setArticle({
                  ...article,
                  category: e.target.value,
                })
              }
            />
          </Form>

          <Form label="Author">
            <input
              className={inputClass}
              value={article.author || ""}
              onChange={(e) =>
                setArticle({
                  ...article,
                  author: e.target.value,
                })
              }
            />
          </Form>
        </div>

        <Form label="Excerpt">
          <textarea
            rows={4}
            className={inputClass}
            value={article.excerpt || ""}
            onChange={(e) =>
              setArticle({
                ...article,
                excerpt: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Article HTML">
          <textarea
            rows={15}
            className={`${inputClass} font-mono text-xs`}
            value={article.content || ""}
            onChange={(e) =>
              setArticle({
                ...article,
                content: e.target.value,
              })
            }
          />
        </Form>

        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto]">
          <select
            value={insert}
            onChange={(e) => setInsert(e.target.value)}
            className={inputClass}
          >
            <option value="">Insert existing product...</option>

            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <Button variant="secondary" onClick={addProduct}>
            Insert Product Card
          </Button>
        </div>

        <div className="flex flex-wrap gap-5 rounded-2xl bg-slate-50 p-4">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!article.is_featured}
              onChange={(e) =>
                setArticle({
                  ...article,
                  is_featured: e.target.checked,
                })
              }
            />
            Featured
          </label>

          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={!!article.is_published}
              onChange={(e) =>
                setArticle({
                  ...article,
                  is_published: e.target.checked,
                })
              }
            />
            Published
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={save}>
            <Check className="h-4 w-4" />
            Save Article
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function Homepage({
  products,
  articles,
}: {
  products: Product[];
  articles: Article[];
}) {
  const [settings, setSettings] = useState<any>(fallbackSettings);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings({
          ...fallbackSettings,
          ...(data || {}),
        });
      });
  }, []);

  const save = async () => {
    const result = await supabase
      .from("site_settings")
      .upsert({
        ...settings,
        id: 1,
      });

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Homepage settings saved.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-2xl font-black">Homepage controls</h2>

      <p className="mt-2 text-sm text-slate-500">
        Control which sections appear and manage the main homepage copy.
      </p>

      <div className="mt-7 grid gap-5">
        <Form label="Hero title">
          <input
            className={inputClass}
            value={settings.hero_title || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                hero_title: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Hero subtitle">
          <textarea
            className={inputClass}
            value={settings.hero_subtitle || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                hero_subtitle: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Hero button">
          <input
            className={inputClass}
            value={settings.hero_cta || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                hero_cta: e.target.value,
              })
            }
          />
        </Form>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "show_hero",
            "show_featured",
            "show_articles",
            "show_price_drops",
            "show_guides",
            "show_whatsapp",
          ].map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-bold"
            >
              <input
                type="checkbox"
                checked={!!settings[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [key]: e.target.checked,
                  })
                }
              />

              {key.replace(/_/g, " ")}
            </label>
          ))}
        </div>

        <p className="text-sm text-slate-500">
          Featured deals are controlled by the Featured checkbox on each
          product. Latest articles are automatic.
        </p>

        <div className="flex justify-end">
          <Button onClick={save}>Save Homepage</Button>
        </div>
      </div>
    </div>
  );
}

function Media() {
  const [url, setUrl] = useState("");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-2xl font-black">Media Library</h2>

      <p className="mt-2 text-sm text-slate-500">
        Upload reusable images for articles, products or future site sections.
      </p>

      <div className="mt-7 max-w-md">
        <ImageUpload
          value={url}
          onChange={setUrl}
          folder="media"
        />
      </div>

      {url && (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            className={inputClass}
            value={url}
            readOnly
          />

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(url)}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
          >
            Copy URL
          </button>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({
  categories,
  refresh,
}: {
  categories: any[];
  refresh: () => void;
}) {
  const [settings, setSettings] = useState<any>(fallbackSettings);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings({
          ...fallbackSettings,
          ...(data || {}),
        });
      });
  }, []);

  const save = async () => {
    const result = await supabase
      .from("site_settings")
      .upsert({
        ...settings,
        id: 1,
      });

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Settings saved.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-2xl font-black">Global site settings</h2>

      <div className="mt-7 grid gap-5">
        <Form label="Site name">
          <input
            className={inputClass}
            value={settings.site_name || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                site_name: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Tagline">
          <input
            className={inputClass}
            value={settings.tagline || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                tagline: e.target.value,
              })
            }
          />
        </Form>

        <Form label="WhatsApp URL">
          <input
            className={inputClass}
            placeholder="https://chat.whatsapp.com/..."
            value={settings.whatsapp_url || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp_url: e.target.value,
              })
            }
          />
        </Form>

        <div className="grid gap-5 sm:grid-cols-2">
          <Form label="Instagram URL">
            <input
              className={inputClass}
              placeholder="https://instagram.com/..."
              value={settings.instagram_url || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  instagram_url: e.target.value,
                })
              }
            />
          </Form>

          <Form label="Telegram URL">
            <input
              className={inputClass}
              placeholder="https://t.me/..."
              value={settings.telegram_url || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  telegram_url: e.target.value,
                })
              }
            />
          </Form>
        </div>

        <Form label="YouTube URL">
          <input
            className={inputClass}
            placeholder="https://youtube.com/..."
            value={settings.youtube_url || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                youtube_url: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Contact email">
          <input
            className={inputClass}
            value={settings.contact_email || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                contact_email: e.target.value,
              })
            }
          />
        </Form>

        <Form label="Footer text">
          <textarea
            rows={4}
            className={inputClass}
            value={settings.footer_text || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                footer_text: e.target.value,
              })
            }
          />
        </Form>

        <div className="flex justify-end">
          <Button onClick={save}>Save Settings</Button>
        </div>

        <div className="my-3 border-t border-slate-200" />

        <div>
          <h2 className="text-xl font-black">Categories</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700"
              >
                {category.name}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <input
              className={inputClass}
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <Button
              onClick={async () => {
                const name = newCategory.trim();

                if (!name) return;

                const result = await supabase
                  .from("categories")
                  .insert({
                    name,
                    slug: name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-"),
                  });

                if (result.error) {
                  alert(result.error.message);
                  return;
                }

                setNewCategory("");
                refresh();
              }}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const path = usePath();
  const routePath = path.split("?")[0];

  if (routePath.startsWith("/admin")) {
    return <Admin />;
  }

  if (routePath === "/") {
    return <Home />;
  }

  if (routePath === "/deals") {
    return <Listing kind="deals" />;
  }

  if (routePath === "/price-drops") {
    return <Listing kind="drops" />;
  }

  if (routePath === "/articles") {
    return <Listing kind="articles" />;
  }

  if (routePath.startsWith("/product/")) {
    return (
      <ProductPage
        slug={routePath.split("/")[2] || ""}
      />
    );
  }

  if (routePath.startsWith("/article/")) {
    return (
      <ArticlePage
        slug={routePath.split("/")[2] || ""}
      />
    );
  }

  if (routePath === "/about") {
    return (
      <Simple
        title="About TechBachat"
        text="TechBachat is a public technology discovery platform for deals, articles and practical buying information. No visitor account is required."
      />
    );
  }

  if (routePath === "/contact") {
    return (
      <Simple
        title="Contact"
        text="Use the contact email configured by the site owner for business, partnership and correction requests."
      />
    );
  }

  if (routePath === "/affiliate-disclosure") {
    return (
      <Simple
        title="Affiliate Disclosure"
        text="Some links may be affiliate links. If you make a qualifying purchase after clicking one, TechBachat may receive a commission at no additional cost to you. Prices and retailer terms are controlled by the retailer."
      />
    );
  }

  if (routePath === "/categories") {
    return (
      <Simple
        title="Categories"
        text="Product categories are managed from the TechBachat admin panel."
      />
    );
  }

  if (routePath === "/guides") {
    return (
      <Simple
        title="Buying Guides"
        text="Practical buying guides will be published from the admin panel."
      />
    );
  }

  return (
    <Simple
      title="Page not found"
      text="The page you requested does not exist."
    />
  );
}