import { useEffect } from 'react';

/**
 * Reusable SEO component for managing route-specific meta tags,
 * canonical URLs, Open Graph / Twitter tags, and Schema.org JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://iic.mnnit.ac.in/renaissance-logo.png',
  robots = 'index, follow',
  jsonLd = null,
}) {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title;
      setMetaTag('name', 'title', title);
    }

    // 2. Meta Description
    if (description) {
      setMetaTag('name', 'description', description);
    }

    // 3. Robots
    if (robots) {
      setMetaTag('name', 'robots', robots);
    }

    // 4. Canonical Link
    if (canonical) {
      setCanonical(canonical);
    }

    // 5. Open Graph
    if (title) setMetaTag('property', 'og:title', title);
    if (description) setMetaTag('property', 'og:description', description);
    if (canonical) setMetaTag('property', 'og:url', canonical);
    if (ogType) setMetaTag('property', 'og:type', ogType);
    if (ogImage) setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', "IIC MNNIT Allahabad");

    // 6. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    if (title) setMetaTag('name', 'twitter:title', title);
    if (description) setMetaTag('name', 'twitter:description', description);
    if (canonical) setMetaTag('name', 'twitter:url', canonical);
    if (ogImage) setMetaTag('name', 'twitter:image', ogImage);

    // 7. Structured Data (JSON-LD)
    let scriptTag = document.getElementById('route-jsonld');
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'route-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup on unmount if necessary
    };
  }, [title, description, canonical, ogType, ogImage, robots, jsonLd]);

  return null;
}

function setMetaTag(attrName, attrVal, content) {
  if (!content) return;
  let element = document.head.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}
