import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Target dist directory can be passed as argument (e.g., node scripts/generate-seo-pages.mjs dist)
const targetDistArg = process.argv[2];
const targetDist = targetDistArg
  ? path.resolve(process.cwd(), targetDistArg)
  : (fs.existsSync(path.resolve(process.cwd(), 'dist'))
      ? path.resolve(process.cwd(), 'dist')
      : (fs.existsSync(path.join(repoRoot, 'frontend', 'dist'))
          ? path.join(repoRoot, 'frontend', 'dist')
          : path.join(repoRoot, 'RENAISSANCE-ECELL-2026', 'client', 'dist')));

if (!fs.existsSync(targetDist)) {
  console.error(`[SEO Generator] Target dist directory not found: ${targetDist}`);
  process.exit(1);
}

const baseIndexPath = path.join(targetDist, 'index.html');
if (!fs.existsSync(baseIndexPath)) {
  console.error(`[SEO Generator] base index.html not found at: ${baseIndexPath}`);
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseIndexPath, 'utf8');

const GOOGLE_VERIFICATION_TAG = '<meta name="google-site-verification" content="p3iMQfrK357LZkKzOHzMnfRBO6XF37HLsyDVCs3vPIU" />';

const ROUTES_CONFIG = [
  {
    path: '',
    title: "IIC MNNIT Allahabad | Innovation & Entrepreneurship",
    description: "Official Portal of Institution's Innovation Council (IIC) & E-Cell MNNIT Allahabad. Fostering student innovations, entrepreneurship, startups, and hosting flagship summits Renaissance and Udbhav.",
    canonical: "https://iic.mnnit.ac.in/",
    ogImage: "https://iic.mnnit.ac.in/renaissance-logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollegeOrUniversity",
          "@id": "https://iic.mnnit.ac.in/#institution",
          "name": "Motilal Nehru National Institute of Technology Allahabad",
          "alternateName": "MNNIT Allahabad",
          "url": "http://www.mnnit.ac.in",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Barrister Mullah Colony, Teliarganj",
            "addressLocality": "Prayagraj",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "211004",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "Organization",
          "@id": "https://iic.mnnit.ac.in/#organization",
          "name": "Institution's Innovation Council, MNNIT Allahabad",
          "alternateName": "IIC MNNIT",
          "url": "https://iic.mnnit.ac.in",
          "logo": "https://iic.mnnit.ac.in/renaissance-logo.png",
          "parentOrganization": {
            "@id": "https://iic.mnnit.ac.in/#institution"
          },
          "sameAs": [
            "https://www.instagram.com/iic_mnnit/",
            "https://www.linkedin.com/company/iic-mnnit/"
          ]
        }
      ]
    },
    prerenderContent: `
      <header>
        <h1>Institution's Innovation Council (IIC) — MNNIT Allahabad</h1>
        <p>Nurturing ideas, fostering entrepreneurs, and building the future of technology at Motilal Nehru National Institute of Technology Allahabad.</p>
      </header>
      <main>
        <section>
          <h2>Flagship Initiatives</h2>
          <ul>
            <li><a href="/renaissance">Renaissance — Annual Entrepreneurship Summit of MNNIT Allahabad</a></li>
            <li><a href="/udbhav">Udbhav — Premier Entrepreneurship & Financial Literacy Summit</a></li>
            <li><a href="https://www.ted.com/tedx/events/63792" rel="noopener">TEDx MNNIT</a></li>
          </ul>
        </section>
        <section>
          <h2>About IIC</h2>
          <p>Established under the mandate of Ministry of Education's Innovation Cell (MIC) to systematically foster innovation and startup culture across engineering, deep tech, and management.</p>
        </section>
      </main>
    `
  },
  {
    path: 'udbhav',
    title: "Udbhav | IIC MNNIT Allahabad",
    description: "Udbhav is the premier annual entrepreneurship and financial literacy summit organized by Institution's Innovation Council (IIC) MNNIT Allahabad.",
    canonical: "https://iic.mnnit.ac.in/udbhav",
    ogImage: "https://iic.mnnit.ac.in/renaissance-logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Udbhav - Annual Entrepreneurship & Financial Literacy Summit",
      "description": "The flagship entrepreneurship and financial literacy summit of MNNIT Allahabad organized by Institution's Innovation Council (IIC).",
      "url": "https://iic.mnnit.ac.in/udbhav",
      "image": "https://iic.mnnit.ac.in/renaissance-logo.png",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "organizer": {
        "@type": "Organization",
        "name": "Institution's Innovation Council, MNNIT Allahabad",
        "url": "https://iic.mnnit.ac.in"
      },
      "location": {
        "@type": "Place",
        "name": "MNNIT Allahabad",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Barrister Mullah Colony, Teliarganj",
          "addressLocality": "Prayagraj",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "211004",
          "addressCountry": "IN"
        }
      }
    },
    prerenderContent: `
      <header>
        <h1>Udbhav — Think • Thrive • Triumph</h1>
        <p>The Annual Entrepreneurship & Financial Literacy Summit of MNNIT Allahabad, organized by Institution's Innovation Council.</p>
      </header>
      <main>
        <section>
          <h2>Summit Highlights & Competitions</h2>
          <ul>
            <li><a href="/udbhav/events">Explore Events & Competitions</a></li>
            <li><a href="/udbhav/sponsors">Partners & Sponsors</a></li>
            <li><a href="/udbhav/teams">Organizing Committee</a></li>
            <li><a href="/udbhav/gallery">Gallery & Memories</a></li>
          </ul>
        </section>
      </main>
    `
  },
  {
    path: 'renaissance',
    title: "Renaissance'26 | 10th Edition • E-Cell MNNIT Allahabad",
    description: "Official website of Renaissance'26, the 10th edition of annual entrepreneurship summit organized by E-Cell MNNIT Allahabad. Register for startup competitions, workshops, and speaker sessions.",
    canonical: "https://iic.mnnit.ac.in/renaissance",
    ogImage: "https://iic.mnnit.ac.in/renaissance-logo.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "Renaissance'26 - 10th Edition",
      "description": "Annual Entrepreneurship Summit of MNNIT Allahabad organized by E-Cell.",
      "url": "https://iic.mnnit.ac.in/renaissance",
      "image": "https://iic.mnnit.ac.in/renaissance-logo.png",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "organizer": {
        "@type": "Organization",
        "name": "E-Cell MNNIT Allahabad",
        "url": "https://iic.mnnit.ac.in/renaissance"
      },
      "location": {
        "@type": "Place",
        "name": "MNNIT Allahabad",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Barrister Mullah Colony, Teliarganj",
          "addressLocality": "Prayagraj",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "211004",
          "addressCountry": "IN"
        }
      }
    },
    prerenderContent: `
      <header>
        <h1>Renaissance'26 — 10th Edition Annual Entrepreneurship Summit</h1>
        <p>The Flagship E-Summit of MNNIT Allahabad, organized by Entrepreneurship Cell (E-Cell).</p>
      </header>
      <main>
        <section>
          <h2>Flagship Competitions & Activities</h2>
          <ul>
            <li><a href="/renaissance/events">Events: B-Plan (Fish Tank), Strategy Wiz, Biz-Wars, Creative Quest</a></li>
            <li><a href="/renaissance/register">Event Registration</a></li>
            <li><a href="/renaissance/campus-ambassador">Campus Ambassador Program</a></li>
            <li><a href="/renaissance/tickets-accommodation">Tickets & Campus Accommodation</a></li>
            <li><a href="/renaissance/teams">E-Cell Organizing Team</a></li>
            <li><a href="/renaissance/sponsors">Partners & Sponsors</a></li>
          </ul>
        </section>
      </main>
    `
  }
];

