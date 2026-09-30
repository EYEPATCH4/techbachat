import { useEffect, useState } from "react";
import { supabase } from "../lib";
import { LayoutDashboard, Package, FileText, BookOpen, Image as ImageIcon, Settings as SettingsIcon, Link as LinkIcon, LogOut, Plus, Pencil, Trash2, Upload, Save, ExternalLink } from "lucide-react";

type Product = {
  id?: string; name:string; slug:string; brand?:string; category?:string; subcategory?:string;
  retailer?:string; current_price?:number; previous_price?:number; affiliate_url?:string;
  image_url?:string; short_description?:string; description?:string; coupon_code?:string;
  is_price_drop?:boolean; is_featured?:boolean; is_published?:boolean;
};
type Article = {
  id?:string; title:string; slug:string; category?:string; excerpt?:string; content?:string;
  featured_image_url?:string; is_published?:boolean; published_at?:string;
  seo_title?:string; seo_description?:string;
};
type Guide = {id?:string; title:string; slug:string; description?:string; content?:string; cover_image_url?:string; is_published?:boolean};
const blankProduct:Product={name:"",slug:"",brand:"",category:"",subcategory:"",retailer:"",current_price:0,previous_price:0,affiliate_url:"",image_url:"",short_description:"",description:"",coupon_code:"",is_price_drop:false,is_featured:false,is_published:false};
const blankArticle:Article={title:"",slug:"",category:"",excerpt:"",content:"",featured_image_url:"",is_published:false,seo_title:"",seo_description:""};
const blankGuide:Guide={title:"",slug:"",description:"",content:"",cover_image_url:"",is_published:false};

const slug=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

