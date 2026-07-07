# Internacionalização (i18n) — Pesquisa e Recomendação para o NF-web

> Pesquisa sobre melhores práticas de internacionalização de aplicações web para múltiplas linguagens, com foco no cenário específico do **NF-web**: site estático em HTML/CSS/JS puro, sem build step, suportando **2 idiomas (PT + EN)**.

---

## 1. Resumo Executivo (TL;DR)

**Recomendação:** Para o NF-web, adote a **Abordagem B — JSON + atributos `data-i18n` + JS vanilla (~40 linhas)** como fonte única de textos, combinada com **subdiretórios por idioma** (`/` para EN, `/pt/` para PT) para fins de SEO e URLs amigáveis.

**Por quê?** O NF-web é um site estático sem framework, sem `package.json` e sem bundler. Bibliotecas como `react-i18next`, `next-intl` ou `Lingui` exigem um build step e trazem um custo de bundle (9-19 KB gzip) desnecessário para apenas 2 idiomas. A abordagem com `data-i18n` mantém uma única fonte de textos (arquivos JSON por idioma), permite troca dinâmica de idioma sem recarregar a página, tem custo zero de dependências e é suficiente para um portfolio. Os subdiretórios garantem que o Google indexe corretamente cada versão e que `<html lang>` e `hreflang` sejam servidos no HTML inicial — fundamental para SEO.

**Pontos-chave da recomendação:**
- ✅ Zero dependências (sem npm, sem bundle)
- ✅ Fonte única de textos em `/locales/en.json` e `/locales/pt.json`
- ✅ Chaves semânticas aninhadas por seção (`hero.title`, `nav.about`, `experience.nexla.role`)
- ✅ Subdiretórios por idioma (`/`, `/pt/`) + `hreflang` recíproco para SEO
- ✅ `Intl.*` nativo do navegador para datas/números (sem polyfill em 2026)
- ✅ Fallback de locale: `pt-BR → pt → en`

---

## 2. Estado Atual do NF-web

| Aspecto | Situação atual |
|---|---|
| **Stack** | HTML/CSS/JS puro estático, sem `package.json`, sem bundler, sem framework |
| **Build step** | Nenhum (Tailwind via snapshot pré-compilado `assets/css/tailwind-utilities.css`) |
| **Onde estão os textos** | Hardcoded diretamente no `index.html` (~1598 linhas) |
| **Idioma atual** | Inglês (`<html lang="en">`) |
| **i18n existente** | Nenhum |
| **Separação conteúdo/visual** | Nenhuma — copy, headings, bullets e `aria-label` são text nodes inline |
| **Inconsistência** | `design-system.html` declara `lang="pt-BR"` mas o conteúdo está em inglês |
| **Roteamento** | Nenhum (single-page, navegação por anchor scroll: `#about`, `#work`, etc.) |
| **Currículo fonte** | `Naelio Freires - PT_BR.pdf` (em português) |

**Diagnóstico:** não existe camada de conteúdo a ser internacionalizada — qualquer solução exige primeiro **extrair os textos inline** do `index.html` para uma estrutura externa (JSON). O site atual serve como "texto fonte em inglês".

---

## 3. Abordagens Avaliadas para HTML Estático + 2 Idiomas

### Abordagem A — Arquivos HTML duplicados (um por idioma)

Cria-se uma cópia do HTML para cada idioma: `index.html` (EN) e `pt/index.html` (PT).

```
/
├── index.html          ← versão em inglês
└── pt/
    └── index.html      ← versão em português
```

**Prós:**
- 🟢 Melhor SEO possível — cada página serve HTML completo com `<html lang>` correto, sem JavaScript
- 🟢 Funciona mesmo com JavaScript desabilitado
- 🟢 Google indexa cada versão como página independente
- 🟢 Simples de entender e manter para 2 idiomas

**Contras:**
- 🔴 Duplicação massiva de HTML (~1598 linhas × 2)
- 🔴 Toda mudança de layout/estilo precisa ser replicada em ambos os arquivos
- 🔴 Erro humano: esquecer de atualizar uma versão
- 🔴 Inviável a partir de 3-4 idiomas

