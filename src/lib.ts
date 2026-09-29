import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
);

export const siteUrl = "https://techbachat.com";

export type Product = {
  id?: string; slug:string; name:string; image_url:string; category:string;
  retailer:string; current_price:number; previous_price?:number|null;
  discount_percentage?:number|null; rating?:number|null; description?:string;
  specifications?:string[]; affiliate_url:string; is_price_drop:boolean;
  is_featured:boolean; is_published:boolean; created_at?:string;
};

export type Article = {
  id?:string; slug:string; title:string; excerpt:string; featured_image_url:string;
  category:string; content:string; author:string; is_featured:boolean;
  is_published:boolean; published_at?:string; created_at?:string;
};

export async function uploadImage(file: File, folder: "products"|"articles"|"media") {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g,"-");
  const path = `${folder}/${crypto.randomUUID()}-${safe}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl:"31536000", upsert:false, contentType:file.type
  });
  if (error) throw error;
  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}