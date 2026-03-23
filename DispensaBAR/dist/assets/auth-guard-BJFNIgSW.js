import{s as r,g as t}from"./supabase-config-Cx9GDPIQ.js";async function s({requireAdmin:e=!1}={}){try{const{data:{user:a}}=await r.auth.getUser();if(!a)throw window.location.href="/",new Error("Non autenticato");const n=await t(a.id);if(n.role==="pending")throw await r.auth.signOut(),window.location.href="/",new Error("Account in attesa");if(e&&n.role!=="admin")throw window.location.href="/data-entry.html",new Error("Accesso negato");return document.body.classList.add("authenticated"),{user:a,profile:n}}catch(a){throw a}}async function i(){await r.auth.signOut(),window.location.href="/"}function o(e,a=""){const n=e.role==="admin";return`
    <nav class="navbar" role="navigation" aria-label="Navigazione principale">
      <a href="/data-entry.html" class="navbar__brand">🥃 Dispensa Bar</a>
      <button class="navbar__toggle" aria-label="Menu" aria-expanded="false">☰</button>
      <ul class="navbar__nav" role="menubar">
        <li role="none">
          <a href="/data-entry.html" role="menuitem"
             class="navbar__link ${a==="data-entry"?"navbar__link--active":""}">
            📦 Inventario
          </a>
        </li>
        <li role="none">
          <a href="/search.html" role="menuitem"
             class="navbar__link ${a==="search"?"navbar__link--active":""}">
            🔍 Cerca
          </a>
        </li>
        ${n?`
        <li role="none">
          <a href="/admin.html" role="menuitem"
             class="navbar__link ${a==="admin"?"navbar__link--active":""}">
            ⚙️ Admin
          </a>
        </li>
        <li role="none">
          <a href="/bulk-entry.html" role="menuitem"
             class="navbar__link ${a==="bulk-entry"?"navbar__link--active":""}">
            📋 Inserimento Massivo
          </a>
        </li>
        `:""}
        <li role="none" class="navbar__logout">
          <button id="logout-btn" class="navbar__link" role="menuitem" style="background:none;border:none;cursor:pointer;">
            🚪 Esci
          </button>
        </li>
      </ul>
    </nav>
  `}function c(e,a){var n;document.body.insertAdjacentHTML("afterbegin",o(e,a)),(n=document.getElementById("logout-btn"))==null||n.addEventListener("click",i)}export{c as i,s as r};