**Quando usar:** sites muito pequenos (1-2 páginas) com 2 idiomas e pouca manutenção.

---

### Abordagem B — JSON + atributos `data-i18n` + JS vanilla (⭐ RECOMENDADA)

Mantém-se um único HTML. Textos são externalizados em arquivos JSON por idioma. Elementos HTML recebem `data-i18n="chave"` e um script vanilla (~40 linhas) preenche o conteúdo a partir do JSON do idioma ativo.

```html
<!-- HTML -->
<h1 data-i18n="hero.title">NAÉLIO FREIRES</h1>
<p data-i18n="hero.intro">I'm a front-end developer...</p>
<a data-i18n="nav.about" href="#about">About</a>
```

```json
// locales/en.json
{
  "hero": {
    "title": "NAÉLIO FREIRES",
    "intro": "I'm a front-end developer with 6+ years of experience...",
    "availableBadge": "Available for new projects"
  },
  "nav": { "about": "About", "work": "Work", "contact": "Contact" }
}
```

```json
// locales/pt.json
{
  "hero": {
    "title": "NAÉLIO FREIRES",
    "intro": "Sou desenvolvedor front-end com 6+ anos de experiência...",
    "availableBadge": "Disponível para novos projetos"
  },
  "nav": { "about": "Sobre", "work": "Projetos", "contact": "Contato" }
}
```

```js
// assets/js/i18n.js (~40 linhas)
let currentLang = localStorage.getItem('lang') || detectLang();

async function loadLang(lang) {
  const res = await fetch(`/locales/${lang}.json`);
  const dict = await res.json();
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = key.split('.').reduce((o, k) => o?.[k], dict);
    if (value) el.textContent = value;
  });
  // atributos (aria-label, placeholder, etc.)
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const [attr, key] = el.getAttribute('data-i18n-attr').split(':');
    const value = key.split('.').reduce((o, k) => o?.[k], dict);
    if (value) el.setAttribute(attr, value);
  });
}

function detectLang() {
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('pt')) return 'pt';
  return 'en';
}

loadLang(currentLang);
```

**Prós:**
- 🟢 Fonte única de textos — sem duplicação de HTML
- 🟢 Zero dependências (sem npm, sem bundle, sem libraries externas)
- 🟢 Troca de idioma instantânea sem recarregar a página
- 🟢 Custo de bundle: ~1 KB (apenas o script vanilla)
- 🟢 Escala bem para 3-5 idiomas sem retrabalho
- 🟢 Diferenças entre idiomas ficam isoladas em JSON — fácil de revisar em PR

**Contras:**
- 🟡 SEO um pouco inferior ao da Abordagem A: o HTML inicial vem em inglês (idioma padrão) e o JS troca no cliente. Crawlers que executam JS (Googlebot) indexam corretamente, mas crawlers sem JS veem só o texto padrão.
- 🟡 Requer um pequeno script e atenção a FOUC (flash of untranslated content) — mitigável com um script inline blocking no `<head>`.

**Quando usar:** sites estáticos pequenos a médios, com 2-5 idiomas, onde se quer manter uma única fonte HTML.

---

### Abordagem C — i18next (vanilla JS, sem React)

Usa o `i18next` core (sem react-i18next) que funciona em qualquer JS.

```js
import i18next from 'i18next';
i18next.init({
  resources: { en: { translation: {...} }, pt: { translation: {...} } },
  lng: 'en', fallbackLng: 'en'
});
document.querySelector('h1').textContent = i18next.t('hero.title');
```

**Prós:**
- 🟢 Recursos avançados: interpolação, pluralização ICU, namespaces, lazy loading, fallback
- 🟢 Ecossistema maduro, muita documentação
- 🟢 Funciona em qualquer ambiente JS