function replaceMetaTag(html, attr, attrVal, newContent) {
  const pattern = new RegExp(`<meta\\s+${attr}=["']${attrVal}["']\\s+content=(?:"[^"]*"|'[^']*')\\s*\\/?>`, 'i');
  const replacement = `<meta ${attr}="${attrVal}" content="${escapeHtml(newContent)}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace('</head>', `  ${replacement}\n</head>`);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateHtmlForRoute(base, config) {
  let html = base;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${config.title}</title>`);
  html = replaceMetaTag(html, 'name', 'title', config.title);

  // Replace Description
  html = replaceMetaTag(html, 'name', 'description', config.description);

  // Replace Canonical Link
  const canonicalPattern = /<link\s+rel=["']canonical["']\s+href=(?:"[^"]*"|'[^']*')\s*\/?>/i;
  const canonicalTag = `<link rel="canonical" href="${config.canonical}" />`;
  if (canonicalPattern.test(html)) {
    html = html.replace(canonicalPattern, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // Replace Open Graph Tags
  html = replaceMetaTag(html, 'property', 'og:title', config.title);
  html = replaceMetaTag(html, 'property', 'og:description', config.description);
  html = replaceMetaTag(html, 'property', 'og:url', config.canonical);
  if (config.ogImage) {
    html = replaceMetaTag(html, 'property', 'og:image', config.ogImage);
  }

  // Replace Twitter Tags
  html = replaceMetaTag(html, 'name', 'twitter:title', config.title);
  html = replaceMetaTag(html, 'name', 'twitter:description', config.description);
  html = replaceMetaTag(html, 'name', 'twitter:url', config.canonical);
  if (config.ogImage) {
    html = replaceMetaTag(html, 'name', 'twitter:image', config.ogImage);
  }

  // Ensure Google site verification tag is present exactly once
  if (!html.includes('google-site-verification')) {
    html = html.replace('</head>', `  ${GOOGLE_VERIFICATION_TAG}\n</head>`);
  }

  // Replace Schema.org JSON-LD
  const jsonLdString = JSON.stringify(config.jsonLd, null, 2);
  const jsonLdTag = `<script type="application/ld+json">\n${jsonLdString}\n  </script>`;
  if (/<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, jsonLdTag);
  } else {
    html = html.replace('</head>', `  ${jsonLdTag}\n</head>`);
  }

  // Inject prerendered fallback text inside <div id="root"></div> for crawlers
  if (config.prerenderContent) {
    const rootPattern = /<div\s+id=["']root["']>[\s\S]*?<\/div>/i;
    const accessibleContent = `<div id="root"><noscript><div style="padding:20px;max-width:960px;margin:auto;">${config.prerenderContent}</div></noscript></div>`;
    html = html.replace(rootPattern, accessibleContent);
  }

  return html;
}

console.log(`[SEO Generator] Generating static SEO HTML pages in: ${targetDist}`);

for (const route of ROUTES_CONFIG) {
  const rendered = generateHtmlForRoute(baseHtml, route);
  if (!route.path) {
    // Root index.html
    fs.writeFileSync(baseIndexPath, rendered, 'utf8');
    console.log(`✓ Updated root: ${baseIndexPath}`);
  } else {
    const routeDir = path.join(targetDist, route.path);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    const routeFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(routeFilePath, rendered, 'utf8');

    // Also write [route].html so Nginx $uri checks match directly without trailing slash redirects
    const flatFilePath = path.join(targetDist, `${route.path}.html`);
    fs.writeFileSync(flatFilePath, rendered, 'utf8');

    console.log(`✓ Generated route page: ${routeFilePath} and ${flatFilePath}`);
  }
}

console.log(`[SEO Generator] Static pre-rendered landing pages created successfully.`);
