import{a as f,s as c,b as v,f as y}from"./supabase-config-Cx9GDPIQ.js";import{r as h,i as E}from"./auth-guard-BJFNIgSW.js";let p=[],u=[],d=null,r=null;async function b(){try{const{user:a,profile:t}=await h();E(t,"search"),f(),await $(),g(),w()}catch{}}async function $(){try{const[a,t]=await Promise.all([c.from("categories").select("*").order("name"),c.from("locations").select("*").order("name")]);p=a.data||[],u=t.data||[],_("category-chips",p,"category"),_("location-chips",u,"location")}catch(a){v("Errore caricamento filtri: "+a.message,"error")}}function _(a,t,s){const l=document.getElementById(a);if(!l)return;const e=`<button class="chip chip--active" data-type="${s}" data-id="all">Tutti</button>`;l.innerHTML=e+t.map(i=>`<button class="chip" data-type="${s}" data-id="${i.id}">${n(i.name)}</button>`).join(""),l.querySelectorAll(".chip").forEach(i=>{i.addEventListener("click",()=>L(i,s))})}function L(a,t){a.parentElement.querySelectorAll(".chip").forEach(e=>e.classList.remove("chip--active")),a.classList.add("chip--active");const l=a.dataset.id;t==="category"?d=l==="all"?null:parseInt(l):r=l==="all"?null:parseInt(l),g()}async function g(){const a=document.getElementById("product-grid");try{let t=c.from("products").select("*, categories(name), locations(name)").order("name");d&&(t=t.eq("category_id",d)),r&&(t=t.eq("location_id",r));const{data:s,error:l}=await t;if(l)throw l;if(!s.length){a.innerHTML=`
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-state__icon">🔍</div>
          <p class="empty-state__text">Nessun prodotto trovato con i filtri selezionati</p>
        </div>
      `;return}a.innerHTML=s.map(e=>{var i,m;return`
      <div class="product-card glass-card" data-product='${JSON.stringify(e).replace(/'/g,"&#39;")}'>
        <div class="product-card__name">${n(e.name)}</div>
        <div class="product-card__category">📁 ${n(((i=e.categories)==null?void 0:i.name)||"—")}</div>
        <div class="product-card__location">📍 ${n(((m=e.locations)==null?void 0:m.name)||"—")}</div>
        <div class="product-card__qty">
          <span class="product-card__qty-value">${y(e.quantity)}</span>
          <span class="product-card__qty-label">bott</span>
        </div>
      </div>
    `}).join(""),a.querySelectorAll(".product-card").forEach(e=>{e.addEventListener("click",()=>{const i=JSON.parse(e.dataset.product);q(i)})})}catch(t){v("Errore caricamento prodotti: "+t.message,"error")}}function w(){const a=document.getElementById("product-modal"),t=document.getElementById("modal-close");t==null||t.addEventListener("click",o),a==null||a.addEventListener("click",s=>{s.target===a&&o()}),document.addEventListener("keydown",s=>{s.key==="Escape"&&o()})}function q(a){var e,i;const t=document.getElementById("product-modal"),s=document.getElementById("modal-title"),l=document.getElementById("modal-body");s.textContent=a.name,l.innerHTML=`
    <div class="modal-detail__row">
      <span class="modal-detail__label">Nome</span>
      <span class="modal-detail__value">${n(a.name)}</span>
    </div>
    <div class="modal-detail__row">
      <span class="modal-detail__label">Categoria</span>
      <span class="modal-detail__value">${n(((e=a.categories)==null?void 0:e.name)||"—")}</span>
    </div>
    <div class="modal-detail__row">
      <span class="modal-detail__label">Posizione</span>
      <span class="modal-detail__value">${n(((i=a.locations)==null?void 0:i.name)||"—")}</span>
    </div>
    <div class="modal-detail__row">
      <span class="modal-detail__label">Quantità</span>
      <span class="modal-detail__value" style="color:var(--accent-gold); font-weight:600;">
        ${y(a.quantity)} bott
      </span>
    </div>
    <div class="modal-detail__row">
      <span class="modal-detail__label">Origine</span>
      <span class="modal-detail__value">${n(a.origin||"—")}</span>
    </div>
    <div class="modal-detail__row">
      <span class="modal-detail__label">Aroma</span>
      <span class="modal-detail__value">${n(a.aroma||"—")}</span>
    </div>
    ${a.description?`
      <div class="modal-detail__description">
        ${n(a.description)}
      </div>
    `:""}
  `,t.classList.add("active"),t.setAttribute("aria-hidden","false")}function o(){const a=document.getElementById("product-modal");a==null||a.classList.remove("active"),a==null||a.setAttribute("aria-hidden","true")}function n(a){const t=document.createElement("div");return t.textContent=a||"",t.innerHTML}b();
