/**
 * Plugin Vite que torna o CSS do Tailwind v4 compatível com WebViews antigos
 * (Android 5+ com Android System WebView a partir do Chrome ~61).
 *
 * O Tailwind v4 gera CSS moderno que o Chrome antigo descarta por completo:
 *  - @layer (Chrome 99+)            -> achatado com ajuste de especificidade
 *  - :where()/:is() (Chrome 88+)    -> expandidos em seletores simples
 *  - oklch()/nesting (Chrome 111+)  -> convertidos para rgb() pelo Lightning CSS
 *  - translate/scale/rotate (104+)  -> convertidos para `transform`
 *  - @property (Chrome 85+)         -> valores iniciais aplicados sempre
 */
import type { Plugin } from 'vite';
import postcss, { type Root } from 'postcss';
import cascadeLayers from '@csstools/postcss-cascade-layers';
import selectorParser from 'postcss-selector-parser';
import { transform } from 'lightningcss';

const CHROME_TARGET = 61;

/** Expande :where(a, b) / :is(a, b) em seletores separados sem pseudo-classe. */
function expandSelector(selector: string): string[] {
  let results = [selector];
  for (let guard = 0; guard < 20; guard++) {
    let changed = false;
    const next: string[] = [];
    for (const sel of results) {
      let expanded: string[] | null = null;
      selectorParser((root) => {
        let target: selectorParser.Pseudo | null = null;
        root.walkPseudos((p) => {
          if (!target && (p.value === ':where' || p.value === ':is')) target = p;
        });
        if (!target) return;
        const pseudo = target as selectorParser.Pseudo;
        const options = pseudo.nodes.map((n) => n.toString().trim());
        expanded = options.map((opt) => {
          const clone = root.clone() as selectorParser.Root;
          let replaced = false;
          clone.walkPseudos((p) => {
            if (!replaced && (p.value === ':where' || p.value === ':is') && p.toString() === pseudo.toString()) {
              p.replaceWith(selectorParser.string({ value: opt }));
              replaced = true;
            }
          });
          return clone.toString();
        });
      }).processSync(sel);
      if (expanded) {
        changed = true;
        next.push(...(expanded as string[]));
      } else {
        next.push(sel);
      }
    }
    results = next;
    if (!changed) break;
  }
  return results;
}

function legacySelectors(root: Root) {
  root.walkRules((rule) => {
    if (!/:where\(|:is\(/.test(rule.selector)) return;
    const sels = rule.selectors.flatMap(expandSelector);
    rule.selectors = Array.from(new Set(sels));
  });
}

/** Valores iniciais do Tailwind (fallback do @property) aplicados sem condição. */
function unconditionalPropertyDefaults(root: Root) {
  root.walkAtRules('supports', (at) => {
    if (at.params.includes('margin-trim')) at.replaceWith(at.nodes ?? []);
  });
}

const TRANSFORM =
  'translate(var(--tw-translate-x,0),var(--tw-translate-y,0)) rotate(var(--tw-rotate-z,0deg)) scale(var(--tw-scale-x,1),var(--tw-scale-y,1))';

/** translate/scale/rotate individuais -> transform (suportado desde sempre). */
function legacyTransforms(root: Root) {
  root.walkDecls((decl) => {
    // scale(110%) só funciona em Chrome recente: usa número (1.1)
    if (/^--tw-scale-[xyz]$/.test(decl.prop)) {
      const m = decl.value.match(/^(-?[\d.]+)%$/);
      if (m) decl.value = String(parseFloat(m[1]) / 100);
      return;
    }
    if (decl.prop === 'translate' || decl.prop === 'scale') {
      decl.prop = 'transform';
      decl.value = TRANSFORM;
    } else if (decl.prop === 'rotate' && !decl.value.includes('var(')) {
      decl.cloneBefore({ prop: '--tw-rotate-z', value: decl.value });
      decl.prop = 'transform';
      decl.value = TRANSFORM;
    }
  });
}

export async function makeLegacyCss(css: string): Promise<string> {
  const result = await postcss([
    cascadeLayers(),
    { postcssPlugin: 'legacy-selectors', Once: legacySelectors },
    { postcssPlugin: 'legacy-property-defaults', Once: unconditionalPropertyDefaults },
    { postcssPlugin: 'legacy-transforms', Once: legacyTransforms },
  ]).process(css, { from: undefined });

  const out = transform({
    filename: 'style.css',
    code: Buffer.from(result.css),
    minify: true,
    targets: { chrome: CHROME_TARGET << 16, android: CHROME_TARGET << 16 },
  });
  return out.code.toString();
}

export function legacyCss(): Plugin {
  return {
    name: 'vida-financeira-legacy-css',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_opts, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.css')) {
          const source = typeof file.source === 'string' ? file.source : Buffer.from(file.source).toString();
          file.source = await makeLegacyCss(source);
        }
      }
    },
  };
}
