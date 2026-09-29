import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clipboard,
  Copy,
  Cpu,
  ExternalLink,
  Gamepad2,
  Headphones,
  Home,
  Laptop,
  Menu,
  MessageCircle,
  Monitor,
  Percent,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Tag,
  X,
  Youtube,
  Zap,
} from "lucide-react";

type ProductDeal = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  retailer: string;
  currentPrice: number;
  previousPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  specifications?: string[];
  affiliateUrl: string;
  lastChecked?: string;
  isPriceDrop?: boolean;
  isFeatured?: boolean;
};

/**
 * Production rule:
 * Keep this empty until we have real, verified product data and real affiliate URLs.
 * Never publish invented prices, ratings, review counts, discounts or timestamps.
 */
export const LIVE_DEALS: ProductDeal[] = [];

const SITE_URL = "https://techbachat.com";

const SOCIAL_LINKS = {
  whatsapp: "",
  instagram: "",
  telegram: "",
  youtube: "",
};

const categories = [
  { name: "Laptops", icon: Laptop, slug: "laptops", description: "Work, study and gaming laptops" },
  { name: "Gaming", icon: Gamepad2, slug: "gaming", description: "Gaming gear and accessories" },
  { name: "PC Components", icon: Cpu, slug: "pc-components", description: "Components for your next build" },
  { name: "Monitors", icon: Monitor, slug: "monitors", description: "Displays for work and play" },
  { name: "Audio", icon: Headphones, slug: "audio", description: "Headphones, earbuds and speakers" },
  { name: "Smartphones", icon: Smartphone, slug: "smartphones", description: "Phones and mobile accessories" },
];

const guides = [
  {
    slug: "best-gadgets-under-1000",
    title: "Best Gadgets Under ₹1,000",
    description: "A practical checklist for finding useful budget tech without overpaying.",
  },
  {
    slug: "gaming-mouse-buying-guide",
    title: "Gaming Mouse Buying Guide",
    description: "What to check before buying a gaming mouse for your setup.",
  },
  {
    slug: "laptop-buying-guide",
    title: "Laptop Buying Guide",
    description: "CPU, RAM, storage, display and GPU considerations in one place.",
  },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={() => navigateTo("/")}
      className={`flex items-center ${compact ? "" : "shrink-0"}`}
      aria-label="TechBachat home"
    >
      <img
        src="/techbachat-website-logo.png"
        alt="TechBachat"
        className={compact ? "h-9 w-auto object-contain" : "h-9 w-auto max-w-[165px] object-contain"}
        loading="eager"
      />
    </button>
  );
}

function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return path;
}