**Contras:**
- 🔴 Bundle: ~14 KB gzip (só o core) — exagero para 2 idiomas num site estático
- 🔴 Adiciona uma dependência npm (hoje o projeto não tem `package.json`)
- 🔴 API imperativa (`t('chave')`) — menos elegante que `data-i18n` para HTML estático
- 🔴 Features como pluralização e namespaces são desnecessárias para um portfolio

**Quando usar:** aplicações JS complexas com muitas línguas, pluralização real e equipe que já usa npm. Não é o caso do NF-web.

---

## 4. Tabela Comparativa

| Critério | A. HTML duplicado | B. JSON + `data-i18n` ⭐ | C. i18next vanilla |
|---|---|---|---|
| **SEO** | 🟢 Excelente (HTML completo por idioma) | 🟡 Bom (requer JS; Googlebot indexa) | 🟡 Bom (mesmo de B) |
| **Manutenção** | 🔴 Ruim (duplicação de HTML) | 🟢 Excelente (fonte única) | 🟢 Boa |
| **Complexidade** | 🟢 Muito baixa | 🟢 Baixa (~40 linhas JS) | 🟡 Média (configuração, API) |
| **Dependências** | 🟢 Nenhuma | 🟢 Nenhuma | 🔴 i18next (~14 KB gzip) |
| **Performance** | 🟢 Ótima (sem JS) | 🟢 Boa (~1 KB script) | 🟡 Bundle maior |
| **Troca de idioma** | 🔴 Recarrega página | 🟢 Instantânea | 🟢 Instantânea |
| **Escala >3 idiomas** | 🔴 Inviável | 🟢 Boa | 🟢 Excelente |
| **Pluralização complexa** | 🟡 Manual | 🟡 Manual (ou ICU) | 🟢 Nativa |
| **Adequação ao NF-web** | 5/10 | **9/10** | 6/10 |

---

## 5. Recomendação Final

### Abordagem B (JSON + `data-i18n` + JS vanilla) com subdiretórios por idioma

Combina o melhor dos dois mundos:
1. **Fonte única de HTML** — sem duplicação, manutenção centralizada
2. **Textos em JSON por idioma** — organizados, fáceis de revisar e traduzir
3. **Subdiretórios por idioma** (`/` EN, `/pt/` PT) — para URLs amigáveis e SEO
4. **`hreflang` recíproco** em cada versão — para o Google indexar corretamente

> **Híbrido prático:** se a estrutura do projeto estático não permitir subdiretórios reais (sem servidor), pode-se usar a abordagem pura de `data-i18n` com detecção por `localStorage` + `navigator.language`, e adicionar `hreflang` apontando para a mesma página com `?lang=pt`. Para SEO máximo, o ideal é servir duas URLs distintas — o que é trivial em qualquer host estático (Netlify, Vercel, GitHub Pages com cópia do `index.html` em `/pt/`).

**Justificativa da rejeição das outras:**
- **Abordagem A** é viável mas a duplicação de ~1598 linhas de HTML é um pesadelo de manutenção — qualquer ajuste de layout precisaria ser feito duas vezes.
- **Abordagem C** traz 14 KB de bundle e uma dependência npm para um projeto que hoje não tem `package.json`. É poder de sobra para uma necessidade simples (2 idiomas, sem pluralização complexa).

---

## 6. Estrutura de Arquivos Recomendada

```
NF-web/
├── index.html                  ← HTML único com data-i18n nos elementos
├── locales/
│   ├── en.json                 ← textos em inglês (idioma padrão)
│   └── pt.json                 ← textos em português
├── assets/
│   ├── js/
│   │   └── i18n.js             ← loader vanilla (~40 linhas)
│   ├── css/
│   └── ...                     ← (estrutura atual mantida)
└── pt/                         ← (opcional, para SEO com subdiretório)
    └── index.html              ← cópia do index.html (mesmo HTML, só para URL /pt/)
```

### Organização do JSON por namespace/seção

Agrupar por **seção da página** (não por página, já que é single-page), com aninhamento de 2-3 níveis:

```json
// locales/en.json
{
  "meta": {
    "title": "Naélio Freires — Front-end Developer",
    "description": "Portfolio of a front-end developer with 6+ years of experience."
  },
  "nav": {
    "about": "About",
    "expertise": "Expertise",
    "work": "Work",
    "contact": "Contact"
  },
  "hero": {
    "name": "NAÉLIO FREIRES",
    "role": "Front-end Developer",
    "intro": "I'm a front-end developer with 6+ years of experience. I build web and mobile apps that are fast, clean, and easy to use.",
    "availableBadge": "Available for new projects",
    "viewPortfolio": "View Portfolio",
    "downloadResume": "Download resume PDF"
  },
  "expertise": {
    "heading": "What I Do",
    "subheading": "Specialized services tailored to elevate your digital presence.",
    "items": {
      "branding": {
        "title": "Visual Identity",
        "desc": "Comprehensive branding solutions including logo design, visual systems, and brand guidelines."
      },
      "web": {
        "title": "Websites & Stores",
        "desc": "High-performance websites and e-commerce stores designed for optimal user experience and conversion."
      },
      "seo": {
        "title": "SEO Optimization",
        "desc": "Strategic SEO optimization to improve visibility, search rankings, and drive organic traffic growth."
      }
    }
  },
  "trajectory": {
    "heading": "Career trajectory",
    "subheading": "Professional experience",
    "pathOverview": "Path overview"
  },
  "experience": {
    "nexla": {
      "role": "Front-end Developer",
      "period": "2023 — Present",
      "bullets": ["...", "..."]
    },
    "koombea": { "role": "...", "period": "...", "bullets": ["..."] },
    "heavyconnect": { "role": "...", "period": "...", "bullets": ["..."] },
    "esportudo": { "role": "...", "period": "...", "bullets": ["..."] }
  },
  "work": {
    "heading": "Selected Projects",
    "subheading": "A collection of digital products, brands, and experiences I've had the pleasure of building.",
    "viewArchive": "View Archive"
  },
  "contact": {
    "cta": "Let's work together",
    "whatsapp": "Open WhatsApp",
    "email": "Send email"
  },
  "footer": {
    "designedIn": "Designed in California",
    "rights": "All rights reserved"
  }
}
```

---

## 7. Padrões de Organização de Textos

### Convenção de chaves

- ✅ **Semânticas**: `nav.about`, `hero.intro`, `experience.nexla.role` — não `nav.btn1`, `text_3`
- ✅ **Aninhadas 2-3 níveis**: `seção.subseção.chave` (ex.: `expertise.items.branding.title`)
- ✅ **Agrupadas por seção/feature**, não por página
- ✅ **camelCase** para chaves: `downloadResume`, `viewPortfolio`
- 🔴 **Nunca** colocar pontos dentro do nome da chave (`hero.title.main` é OK; `"hero.title"` como chave única não é)
- 🔴 **Nunca** concatenar strings: `"Bem-vindo, " + nome + "!"` quebra em idiomas com ordem diferente de palavras. Use interpolação: `"Bem-vindo, {{name}}!"`

### Interpolação (para textos dinâmicos)

Adicione suporte simples no loader:
```js
// substitui {{name}} pelo valor
const interpolate = (str, vars) => str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
el.textContent = interpolate(value, { name: 'Naélio' });
```

### Fallback de locale

- Detectar idioma do navegador (`navigator.language`)
- Se começar com `pt` → `pt.json`; senão → `en.json`
- Se uma chave faltar no JSON do idioma ativo, cair para o inglês (idioma padrão)
- Persistir escolha do usuário em `localStorage`

### Datas, números e moeda — use `Intl.*` nativo (2026)

Em 2026, todos os browsers evergreen suportam nativamente (sem polyfill):

```js
// Data formatada por locale
new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date());
// → "7 de julho de 2026"

// Número/moeda
new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(1234.56);
// → "R$ 1.234,56"

// Tempo relativo ("há 2 dias")
new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(-2, 'day');
// → "2 dias atrás"
```

