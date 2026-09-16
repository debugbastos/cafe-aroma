// =========================================================
// CAFÉ AROMA — interações
// 1) trilha de gotejamento acompanha o progresso do scroll
// 2) badge de estágio mostra em qual etapa da extração você está
// 3) elementos entram suavemente conforme aparecem na tela
// =========================================================

(function () {
    "use strict";

    var dripFill = document.getElementById("dripFill");
    var dripDrop = document.getElementById("dripDrop");
    var stageBadge = document.getElementById("stageBadge");
    var ticks = Array.prototype.slice.call(document.querySelectorAll(".drip-tick"));

    var stageInfo = {
        historia: { time: "00:00", name: "Infusão" },
        experiencia: { time: "00:45", name: "Despejo" },
        universo: { time: "02:30", name: "Extração" },
        contato: { time: "04:00", name: "Xícara" }
    };

    // ---- progresso do scroll na trilha ----
    function updateRail() {
        var doc = document.documentElement;
        var scrollTop = window.scrollY || doc.scrollTop;
        var docHeight = doc.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
        var pct = progress * 100;

        if (dripFill) dripFill.style.height = pct + "%";
        if (dripDrop) dripDrop.style.top = pct + "%";

        if (stageBadge) {
            if (scrollTop > 80) {
                stageBadge.classList.add("visible");
            } else {
                stageBadge.classList.remove("visible");
            }
        }
    }

    window.addEventListener("scroll", updateRail, { passive: true });
    window.addEventListener("resize", updateRail);
    updateRail();

    // ---- observador de seções para marcar o estágio ativo ----
    var sectionIds = ["historia", "experiencia", "universo", "contato"];
    var sections = sectionIds
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        var sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.id;
                    var info = stageInfo[id];
                    if (!info) return;

                    if (stageBadge) {
                        stageBadge.querySelector(".stage-time").textContent = info.time;
                        stageBadge.querySelector(".stage-name").textContent = info.name;
                    }

                    ticks.forEach(function (tick) {
                        tick.classList.toggle("active", tick.getAttribute("data-section") === id);
                    });
                });
            },
            { threshold: 0.35 }
        );

        sections.forEach(function (section) { sectionObserver.observe(section); });
    }

    // ---- revelação suave dos blocos de conteúdo ----
    var revealTargets = document.querySelectorAll(
        ".history-grid, .experience-item, .gallery, .step, .receipt, .numbers"
    );

    revealTargets.forEach(function (el) { el.classList.add("reveal"); });

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealTargets.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealTargets.forEach(function (el) { el.classList.add("in-view"); });
    }
})();