async function upload(file:File,folder:string){
  const path=`${folder}/${crypto.randomUUID()}-${file.name.replace(/\s+/g,"-")}`;
  const {error}=await supabase.storage.from("media").upload(path,file,{upsert:false,contentType:file.type});
  if(error) throw error;
  return {path,url:supabase.storage.from("media").getPublicUrl(path).data.publicUrl};
}
function Field({label,children}:{label:string;children:any}){return <label className="block space-y-1"><span className="text-xs font-bold text-slate-500">{label}</span>{children}</label>}
function Input(p:any){return <input {...p} className={"w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm "+(p.className||"")}/>}
function Area(p:any){return <textarea {...p} className={"w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm min-h-28 "+(p.className||"")}/>}
function Btn({children,onClick,variant="dark",type="button"}:any){return <button type={type} onClick={onClick} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${variant==="red"?"bg-red-50 text-red-700":"bg-slate-950 text-white"}`}>{children}</button>}
function Modal({title,close,children}:{title:string;close:()=>void;children:any}){return <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 flex items-center justify-center"><div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-auto"><div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between"><h2 className="font-black text-lg">{title}</h2><button onClick={close}>✕</button></div><div className="p-6">{children}</div></div></div>}

export default function AdminApp(){
  const [session,setSession]=useState<any>(null);
  useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session));const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>data.subscription.unsubscribe()},[]);
  if(!session)return <Login onLogin={()=>supabase.auth.getSession().then(({data})=>setSession(data.session))}/>;
  return <CMS/>;
}
function Login({onLogin}:{onLogin:()=>void}){
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState("");
  return <div className="min-h-screen bg-slate-950 grid place-items-center p-5"><div className="bg-white rounded-3xl p-8 w-full max-w-md">
    <div className="text-2xl font-black">Tech<span className="text-lime-600">Bachat</span></div><div className="text-xs font-bold text-slate-400 mt-1">ADMIN CMS</div>
    <h1 className="text-3xl font-black mt-8">Sign in</h1><div className="space-y-4 mt-6">
      <Field label="Email"><Input value={email} onChange={(e:any)=>setEmail(e.target.value)}/></Field>
      <Field label="Password"><Input type="password" value={password} onChange={(e:any)=>setPassword(e.target.value)}/></Field>
      {error&&<div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      <Btn onClick={async()=>{const r=await supabase.auth.signInWithPassword({email,password});if(r.error)setError(r.error.message);else onLogin()}}>Sign in</Btn>
    </div></div></div>
}
function CMS(){
  const [tab,setTab]=useState("dashboard");
  const tabs:any=[["dashboard","Dashboard",LayoutDashboard],["products","Products",Package],["articles","Articles",FileText],["guides","Guides",BookOpen],["media","Media",ImageIcon],["homepage","Homepage",LinkIcon],["settings","Site Settings",SettingsIcon]];
  const current=tabs.find((x:any)=>x[0]===tab);
  return <div className="min-h-screen bg-slate-100 md:flex"><aside className="md:w-64 bg-slate-950 text-white p-4">
    <div className="text-xl font-black p-3">Tech<span className="text-lime-400">Bachat</span></div>
    <nav className="space-y-1 mt-4">{tabs.map(([id,label,I]:any)=><button key={id} onClick={()=>setTab(id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${tab===id?"bg-lime-500 text-slate-950":"text-slate-300 hover:bg-white/10"}`}><I size={18}/>{label}</button>)}</nav>
    <div className="border-t border-white/10 mt-8 pt-3 space-y-2"><a href="/" target="_blank" className="flex gap-3 p-3 text-sm font-bold text-slate-300"><ExternalLink size={18}/>View website</a><button onClick={()=>supabase.auth.signOut().then(()=>location.reload())} className="flex gap-3 p-3 text-sm font-bold text-slate-300"><LogOut size={18}/>Sign out</button></div>
  </aside><main className="flex-1 min-w-0"><header className="bg-white border-b p-6"><div className="text-[10px] font-black tracking-[.2em] text-lime-600">TECHBACHAT CMS</div><h1 className="text-2xl font-black mt-1">{current?.[1]}</h1></header><div className="p-5 md:p-8">
    {tab==="dashboard"&&<Dashboard/>}{tab==="products"&&<Products/>}{tab==="articles"&&<Articles/>}{tab==="guides"&&<Guides/>}{tab==="media"&&<Media/>}{tab==="homepage"&&<Homepage/>}{tab==="settings"&&<Settings/>}
  </div></main></div>
}
function Dashboard(){
  const [c,setC]=useState<any>({});useEffect(()=>{(async()=>{const [p,a,g,m]=await Promise.all([supabase.from("products").select("id",{count:"exact",head:true}),supabase.from("articles").select("id",{count:"exact",head:true}),supabase.from("guides").select("id",{count:"exact",head:true}),supabase.from("media").select("id",{count:"exact",head:true})]);setC({Products:p.count||0,Articles:a.count||0,Guides:g.count||0,Media:m.count||0})})()},[]);
  return <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{Object.entries(c).map(([k,v])=><div key={k} className="bg-white border rounded-3xl p-6"><div className="text-3xl font-black">{String(v)}</div><div className="text-sm text-slate-500 font-bold">{k}</div></div>)}<div className="bg-white border rounded-3xl p-6 sm:col-span-2 lg:col-span-4"><h2 className="font-black text-xl">Full content control</h2><p className="text-sm text-slate-500 mt-2">Products, multiple images, blogs, guides, homepage content, media, social links and global settings are managed here.</p></div></div>
}
function Products(){
  const [items,setItems]=useState<Product[]>([]),[edit,setEdit]=useState<Product|null>(null);
  const load=async()=>{const {data}=await supabase.from("products").select("*").order("created_at",{ascending:false});setItems(data||[])};useEffect(()=>{load()},[]);
  return <div><div className="flex justify-end mb-5"><Btn onClick={()=>setEdit({...blankProduct})}><Plus size={16}/>Add product</Btn></div><div className="bg-white border rounded-3xl overflow-hidden">{items.map(p=><div key={p.id} className="p-4 border-b flex gap-4 items-center"><img src={p.image_url||"/techbachat-website-logo.png"} className="h-14 w-14 rounded-xl object-cover border"/><div className="flex-1 min-w-0"><b className="truncate block">{p.name}</b><span className="text-xs text-slate-500">{p.category} · ₹{Number(p.current_price||0).toLocaleString("en-IN")}</span></div><span className="text-xs font-bold">{p.is_published?"Published":"Draft"}</span><button onClick={()=>setEdit(p)}><Pencil size={17}/></button><button onClick={async()=>{if(confirm("Delete product?")){await supabase.from("products").delete().eq("id",p.id);load()}}}><Trash2 size={17}/></button></div>)}</div>{edit&&<ProductEditor value={edit} close={()=>setEdit(null)} done={()=>{setEdit(null);load()}}/>}</div>
}
function ProductEditor({value,close,done}:{value:Product;close:()=>void;done:()=>void}){
  const [p,setP]=useState({...value}),[gallery,setGallery]=useState<any[]>([]);
  useEffect(()=>{if(value.id)supabase.from("product_images").select("*").eq("product_id",value.id).order("sort_order").then(r=>setGallery(r.data||[]))},[value.id]);
  const save=async()=>{const x:any={...p,slug:p.slug||slug(p.name)};delete x.id;const r=value.id?await supabase.from("products").update(x).eq("id",value.id):await supabase.from("products").insert(x).select().single();if(r.error)return alert(r.error.message);done()};
  const add=async(files:FileList|null)=>{if(!files||!value.id)return alert("Save the product first, then upload its gallery.");for(const f of Array.from(files)){const u=await upload(f,"products");const {data,error}=await supabase.from("product_images").insert({product_id:value.id,url:u.url,path:u.path,alt_text:p.name,sort_order:gallery.length}).select().single();if(error)alert(error.message);else setGallery(g=>[...g,data])}};
  return <Modal title={value.id?"Edit product":"Add product"} close={close}><div className="grid md:grid-cols-2 gap-4">
    {([["name","Product name"],["slug","Slug"],["brand","Brand"],["category","Category"],["subcategory","Subcategory"],["retailer","Retailer"],["affiliate_url","Affiliate URL"],["coupon_code","Coupon code"],["image_url","Main image URL"],["short_description","Short description"]] as any[]).map(([k,l])=><Field key={k} label={l}><Input value={(p as any)[k]||""} onChange={(e:any)=>setP({...p,[k]:e.target.value})}/></Field>)}
    <Field label="Current price"><Input type="number" value={p.current_price||0} onChange={(e:any)=>setP({...p,current_price:Number(e.target.value)})}/></Field><Field label="Previous price"><Input type="number" value={p.previous_price||0} onChange={(e:any)=>setP({...p,previous_price:Number(e.target.value)})}/></Field>
  </div><div className="mt-4"><Field label="Description"><Area value={p.description||""} onChange={(e:any)=>setP({...p,description:e.target.value})}/></Field></div>
  <div className="flex flex-wrap gap-5 mt-5 text-sm font-bold">{([["is_price_drop","Price drop"],["is_featured","Featured"],["is_published","Published"]] as any[]).map(([k,l])=><label key={k} className="flex gap-2 items-center"><input type="checkbox" checked={!!(p as any)[k]} onChange={e=>setP({...p,[k]:e.target.checked})}/>{l}</label>)}</div>
  {value.id&&<div className="mt-7"><div className="flex justify-between items-center mb-3"><h3 className="font-black">Multiple product images</h3><label><Btn><Upload size={15}/>Upload<input hidden type="file" multiple accept="image/*" onChange={e=>add(e.target.files)}/></Btn></label></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{gallery.map(g=><div key={g.id} className="border rounded-xl overflow-hidden"><img src={g.url} className="aspect-square w-full object-cover"/><button className="p-2 text-xs text-red-600" onClick={async()=>{await supabase.from("product_images").delete().eq("id",g.id);setGallery(x=>x.filter(y=>y.id!==g.id))}}>Delete</button></div>)}</div></div>}
  <div className="flex justify-end gap-2 mt-7"><Btn onClick={close} variant="light">Cancel</Btn><Btn onClick={save}><Save size={15}/>Save product</Btn></div></Modal>
}
function Articles(){
  const [items,setItems]=useState<Article[]>([]),[edit,setEdit]=useState<Article|null>(null);const load=async()=>{const {data}=await supabase.from("articles").select("*").order("created_at",{ascending:false});setItems(data||[])};useEffect(()=>{load()},[]);
  return <div><div className="flex justify-end mb-5"><Btn onClick={()=>setEdit({...blankArticle})}><Plus size={16}/>New blog</Btn></div><div className="bg-white border rounded-3xl">{items.map(a=><div key={a.id} className="p-4 border-b flex gap-4 items-center"><img src={a.featured_image_url||"/techbachat-website-logo.png"} className="h-14 w-20 rounded-xl object-cover"/><div className="flex-1"><b>{a.title}</b><div className="text-xs text-slate-500">{a.category}</div></div><span className="text-xs font-bold">{a.is_published?"Published":"Draft"}</span><button onClick={()=>setEdit(a)}><Pencil size={17}/></button><button onClick={async()=>{if(confirm("Delete article?")){await supabase.from("articles").delete().eq("id",a.id);load()}}}><Trash2 size={17}/></button></div>)}</div>{edit&&<ArticleEditor value={edit} close={()=>setEdit(null)} done={()=>{setEdit(null);load()}}/>}</div>
}
function ArticleEditor({value,close,done}:{value:Article;close:()=>void;done:()=>void}){
  const [a,setA]=useState({...value});const save=async()=>{const x:any={...a,slug:a.slug||slug(a.title),published_at:a.is_published?(a.published_at||new Date().toISOString()):null};delete x.id;const r=value.id?await supabase.from("articles").update(x).eq("id",value.id):await supabase.from("articles").insert(x);if(r.error)alert(r.error.message);else done()};
  return <Modal title={value.id?"Edit blog":"New blog"} close={close}><div className="space-y-4"><div className="grid md:grid-cols-2 gap-4">{([["title","Title"],["slug","Slug"],["category","Category"],["featured_image_url","Featured image URL"],["seo_title","SEO title"],["seo_description","SEO description"]] as any[]).map(([k,l])=><Field key={k} label={l}><Input value={(a as any)[k]||""} onChange={(e:any)=>setA({...a,[k]:e.target.value})}/></Field>)}</div><Field label="Excerpt"><Area value={a.excerpt||""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setA({...a,excerpt:e.target.value})}/></Field><Field label="Content (HTML supported)"><textarea className="w-full min-h-[360px] rounded-xl border p-4 font-mono text-sm" value={a.content||""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setA({...a,content:e.target.value})}/></Field><label className="flex gap-2 items-center font-bold text-sm"><input type="checkbox" checked={!!a.is_published} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setA({...a,is_published:e.target.checked})}/>Publish</label><div className="flex justify-end"><Btn onClick={save}><Save size={15}/>Save blog</Btn></div></div></Modal>
}
function Guides(){
  const [items,setItems]=useState<Guide[]>([]),[edit,setEdit]=useState<Guide|null>(null);const load=async()=>{const {data}=await supabase.from("guides").select("*").order("created_at",{ascending:false});setItems(data||[])};useEffect(()=>{load()},[]);
  return <div><div className="flex justify-end mb-5"><Btn onClick={()=>setEdit({...blankGuide})}><Plus size={16}/>New guide</Btn></div><div className="grid md:grid-cols-2 gap-4">{items.map(g=><div key={g.id} className="bg-white border rounded-2xl p-5"><b>{g.title}</b><p className="text-sm text-slate-500 mt-2">{g.description}</p><div className="mt-4 flex gap-2"><Btn onClick={()=>setEdit(g)}><Pencil size={14}/>Edit</Btn><Btn variant="red" onClick={async()=>{if(confirm("Delete guide?")){await supabase.from("guides").delete().eq("id",g.id);load()}}}><Trash2 size={14}/></Btn></div></div>)}</div>{edit&&<GuideEditor value={edit} close={()=>setEdit(null)} done={()=>{setEdit(null);load()}}/>}</div>
}
function GuideEditor({value,close,done}:{value:Guide;close:()=>void;done:()=>void}){const [g,setG]=useState({...value});const save=async()=>{const x:any={...g,slug:g.slug||slug(g.title)};delete x.id;const r=value.id?await supabase.from("guides").update(x).eq("id",value.id):await supabase.from("guides").insert(x);if(r.error)alert(r.error.message);else done()};return <Modal title={value.id?"Edit guide":"New guide"} close={close}><div className="space-y-4"><Field label="Title"><Input value={g.title} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setG({...g,title:e.target.value})}/></Field><Field label="Slug"><Input value={g.slug} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setG({...g,slug:e.target.value})}/></Field><Field label="Description"><Area value={g.description||""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setG({...g,description:e.target.value})}/></Field><Field label="Cover image URL"><Input value={g.cover_image_url||""} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setG({...g,cover_image_url:e.target.value})}/></Field><Field label="Content"><textarea className="w-full min-h-[300px] rounded-xl border p-4 font-mono text-sm" value={g.content||""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setG({...g,content:e.target.value})}/></Field><label className="flex gap-2 items-center font-bold text-sm"><input type="checkbox" checked={!!g.is_published} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setG({...g,is_published:e.target.checked})}/>Publish</label><div className="flex justify-end"><Btn onClick={save}><Save size={15}/>Save guide</Btn></div></div></Modal>}
function Media(){
  const [items,setItems]=useState<any[]>([]);const load=async()=>{const {data}=await supabase.from("media").select("*").order("created_at",{ascending:false});setItems(data||[])};useEffect(()=>{load()},[]);
  const add=async(fs:FileList|null)=>{if(!fs)return;for(const f of Array.from(fs)){const u=await upload(f,"library");await supabase.from("media").insert({url:u.url,path:u.path,file_name:f.name,mime_type:f.type})}load()};
  return <div><div className="mb-5"><label><Btn><Upload size={15}/>Upload images<input hidden type="file" accept="image/*" multiple onChange={e=>add(e.target.files)}/></Btn></label></div><div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">{items.map(x=><div key={x.id} className="bg-white border rounded-2xl overflow-hidden"><img src={x.url} className="aspect-square w-full object-cover"/><div className="p-2 text-xs"><div className="truncate font-bold">{x.file_name}</div><button className="text-red-600 mt-2" onClick={async()=>{await supabase.from("media").delete().eq("id",x.id);load()}}>Delete</button></div></div>)}</div></div>
}
function Homepage(){return <SettingsForm title="Homepage controls" fields={["site_name","tagline","hero_title","hero_subtitle","hero_cta","hero_image_url"]}/>}
function Settings(){return <SettingsForm title="Social, contact and SEO" fields={["whatsapp_url","instagram_url","telegram_url","youtube_url","facebook_url","x_url","reddit_url","linkedin_url","contact_email","footer_text","seo_title","seo_description"]}/>}
function SettingsForm({title,fields}:{title:string;fields:string[]}){const [s,setS]=useState<any>({}),[id,setId]=useState<string>();useEffect(()=>{supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({data})=>{if(data){setS(data);setId(data.id)}})},[]);
  const save=async()=>{const x={...s};delete x.id;const r=id?await supabase.from("site_settings").update(x).eq("id",id):await supabase.from("site_settings").insert(x);if(r.error)alert(r.error.message);else alert("Saved.")};
  return <div className="bg-white border rounded-3xl p-6"><h2 className="font-black text-xl">{title}</h2><div className="grid md:grid-cols-2 gap-4 mt-6">{fields.map(k=><Field key={k} label={k.replace(/_/g, " ")}>{k.includes("description")||k==="footer_text"||k==="hero_subtitle"?<Area value={s[k]||""} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setS({...s,[k]:e.target.value})}/>:<Input value={s[k]||""} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setS({...s,[k]:e.target.value})}/>}</Field>)}</div><div className="mt-6"><Btn onClick={save}><Save size={15}/>Save settings</Btn></div></div>
}