No NF-web atualmente as datas aparecem como `2023 — Present` — ao internacionalizar, formatar conforme o locale (`2023 — Presente` ou `2023 — Atual`).

### Pluralização (caso aplicável no futuro)

Para 2 idiomas (EN/PT) a regra é simples (one/other), mas se expandir para árabe, russo ou polonês, use ICU MessageFormat:
```
{count, plural, one {# item} other {# items}}
```

---

## 8. SEO Multilíngue

### Estrutura de URL — subdiretório recomendado

| Estrutura | Exemplo | Recomendação |
|---|---|---|
| **Subdiretório** ⭐ | `example.com/` (EN), `example.com/pt/` (PT) | 🟢 Recomendado — consolida autoridade do domínio, fácil de gerenciar |
| Subdomínio | `pt.example.com` | 🟡 Divide autoridade do domínio |
| Query param | `?lang=pt` | 🔴 Evitar — sinal geo fraco, ruim para compartilhamento/cache |
| ccTLD | `example.pt` | 🔴 Caro e complexo, desnecessário para um portfolio |

### `hreflang` — recíproco e auto-referencial

Cada versão deve referenciar **todas as outras (inclusive a si mesma)**. Colocar no `<head>`:

```html
<!-- Na versão EN (index.html na raiz) -->
<link rel="alternate" hreflang="en" href="https://naeliofreires.com/" />
<link rel="alternate" hreflang="pt" href="https://naeliofreires.com/pt/" />
<link rel="alternate" hreflang="x-default" href="https://naeliofreires.com/" />

<!-- Na versão PT (index.html em /pt/) -->
<link rel="alternate" hreflang="en" href="https://naeliofreires.com/" />
<link rel="alternate" hreflang="pt" href="https://naeliofreires.com/pt/" />
<link rel="alternate" hreflang="x-default" href="https://naeliofreires.com/" />
```

- **`x-default`** obrigatório — aponta para a versão exibida quando o locale do visitante não corresponde a nenhum dos declarados
- Combinar com `<link rel="canonical" href="...">` auto-referencial em cada versão

### `<html lang>` correto por versão

- `<html lang="en">` na versão raiz
- `<html lang="pt-BR">` na versão `/pt/` (ou `pt` se preferir só idioma)
- O loader `data-i18n` deve atualizar `document.documentElement.lang` ao trocar de idioma

### Caso use só a abordagem `data-i18n` (sem subdiretórios)

Sem URLs distintas, o `hreflang` perde eficácia. Para SEO máximo, **prefira os subdiretórios**. Se não for possível, no mínimo:
- Sirva o HTML inicial já no idioma correto no servidor (via detecção de `Accept-Language` no Netlify/Vercel)
- Ou aceite o trade-off: portfolio pessoal tem SEO menos crítico que e-commerce

---

## 9. Roteiro de Implementação (aplicado ao NF-web)

### Passo 1 — Extrair textos do `index.html`
- Mapear todos os text nodes e `aria-label`s visíveis
- Substituir cada um por `data-i18n="chave.correspondente"`
- Manter o texto inglês atual como valor inicial em `locales/en.json`
- Exemplos a extrair: hero (`NAÉLIO FREIRES`, intro, badge), nav (`About`, `Work`, `Contact`), seções (`What I Do`, `Selected Projects`), cards de experiência (4 empresas), footer

### Passo 2 — Criar os arquivos JSON
- `locales/en.json` com a estrutura por seção (item 6)
- `locales/pt.json` com as traduções (usar o currículo `Naelio Freires - PT_BR.pdf` como referência de terminologia)

### Passo 3 — Escrever o loader `assets/js/i18n.js`
- ~40 linhas (exemplo no item 3, Abordagem B)
- Carregar JSON via `fetch`, preencher `[data-i18n]` e `[data-i18n-attr]`
- Atualizar `document.documentElement.lang`
- Detectar idioma inicial (`localStorage` → `navigator.language` → padrão `en`)

