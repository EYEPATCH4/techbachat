import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
);

export const siteUrl = "https://techbachat.com";

/* =========================================================
   TYPES
   ========================================================= */

export type Product = {
  id?: string;
  slug: string;
  name: string;

  brand?: string | null;
  category: string;
  subcategory?: string | null;

  retailer?: string | null;

  current_price: number;
  previous_price?: number | null;
  discount_percentage?: number | null;

  rating?: number | null;

  image_url: string;
  images?: string[] | null;

  short_description?: string | null;
  description?: string | null;

  specifications?: unknown;

  affiliate_url?: string | null;
  coupon_code?: string | null;

  is_price_drop?: boolean;
  is_featured?: boolean;
  is_published: boolean;

  created_at?: string;
  updated_at?: string;
};

export type Article = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  category?: string | null;
  content: string;
  author?: string | null;

  is_featured?: boolean;
  is_published: boolean;

  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id?: string;
  name: string;
  slug: string;
  sort_order?: number;
  created_at?: string;
};

export type SiteSettings = {
  id?: number;

  site_name?: string | null;
  tagline?: string | null;

  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta?: string | null;

  whatsapp_url?: string | null;
  instagram_url?: string | null;
  telegram_url?: string | null;
  youtube_url?: string | null;
  contact_email?: string | null;
  footer_text?: string | null;

  show_hero?: boolean;
  show_featured?: boolean;
  show_articles?: boolean;
  show_price_drops?: boolean;
  show_guides?: boolean;
  show_whatsapp?: boolean;

  updated_at?: string;
};

/* =========================================================
   PRODUCTS
   ========================================================= */

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data;
}

/* =========================================================
   ARTICLES / BLOGS
   ========================================================= */

export async function fetchArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }

  return data ?? [];
}

export async function fetchArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching article:", error);
    throw error;
  }

  return data;
}

/* =========================================================
   CATEGORIES
   ========================================================= */

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data ?? [];
}

/* =========================================================
   SITE SETTINGS
   ========================================================= */

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching site settings:", error);
    throw error;
  }

  return data;
}

/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

export async function uploadImage(
  file: File,
  folder: "products" | "articles" | "media"
): Promise<string> {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-");

  const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage
    .from("site-media")
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Image upload failed:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("site-media")
    .getPublicUrl(path);

  return data.publicUrl;
}

/* =========================================================
   IMAGE DELETE
   ========================================================= */

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from("site-media")
    .remove([path]);

  if (error) {
    console.error("Image deletion failed:", error);
    throw error;
  }
}