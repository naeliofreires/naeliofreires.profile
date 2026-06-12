(function(){
var ASSET_MAP = {"https://web-designer-23.aura.build/": "assets/2cbc568f564f6ae7_file.html", "https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js": "assets/758d94838db0cafd_iconify-icon.min.js", "https://web-designer-23.aura.build/assets/index-CT3yR8VR.css": "assets/9c50894902ed9077_index-CT3yR8VR.css", "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap": "assets/f32c4a47e91d6996_css2.css", "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap": "assets/4bcb63d746dc1754_css2.css", "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap": "assets/f03d5177d82d71e3_css2.css", "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;900&family=Instrument+Serif:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Bricolage+Grotesque:wght@300;400;500;600;700&display=swap": "assets/04e082577ae710a5_css2.css", "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Serif:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap": "assets/d12728c695d9fa3b_css2.css", "https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&family=Geist+Mono:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap": "assets/247761d376265140_css2.css", "https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&display=swap": "assets/356caca7d0e9c746_css2.css", "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700;800&display=swap": "assets/c77cac3cc91e6e23_css2.css", "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Archivo+Black&family=League+Gothic&family=Fredoka:wght@300;400;500;600;700&display=swap": "assets/287afa9f5a5cb953_css2.css", "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Urbanist:wght@300;400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&display=swap": "assets/a77f86371bc389ee_css2.css", "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Aboreto&family=Gloock&family=Marcellus&family=Cardo:wght@400;700&family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap": "assets/daa0ec40adc9d9a0_css2.css", "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Fraunces:opsz,wght@9..144,300..900&family=Lora:wght@400;500;600;700&family=GFS+Didot&family=Libre+Baskerville:wght@400;700&display=swap": "assets/66b1e43fa52a5922_css2.css", "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..800&family=Google+Sans+Flex:wght@400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap": "assets/19612a24da94d441_css2.css", "https://fonts.googleapis.com/css2?family=Chewy&family=Foldit:wght@400;500;600;700&family=Oi&family=Honk&family=Nabla&display=swap": "assets/c31766c0818ab1ee_css2.css", "https://web-designer-23.aura.build/assets/index-CBX3myZ8.js": "assets/index-CBX3myZ8.js", "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json": "assets/9e92f9101d138aa7_domains.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/shared_react_projects?select=*&slug=ilike.web-designer-23": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/rpc/get_public_shared_react_project_by_slug": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/shared_react_projects?select=*&custom_domain=ilike.web-designer-23.aura.build": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/rpc/get_public_shared_react_project_by_domain": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/shared_react_projects?select=*&custom_domain=ilike.aura.build": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/shared_code?select=*&slug=ilike.web-designer-23": "assets/7755a5620c739540_shared_code.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/shared_code?select=slug%2Ccreated_at&user_id=eq.56853b00-46cd-466e-93b9-dd33dfbb19fc&order=created_at.desc": "assets/03bf5c6241217a1d_shared_code.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/public_author_profiles?select=id%2Cfull_name%2Cavatar_url%2Cbio%2Cslug%2Ccreated_at%2Cviews%2Cis_featured%2Cwebsite%2Clocation%2Cis_pro&id=in.%2856853b00-46cd-466e-93b9-dd33dfbb19fc%29": "assets/cd8541bba6480f6f_public_author_profiles.json", "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap": "assets/71de0c11c987f278_css2.css", "https://cdn.tailwindcss.com/3.4.17": "assets/176e894661aa9cdc_3.4.17", "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2": "assets/c940764593d0fe5d_UcC73FwrK3iLTeHuS_nVMrMxCp50Sj.woff2", "https://web-designer-23.aura.build/logo-aura-gray.svg": "assets/23a9f32ff7d46956_logo-aura-gray.svg", "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/preview-images/web-designer-23.png?t=1764334934190": "assets/df6dfc249411e6d6_web-designer-23.png", "https://unpkg.com/lucide@1.17.0/dist/umd/lucide.min.js": "assets/5e943127343691a9_lucide.min.js", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/rpc/get_public_share_project_context": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://hoirqrkdgbmvpwutwuwj.supabase.co/rest/v1/rpc/get_public_share_page_content": "assets/4f53cda18c2baa0c_shared_react_projects.json", "https://unpkg.com/lucide@latest": "assets/5e943127343691a9_lucide.min.js", "https://cdn.tailwindcss.com": "assets/176e894661aa9cdc_3.4.17", "https://web-designer-23.aura.build/assets/base-80a1f760-CZjkNVqS.js": "assets/base-80a1f760-CZjkNVqS.js", "https://web-designer-23.aura.build/assets/App.js": "assets/App.js", "https://web-designer-23.aura.build/assets/productionTransform-B69cSEas.js": "assets/productionTransform-B69cSEas.js", "https://web-designer-23.aura.build/assets/jszip.min-4msiL9Ps.js": "assets/jszip.min-4msiL9Ps.js", "https://web-designer-23.aura.build/assets/index-CkqJij-D.js": "assets/index-CkqJij-D.js", "https://web-designer-23.aura.build/assets/index-Db-SEvnX.js": "assets/index-Db-SEvnX.js", "https://web-designer-23.aura.build/assets/DesignSystemPromptPopoverContent-CCLUzcus.js": "assets/DesignSystemPromptPopoverContent-CCLUzcus.js", "https://web-designer-23.aura.build/assets/consoleHook-59e792cb-DOFnXXkg.js": "assets/consoleHook-59e792cb-DOFnXXkg.js", "https://web-designer-23.aura.build/assets/index-599aeaf7-vA4FGpLY.js": "assets/index-599aeaf7-vA4FGpLY.js"};
// Pre-populate path+query keys: when opened via file://, JS
// resolves '/foo.js' against file://… so we lose the original
// origin. Indexing by pathname+search lets the lookup succeed.
var _add = {};
for (var _k in ASSET_MAP) {
  try { var _u = new URL(_k); _add[_u.pathname + _u.search] = ASSET_MAP[_k]; }
  catch(e){}
}
for (var _k in _add) if (!ASSET_MAP[_k]) ASSET_MAP[_k] = _add[_k];
function resolveLocal(u){
  if (!u || typeof u !== 'string') return null;
  if (u.indexOf('data:') === 0 || u.indexOf('blob:') === 0) return null;
  if (ASSET_MAP[u]) return ASSET_MAP[u];
  try {
    var url = new URL(u, location.href);
    var pq = url.pathname + url.search;
    if (ASSET_MAP[pq]) return ASSET_MAP[pq];
    // The snapshot may be opened from a subdirectory, while
    // ASSET_MAP paths are origin-rooted. Retry with the
    // document's own directory prefix stripped off.
    var dir = location.pathname.replace(/[^/]*$/, '');
    if (dir.length > 1 && pq.indexOf(dir) === 0) {
      var rel = pq.slice(dir.length - 1);
      if (ASSET_MAP[rel]) return ASSET_MAP[rel];
    }
    // Next.js image optimization wrapper — peel the inner CDN URL
    if (/_next\/image$/.test(url.pathname)) {
      var t = url.searchParams.get('url');
      if (t) {
        var dec = decodeURIComponent(t);
        if (ASSET_MAP[dec]) return ASSET_MAP[dec];
        var bare = dec.split('?')[0];
        for (var k in ASSET_MAP) {
          if (k.split('?')[0] === bare) return ASSET_MAP[k];
        }
      }
    }
  } catch(e){}
  return null;
}
function rewriteSrcset(s){
  if (!s || typeof s !== 'string') return s;
  return s.split(',').map(function(it){
    var p = it.trim().split(/\s+/);
    var loc = resolveLocal(p[0]);
    if (loc) p[0] = loc;
    return p.join(' ');
  }).join(', ');
}
// Patch property setters: el.src = '...' / el.href = '...'
// IMPORTANT: skip rewrite when the element has crossOrigin set.
// WebGL textures (UnicornStudio, Three.js, etc.) are loaded via
//   img.crossOrigin = 'anonymous'; img.src = 'https://cdn/...'
// and consumed via gl.texImage2D. file:// resources have no CORS
// headers, so rewriting to local makes WebGL reject the texture
// (Access blocked by CORS policy → black/missing 3D scene).
// Better to keep the original URL: works online, fails offline,
// matches non-patched behaviour.
function patchSetter(klass, prop, transform){
  if (!klass || !klass.prototype) return;
  var desc = Object.getOwnPropertyDescriptor(klass.prototype, prop);
  if (!desc || !desc.set) return;
  Object.defineProperty(klass.prototype, prop, {
    configurable: true,
    get: desc.get,
    set: function(v){
      try {
        if (transform === 'srcset') {
          v = rewriteSrcset(v);
        } else {
          // Captured runtime resource (UnicornStudio texture,
          // etc.) → serve as a data: URI. data: never CORS-
          // taints a WebGL canvas, unlike a file:// texture,
          // so gl.texImage2D still accepts it offline.
          var du = window.__offlineDataUri && window.__offlineDataUri(v);
          if (du) { v = du; }
          else if (!this.crossOrigin) {
            var loc = resolveLocal(v); if (loc) v = loc;
          }
        }
      } catch(e){}
      desc.set.call(this, v);
    }
  });
}
patchSetter(window.HTMLScriptElement, 'src');
patchSetter(window.HTMLLinkElement, 'href');
patchSetter(window.HTMLImageElement, 'src');
patchSetter(window.HTMLImageElement, 'srcset', 'srcset');
patchSetter(window.HTMLSourceElement, 'src');
patchSetter(window.HTMLSourceElement, 'srcset', 'srcset');
patchSetter(window.HTMLMediaElement, 'src');
patchSetter(window.HTMLIFrameElement, 'src');
// Patch setAttribute too — some libs use it instead of property set
var _setAttr = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value){
  try {
    if (typeof value === 'string') {
      if (name === 'src' || name === 'href') {
        var du = window.__offlineDataUri && window.__offlineDataUri(value);
        if (du) { value = du; }
        else if (!this.crossOrigin) {
          var loc = resolveLocal(value); if (loc) value = loc;
        }
      } else if (name === 'srcset' && !this.crossOrigin) {
        value = rewriteSrcset(value);
      }
    }
  } catch(e){}
  return _setAttr.call(this, name, value);
};
// Expose for the late-init script in body
window.__resolveLocal = resolveLocal;
window.__rewriteSrcset = rewriteSrcset;
})();
