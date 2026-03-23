import{a as q,s as c,b as y,f as s,c as T,p as E}from"./supabase-config-Cx9GDPIQ.js";import{r as w,i as I}from"./auth-guard-BJFNIgSW.js";let p=null,_=null,b=null;async function H(){try{const{user:t,profile:e}=await w();p=t,_=e,I(e,"data-entry"),q(),L(),$(),B()}catch{}}function L(){const t=document.getElementById("product-search");t==null||t.addEventListener("input",e=>{clearTimeout(b),b=setTimeout(()=>N(e.target.value.trim()),300)})}async function N(t){const e=document.getElementById("search-results"),a=document.getElementById("empty-state");if(!t){e.innerHTML="",e.appendChild(a),a.style.display="";return}try{const{data:o,error:n}=await c.from("products").select("*, categories(name), locations(name)").ilike("name",`%${t}%`).order("name").limit(20);if(n)throw n;if(!o.length){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p class="empty-state__text">Nessun prodotto trovato per "${t}"</p>
        </div>
      `;return}e.innerHTML=o.map(i=>M(i)).join(""),x()}catch(o){y("Errore nella ricerca: "+o.message,"error")}}function M(t){var o,n;const e=((o=t.categories)==null?void 0:o.name)||"—",a=((n=t.locations)==null?void 0:n.name)||"—";return`
    <div class="de-product glass-card" data-id="${t.id}" data-qty="${t.quantity}">
      <div class="de-product__info">
        <div class="de-product__name">${u(t.name)}</div>
        <div class="de-product__meta">
          📁 ${u(e)} · 📍 ${u(a)}
        </div>
      </div>
      <div class="de-product__qty">
        <span class="de-product__qty-value" id="qty-${t.id}">${s(t.quantity)}</span>
        <span class="de-product__qty-label">bott</span>
      </div>
      <div class="de-product__actions">
        <input
          type="text"
          class="de-product__amount-input"
          value="1"
          title="Quantità da aggiungere/rimuovere"
          data-id="${t.id}"
        />
        <button class="btn btn-in" data-id="${t.id}" data-action="in" title="Aggiungi">+</button>
        <button class="btn btn-out" data-id="${t.id}" data-action="out" title="Rimuovi">−</button>
      </div>
    </div>
  `}function x(){document.querySelectorAll(".btn-in, .btn-out").forEach(t=>{t.addEventListener("click",C)})}async function C(t){var v;const e=t.currentTarget,a=parseInt(e.dataset.id),o=e.dataset.action,n=e.closest(".de-product"),i=n.querySelector(".de-product__amount-input"),d=E(i.value)||1,m=parseFloat(n.dataset.qty)||0;let r;o==="in"?r=m+d:r=Math.max(0,m-d),r=Math.round(r*10)/10;try{const{error:l}=await c.from("products").update({quantity:r}).eq("id",a);if(l)throw l;const f=((v=n.querySelector(".de-product__name"))==null?void 0:v.textContent)||"",{error:g}=await c.from("activity_log").insert({user_id:p.id,user_name:_.display_name||_.email,product_id:a,product_name:f,action:o==="in"?"IN":"OUT",previous_value:m,new_value:r,details:{amount:d}});g&&console.warn("Log error:",g),n.dataset.qty=r;const h=document.getElementById(`qty-${a}`);h&&(h.textContent=s(r)),n.classList.remove("de-product--flash"),n.offsetWidth,n.classList.add("de-product--flash"),y(`${o==="in"?"+":"−"}${s(d)} → ${f}: ${s(r)} bott`,"success")}catch(l){y("Errore aggiornamento: "+l.message,"error")}}async function $(){try{const{data:t,error:e}=await c.from("activity_log").select("*").eq("user_id",p.id).order("created_at",{ascending:!1}).limit(15);if(e)throw e;S(t)}catch(t){console.error("History load error:",t)}}function S(t){const e=document.getElementById("history-list");if(!(t!=null&&t.length)){e.innerHTML=`
      <div class="empty-state">
        <p class="empty-state__text">Nessuna attività recente</p>
      </div>
    `;return}e.innerHTML=t.map(a=>{var i;const o=a.action==="IN",n=((i=a.details)==null?void 0:i.amount)??Math.abs((a.new_value||0)-(a.previous_value||0));return`
      <div class="de-history__item">
        <span class="de-history__action de-history__action--${o?"in":"out"}">
          ${o?"+":"−"}${s(n)}
        </span>
        <span class="de-history__detail">
          <strong>${u(a.product_name||"Prodotto")}</strong>
          → ${s(a.previous_value)} ➜ ${s(a.new_value)} bott
        </span>
        <span class="de-history__time">${T(a.created_at)}</span>
      </div>
    `}).join("")}function B(){c.channel("activity-log-changes").on("postgres_changes",{event:"INSERT",schema:"public",table:"activity_log",filter:`user_id=eq.${p.id}`},()=>{$()}).subscribe()}function u(t){const e=document.createElement("div");return e.textContent=t||"",e.innerHTML}H();
