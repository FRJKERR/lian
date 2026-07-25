/* ============================================================
   lian-nav.js · Navegación flotante para páginas largas
   - Botón "↑ volver arriba" (aparece al bajar).
   - Índice flotante (reusa las secciones de la página) con
     resaltado de la sección actual (scrollspy).
   Se enlaza al final del <body>. Solo en páginas legacy largas.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Volver arriba ---- */
  var top = document.createElement("button");
  top.id = "lian-top";
  top.type = "button";
  top.title = "Volver arriba";
  top.setAttribute("aria-label", "Volver arriba");
  top.textContent = "↑";
  document.body.appendChild(top);
  top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", function () {
    top.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  /* ---- Índice flotante ---- */
  var links = [];
  var srcToc = document.querySelector("nav.toc");
  if (srcToc) {
    links = Array.prototype.slice.call(srcToc.querySelectorAll('a[href^="#"]'))
      .map(function (a) { return { href: a.getAttribute("href"), text: a.textContent.trim() }; });
  }
  if (!links.length) {
    links = Array.prototype.slice.call(document.querySelectorAll("section.section[id]"))
      .map(function (s) {
        var h = s.querySelector("h2");
        return { href: "#" + s.id, text: h ? h.textContent.trim() : s.id };
      });
  }
  if (!links.length) return;

  var btn = document.createElement("button");
  btn.id = "lian-toc-btn";
  btn.type = "button";
  btn.innerHTML = "☰ Índice";

  var panel = document.createElement("nav");
  panel.id = "lian-toc";
  panel.setAttribute("aria-label", "Índice de contenido");
  panel.innerHTML = '<div class="lt-h">Contenido</div>' +
    links.map(function (l) { return '<a href="' + l.href + '">' + l.text + "</a>"; }).join("");

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener("click", function () {
    panel.classList.toggle("open");
    btn.classList.toggle("active");
  });
  panel.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { panel.classList.remove("open"); btn.classList.remove("active"); }
  });

  /* ---- Scrollspy ---- */
  var targets = links.map(function (l) { return document.getElementById(l.href.slice(1)); }).filter(Boolean);
  function spy() {
    var y = window.scrollY + 130, cur = null;
    targets.forEach(function (t) { if (t.offsetTop <= y) cur = t.id; });
    var anchors = panel.querySelectorAll("a");
    Array.prototype.forEach.call(anchors, function (a) {
      a.classList.toggle("cur", a.getAttribute("href") === "#" + cur);
    });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();
})();
