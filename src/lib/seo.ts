interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const setSEO = ({
  title = "My App",
  description = "Default description",
  keywords = "default, keywords",
  author = "Your Name",
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: SEOProps) => {
  if (typeof document === "undefined") return; // SSR safe

  document.title = title;

  const setMeta = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const setOgMeta = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  setMeta("description", description);
  setMeta("keywords", keywords);
  setMeta("author", author);

  setOgMeta("og:title", ogTitle || title);
  setOgMeta("og:description", ogDescription || description);
  setOgMeta("og:image", ogImage || "");
  setOgMeta("og:url", ogUrl || window.location.href);
};