function LinkButton({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() => navigateTo(to)}
      className={`transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function ExternalSocial({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span
        title={`${label} link will be added after the account is ready`}
        className="cursor-default rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-lime-500 hover:text-slate-900"
    >
      {children}
    </a>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigateTo(`/deals?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-5 lg:flex">
          <LinkButton to="/deals" className="text-sm font-semibold text-slate-700 hover:text-lime-600">
            Deals
          </LinkButton>
          <LinkButton to="/price-drops" className="text-sm font-semibold text-slate-700 hover:text-lime-600">
            Price Drops
          </LinkButton>
          <LinkButton to="/categories" className="text-sm font-semibold text-slate-700 hover:text-lime-600">
            Categories
          </LinkButton>
          <LinkButton to="/guides" className="text-sm font-semibold text-slate-700 hover:text-lime-600">
            Guides
          </LinkButton>
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 max-w-md md:flex">
          <div className="flex w-full items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-lime-400">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, SSDs, gaming mice..."
              className="w-full bg-transparent px-2 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
          </div>
        </form>

        <div className="hidden sm:block">
          {SOCIAL_LINKS.whatsapp ? (
            <a
              href={SOCIAL_LINKS.whatsapp}
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
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-xl border border-slate-300 p-2 text-slate-700 lg:hidden"
          aria-label="Open menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3">
              <Search className="h-4 w-4 text-slate-500" />
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
              ["/guides", "Guides"],
            ].map(([to, label]) => (
              <LinkButton
                key={to}
                to={to}
                className="rounded-lg px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-lime-600"
              >
                {label}
              </LinkButton>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            TechBachat is a public tech deal discovery platform. Browse deals,
            price drops and buying guides without creating an account.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ExternalSocial href={SOCIAL_LINKS.whatsapp} label="WhatsApp">
              WhatsApp
            </ExternalSocial>
            <ExternalSocial href={SOCIAL_LINKS.instagram} label="Instagram">
              Instagram
            </ExternalSocial>
            <ExternalSocial href={SOCIAL_LINKS.telegram} label="Telegram">
              Telegram
            </ExternalSocial>
            <ExternalSocial href={SOCIAL_LINKS.youtube} label="YouTube">
              YouTube
            </ExternalSocial>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-slate-900">Explore</h3>
          <div className="grid gap-3 text-sm text-slate-500">
            <LinkButton to="/deals" className="text-left hover:text-lime-600">Deals</LinkButton>
            <LinkButton to="/price-drops" className="text-left hover:text-lime-600">Price Drops</LinkButton>
            <LinkButton to="/categories" className="text-left hover:text-lime-600">Categories</LinkButton>
            <LinkButton to="/guides" className="text-left hover:text-lime-600">Buying Guides</LinkButton>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black text-slate-900">Company & Legal</h3>
          <div className="grid gap-3 text-sm text-slate-500">
            <LinkButton to="/about" className="text-left hover:text-lime-600">About</LinkButton>
            <LinkButton to="/contact" className="text-left hover:text-lime-600">Contact</LinkButton>
            <LinkButton to="/affiliate-disclosure" className="text-left hover:text-lime-600">Affiliate Disclosure</LinkButton>
            <LinkButton to="/privacy" className="text-left hover:text-lime-600">Privacy</LinkButton>
            <LinkButton to="/terms" className="text-left hover:text-lime-600">Terms</LinkButton>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TechBachat. Prices and availability are provided by external retailers.
      </div>
    </footer>
  );
}

function WhatsAppCTA() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-lime-200 bg-gradient-to-br from-lime-400/10 via-slate-950 to-slate-950 p-7 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1 text-xs font-black text-lime-600">
              <MessageCircle className="h-3.5 w-3.5" />
              DEAL ALERTS
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Never miss a good deal.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Get TechBachat deal and price-drop alerts directly on WhatsApp.
              No account on TechBachat is required.
            </p>
          </div>

          {SOCIAL_LINKS.whatsapp ? (
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-lime-500 px-5 py-3 font-black text-slate-900 hover:bg-lime-600"
            >
              Join WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-black text-slate-500">
              WhatsApp channel coming soon
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyDeals({ title = "Deals are being verified", description = "We're preparing real, verified deals for TechBachat. No fake prices or placeholder affiliate links are shown here." }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-50 text-lime-600">
        <ShieldCheck className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
      <LinkButton
        to="/guides"
        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-900 hover:border-lime-500"
      >
        Explore buying guides
        <ArrowRight className="h-4 w-4" />
      </LinkButton>
    </div>
  );
}

function DealCard({ deal }: { deal: ProductDeal }) {
  const share = async () => {
    const url = `${SITE_URL}/product/${deal.slug}`;
    if (navigator.share) {
      await navigator.share({ title: deal.name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("Deal link copied.");
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-lime-500/40">
      <div className="relative aspect-[4/3] bg-slate-50">
        <img src={deal.image} alt={deal.name} className="h-full w-full object-contain p-6" loading="lazy" />
        {deal.isPriceDrop && (
          <span className="absolute left-3 top-3 rounded-full bg-lime-500 px-2.5 py-1 text-[10px] font-black text-slate-900">
            PRICE DROP
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500">{deal.retailer}</span>
          {deal.discountPercentage ? (
            <span className="text-xs font-black text-lime-600">-{deal.discountPercentage}%</span>
          ) : null}
        </div>

        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-900">{deal.name}</h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xl font-black text-slate-900">₹{deal.currentPrice.toLocaleString("en-IN")}</div>
            {deal.previousPrice ? (
              <div className="text-xs text-slate-500 line-through">
                ₹{deal.previousPrice.toLocaleString("en-IN")}
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              onClick={share}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-lime-500 hover:text-lime-600"
              aria-label="Share deal"
              title="Share deal"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime-500 px-3 py-2 text-xs font-black text-slate-900 hover:bg-lime-600"
            >
              Check Deal
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function CategoryCard({ item }: { item: (typeof categories)[number] }) {
  const Icon = item.icon;
  return (
    <LinkButton
      to={`/category/${item.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-lime-500/40"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-50 text-lime-600 transition group-hover:bg-lime-500 group-hover:text-slate-900">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-black text-slate-900">{item.name}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
    </LinkButton>
  );
}

function HomePage() {
  const featured = LIVE_DEALS.filter((d) => d.isFeatured);
  const drops = LIVE_DEALS.filter((d) => d.isPriceDrop);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-xs font-black text-lime-600">
            <Zap className="h-3.5 w-3.5" />
            SMART TECH. BETTER PRICES.
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-7xl">
            Don't overpay
            <br />
            <span className="text-lime-600">for tech.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Discover useful tech deals, price drops and buying guides from
            popular retailers in India. Browse freely — no sign-up, no account,
            no unnecessary forms.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton
              to="/deals"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-5 py-3.5 text-sm font-black text-slate-900 hover:bg-lime-600"
            >
              Explore Deals
              <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <LinkButton
              to="/categories"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-900 hover:border-lime-500"
            >
              Browse Categories
            </LinkButton>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
            <span>✓ No sign-up</span>
            <span>✓ No account</span>
            <span>✓ External retailer checkout</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-lime-600">DEALS</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Today's Deals</h2>
          </div>
          <LinkButton to="/deals" className="text-sm font-bold text-slate-500 hover:text-lime-600">
            View all →
          </LinkButton>
        </div>
        {featured.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 4).map((deal) => <DealCard key={deal.id} deal={deal} />)}
          </div>
        ) : (
          <EmptyDeals />
        )}
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-widest text-lime-600">EXPLORE</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">Shop by Category</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => <CategoryCard key={item.slug} item={item} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-lime-600">PRICE INTELLIGENCE</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Recent Price Drops</h2>
          </div>
          <LinkButton to="/price-drops" className="text-sm font-bold text-slate-500 hover:text-lime-600">
            View all →
          </LinkButton>
        </div>
        {drops.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {drops.slice(0, 4).map((deal) => <DealCard key={deal.id} deal={deal} />)}
          </div>
        ) : (
          <EmptyDeals
            title="No verified price drops yet"
            description="We're not showing invented price history. Price-drop cards will appear when TechBachat has verified real price changes."
          />
        )}
      </section>

      <WhatsAppCTA />

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-lime-600">LEARN</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">Buying Guides</h2>
          </div>
          <LinkButton to="/guides" className="text-sm font-bold text-slate-500 hover:text-lime-600">
            View all →
          </LinkButton>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {guides.map((guide) => (
            <LinkButton
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left hover:border-lime-500/40"
            >
              <BookOpen className="h-5 w-5 text-lime-600" />
              <h3 className="mt-4 font-black text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{guide.description}</p>
            </LinkButton>
          ))}
        </div>
      </section>
    </>
  );
}

function DealsPage({ query }: { query: string }) {
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return LIVE_DEALS.filter((deal) =>
      !q
        ? true
        : `${deal.name} ${deal.category} ${deal.retailer}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <PageShell
      eyebrow="DEAL DIRECTORY"
      title={query ? `Results for "${query}"` : "Tech Deals"}
      description="Browse verified TechBachat deals. No sign-up required."
    >
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      ) : (
        <EmptyDeals
          title={query ? "No matching deals yet" : "The deal directory is being prepared"}
          description={
            query
              ? "Try another product or category. We only publish real deal information."
              : "Real products and affiliate links will be added after they are verified."
          }
        />
      )}
    </PageShell>
  );
}

function CategoriesPage() {
  return (
    <PageShell eyebrow="EXPLORE" title="Categories" description="Find tech by the type of product you're looking for.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => <CategoryCard key={item.slug} item={item} />)}
      </div>
    </PageShell>
  );
}

function CategoryPage({ slug }: { slug: string }) {
  const category = categories.find((c) => c.slug === slug);
  const deals = LIVE_DEALS.filter((d) => d.category.toLowerCase() === slug.toLowerCase());

  if (!category) return <NotFound />;

  return (
    <PageShell
      eyebrow="CATEGORY"
      title={category.name}
      description={category.description}
    >
      {deals.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      ) : (
        <EmptyDeals
          title={`No verified ${category.name.toLowerCase()} deals yet`}
          description="We're building this category with real, verified products rather than placeholder data."
        />
      )}
    </PageShell>
  );
}

function PriceDropsPage() {
  const drops = LIVE_DEALS.filter((d) => d.isPriceDrop);

  return (
    <PageShell
      eyebrow="PRICE INTELLIGENCE"
      title="Price Drops"
      description="Verified price changes only. We don't invent historical prices."
    >
      {drops.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drops.map((deal) => <DealCard key={deal.id} deal={deal} />)}
        </div>
      ) : (
        <EmptyDeals
          title="No verified price drops yet"
          description="Price-drop cards will appear when real price changes have been checked and recorded."
        />
      )}
    </PageShell>
  );
}

function ProductPage({ slug }: { slug: string }) {
  const deal = LIVE_DEALS.find((d) => d.slug === slug);

  if (!deal) {
    return (
      <PageShell eyebrow="PRODUCT" title="Product">
        <EmptyDeals
          title="Product not available"
          description="This product is not currently in the TechBachat live deal catalogue."
        />
      </PageShell>
    );
  }

  const share = async () => {
    const url = `${SITE_URL}/product/${deal.slug}`;
    if (navigator.share) {
      await navigator.share({ title: deal.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Product link copied.");
    }
  };

  return (
    <PageShell eyebrow={deal.category} title={deal.name} description={deal.description}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <img src={deal.image} alt={deal.name} className="mx-auto max-h-[460px] w-full object-contain" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="text-sm font-bold text-slate-500">{deal.retailer}</div>
          <div className="mt-3 text-4xl font-black text-slate-900">
            ₹{deal.currentPrice.toLocaleString("en-IN")}
          </div>

          {deal.previousPrice ? (
            <div className="mt-1 text-sm text-slate-500 line-through">
              ₹{deal.previousPrice.toLocaleString("en-IN")}
            </div>
          ) : null}

          {deal.discountPercentage ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-lime-50 px-3 py-1 text-xs font-black text-lime-600">
              <Percent className="h-3.5 w-3.5" />
              {deal.discountPercentage}% off
            </div>
          ) : null}

          {deal.specifications?.length ? (
            <div className="mt-7">
              <h3 className="font-black text-slate-900">Specifications</h3>
              <ul className="mt-3 grid gap-2 text-sm text-slate-500">
                {deal.specifications.map((spec) => (
                  <li key={spec} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={deal.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-5 py-3 font-black text-slate-900 hover:bg-lime-600"
            >
              Check Deal
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-black text-slate-900 hover:border-lime-500"
            >
              <Share2 className="h-4 w-4" />
              Share Deal
            </button>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            TechBachat does not sell products directly. You will complete your purchase on the external retailer's website.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function GuidesPage() {
  return (
    <PageShell eyebrow="LEARN" title="Buying Guides" description="Practical tech buying information without requiring an account.">
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((guide) => (
          <LinkButton
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left hover:border-lime-500/40"
          >
            <BookOpen className="h-6 w-6 text-lime-600" />
            <h3 className="mt-5 text-lg font-black text-slate-900">{guide.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{guide.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-lime-600">
              Read guide <ArrowRight className="h-4 w-4" />
            </span>
          </LinkButton>
        ))}
      </div>
    </PageShell>
  );
}

function GuidePage({ slug }: { slug: string }) {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return <NotFound />;

  return (
    <PageShell eyebrow="BUYING GUIDE" title={guide.title} description={guide.description}>
      <article className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <h2 className="text-xl font-black text-slate-900">What to look for</h2>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-500">
          <p>
            Compare the specifications that actually matter for your use case instead of choosing a product only because it has a large discount badge.
          </p>
          <p>
            Check the retailer, warranty, return policy, compatibility and current price before purchasing.
          </p>
          <p>
            TechBachat will add specific product recommendations here as real, verified deal data becomes available.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-lime-200 bg-lime-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-lime-600" />
            <p className="text-sm leading-6 text-slate-500">
              We don't publish invented prices, ratings or "lowest ever" claims. Product data will be added only when it can be verified.
            </p>
          </div>
        </div>
      </article>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell eyebrow="TECHBACHAT" title="About TechBachat" description="A simple place to discover useful technology without the clutter.">
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          ["Discover", "Find tech deals, price drops and useful products in one public catalogue."],
          ["Understand", "Use practical buying guides to understand what matters before you purchase."],
          ["Go direct", "TechBachat does not process payments. When you choose a deal, you continue to the external retailer."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-black text-slate-900">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function AffiliateDisclosurePage() {
  return (
    <PageShell eyebrow="TRANSPARENCY" title="Affiliate Disclosure" description="How TechBachat may earn from qualifying purchases.">
      <article className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <p className="text-sm leading-7 text-slate-500">
          TechBachat may participate in affiliate programs operated by retailers and affiliate networks. When you click certain links and make a qualifying purchase, TechBachat may receive a commission at no additional cost to you.
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-500">
          Affiliate participation will only be represented as active after the relevant program has approved TechBachat. We do not claim partnerships that have not been established.
        </p>
        <p className="mt-5 text-sm leading-7 text-slate-500">
          Product prices, availability, shipping and retailer terms are controlled by the external retailer and can change.
        </p>
      </article>
    </PageShell>
  );
}

function SimpleLegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell eyebrow={eyebrow} title={title}>
      <article className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <div className="space-y-5 text-sm leading-7 text-slate-500">{children}</div>
      </article>
    </PageShell>
  );
}

function ContactPage() {
  return (
    <PageShell eyebrow="CONTACT" title="Contact TechBachat" description="For business, affiliate or website-related queries.">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-10">
        <p className="text-sm leading-7 text-slate-500">
          A public contact email can be added here before launch. Until then, this page intentionally does not display a placeholder email address.
        </p>
      </div>
    </PageShell>
  );
}

function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      {eyebrow && (
        <div className="text-xs font-black uppercase tracking-widest text-lime-600">{eyebrow}</div>
      )}
      <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">{description}</p>}
      <div className="mt-10">{children}</div>
    </main>
  );
}

function NotFound() {
  return (
    <PageShell eyebrow="404" title="Page not found" description="The page you're looking for doesn't exist.">
      <LinkButton
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-lime-500 px-5 py-3 text-sm font-black text-slate-900"
      >
        Back to TechBachat
        <ArrowRight className="h-4 w-4" />
      </LinkButton>
    </PageShell>
  );
}

function setMeta(path: string) {
  const titleMap: Record<string, string> = {
    "/": "TechBachat — Tech Deals & Price Drops in India",
    "/deals": "Tech Deals in India | TechBachat",
    "/price-drops": "Price Drops | TechBachat",
    "/categories": "Tech Categories | TechBachat",
    "/guides": "Tech Buying Guides | TechBachat",
    "/about": "About TechBachat",
    "/affiliate-disclosure": "Affiliate Disclosure | TechBachat",
    "/privacy": "Privacy | TechBachat",
    "/terms": "Terms | TechBachat",
    "/contact": "Contact | TechBachat",
  };

  document.title = titleMap[path] || "TechBachat — SMART TECH. BETTER PRICES.";

  const description =
    "Discover tech deals, price drops and practical buying guides in India. Browse TechBachat without creating an account.";

  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `${SITE_URL}${path === "/" ? "" : path}`;
}

function App() {
  const path = usePath();

  useEffect(() => {
    setMeta(path);
  }, [path]);

  let page: React.ReactNode;

  if (path === "/") {
    page = <HomePage />;
  } else if (path === "/deals") {
    const query = new URLSearchParams(window.location.search).get("q") || "";
    page = <DealsPage query={query} />;
  } else if (path === "/price-drops") {
    page = <PriceDropsPage />;
  } else if (path === "/categories") {
    page = <CategoriesPage />;
  } else if (path.startsWith("/category/")) {
    page = <CategoryPage slug={path.split("/")[2] || ""} />;
  } else if (path.startsWith("/product/")) {
    page = <ProductPage slug={path.split("/")[2] || ""} />;
  } else if (path === "/guides") {
    page = <GuidesPage />;
  } else if (path.startsWith("/guides/")) {
    page = <GuidePage slug={path.split("/")[2] || ""} />;
  } else if (path === "/about") {
    page = <AboutPage />;
  } else if (path === "/affiliate-disclosure") {
    page = <AffiliateDisclosurePage />;
  } else if (path === "/contact") {
    page = <ContactPage />;
  } else if (path === "/privacy") {
    page = (
      <SimpleLegalPage title="Privacy" eyebrow="LEGAL">
        <p>TechBachat is designed to work without user accounts. Normal browsing does not require a name, phone number, email address or password.</p>
        <p>External retailers may collect information according to their own privacy policies when you leave TechBachat and visit their websites.</p>
        <p>If analytics or other services are added, this page should be updated to describe them accurately before launch.</p>
      </SimpleLegalPage>
    );
  } else if (path === "/terms") {
    page = (
      <SimpleLegalPage title="Terms" eyebrow="LEGAL">
        <p>TechBachat is a technology deal discovery and information platform. We do not sell products or process payments.</p>
        <p>Prices, availability, shipping, warranties and retailer policies are controlled by external retailers and can change without notice.</p>
        <p>Users should verify the final price and purchase terms on the retailer website before completing a purchase.</p>
      </SimpleLegalPage>
    );
  } else {
    page = <NotFound />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      {page}
      <Footer />
    </div>
  );
}

export default App;