### Passo 4 — Adicionar language switcher na UI
- Botão/toggle no `<nav>`: `EN | PT`
- Ao clicar: `loadLang('pt')`, salvar em `localStorage`, atualizar UI ativa

### Passo 5 — Mitigar FOUC (flash of conteúdo untranslated)
- Script inline blocking no `<head>` que define o idioma antes do render:
```html
<script>
  document.documentElement.lang = localStorage.getItem('lang') || 
    (navigator.language.startsWith('pt') ? 'pt' : 'en');
</script>
```

### Passo 6 — Configurar SEO (se usar subdiretórios)
- Criar `/pt/index.html` (cópiado do `index.html` raiz)
- Adicionar `hreflang` recíproco + `x-default` em ambos
- Garantir `<html lang>` correto em cada versão
- Atualizar `sitemap.xml` com ambas as URLs

### Passo 7 — Corrigir inconsistência do `design-system.html`
- Atualizar `lang="pt-BR"` para `lang="en"` (ou remover o arquivo se não for usado em produção)

### Passo 8 — Validar
- Conferir que todas as chaves existem nos dois JSONs (script simples de diff)
- Testar troca de idioma em produção
- Validar `hreflang` no [Aleyda Solis's hreflang checker](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)

---

## 10. Referências

### Padrões e formatos
- [Google Search Central — Localized versions of your pages (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google Search Central — Consolidate duplicate URLs (canonical)](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Phrase — A Practical Guide to ICU Message Format](https://phrase.com/blog/posts/guide-to-the-icu-message-format/)
- [Unicode.org — ICU Formatting Messages](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

### Organização de chaves e arquivos
- [Lokalise — Translation Key Naming Conventions](https://lokalise.com/blog/translation-keys-naming-and-organizing/)
- [Locize — Guide to i18n Key Naming](https://www.locize.com/blog/guide-to-i18n-key-naming)
- [Tolgee — Naming Translation Keys](https://tolgee.io/blog/naming-translation-keys)
- [better-i18n — JSON Translation Files](https://better-i18n.com/en/blog/json-translation-files/)

### SEO multilíngue
- [Weglot — Subdirectory vs Subdomain](https://www.weglot.com/guides/subdirectory-vs-subdomain)
- [SEO Sherpa — Hreflang Tags Guide](https://seosherpa.com/hreflang-tags-international-seo/)
- [WooRank — International SEO Site Structure](https://www.woorank.com/en/edu/seo-guides/international-seo-site-structure)

### APIs Intl nativas
- [MDN — Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [MDN — Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN — Intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)
- [MDN — Intl.PluralRules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)

### Boas práticas e anti-padrões
- [Shopify Engineering — i18n Best Practices for Front-End Developers](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers)
- [Phrase — 10 Common Localization Mistakes](https://phrase.com/blog/posts/10-common-mistakes-in-software-localization/)
- [Julia Díez — Avoid String Concatenation](https://www.juliadiezlopez.com/blog/avoid-string-concatenation-a-must-for-i18n-friendly-code)
- [SimpleLocalize — Technical Guide to i18n](https://simplelocalize.io/blog/posts/internationalization-guide-software-localization/)

### Bibliotecas (referência, não adotadas para o NF-web)
- [i18next](https://www.i18next.com/) — vanilla JS, feature-rich
- [next-intl](https://next-intl.dev/docs/getting-started) — para Next.js App Router
- [FormatJS / react-intl](https://formatjs.github.io/docs/react-intl/) — ICU MessageFormat
- [Lingui](https://lingui.dev/) — macros, compile-time
- [Paraglide](https://inlang.com/m/gerre34r/library-paraglide) — codegen, type-safe

### Tooling (útil se o projeto crescer)
- [i18n-ally (VS Code)](https://github.com/lokalise/i18n-ally) — inline annotations, missing key detection
- [inlang](https://inlang.com/) — ecossistema de tooling i18n

---

*Documento gerado em julho de 2026. Decisões baseadas no estado atual do NF-web (site estático HTML/CSS/JS, 2 idiomas PT+EN, sem build step).*
