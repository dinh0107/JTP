function part(tag, markup, src) {
  markup = markup.replace(/^\s*-->\s*/, "").replace(/\s*<!--\s*$/, "");
  var node = new DOMParser().parseFromString(markup, "text/html").querySelector("header, footer");
  node.querySelectorAll("[src], [href]").forEach(function (el) {
    ["src", "href"].forEach(function (name) {
      var url = el.getAttribute(name);
      if (!url || /^(?:[a-z][a-z0-9+.-]*:|#)/i.test(url)) return;
      el.setAttribute(name, new URL(url, src).href);
    });
  });
  customElements.define(tag, class extends HTMLElement {
    connectedCallback() {
      if (this.firstElementChild) return;
      this.append(node.cloneNode(true));
    }
  });
}

var dir = new URL("./", document.currentScript.src);
document.write('<script src="' + new URL("header.html?v=links2", dir).href + '"><\/script>');
document.write('<script src="' + new URL("footer.html?v=links2", dir).href + '"><\/script>');
