(function () {
    "use strict";

    var nav = document.querySelector(".site-nav");
    var navLinks = document.querySelector(".site-nav__links");
    var toggle = document.querySelector(".nav-toggle");
    var sections = document.querySelectorAll("section[id]");
    var navAnchors = document.querySelectorAll('.site-nav__links a[href^="#"]');

    function closeMobileNav() {
        if (navLinks) navLinks.classList.remove("is-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    if (toggle && navLinks) {
        toggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        navLinks.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                closeMobileNav();
            });
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMobileNav();
    });

    /* Smooth scroll: native CSS handles most; ensure offset for fixed nav */
    navAnchors.forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var id = anchor.getAttribute("href");
            if (!id || id === "#") return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    /* Active nav link on scroll */
    function updateActiveNav() {
        var navHeight = nav ? nav.offsetHeight : 56;
        var scrollPos = window.scrollY + navHeight + 24;
        var current = "";

        sections.forEach(function (section) {
            var top = section.offsetTop;
            if (scrollPos >= top) current = section.getAttribute("id") || "";
        });

        navAnchors.forEach(function (a) {
            var href = a.getAttribute("href");
            if (href === "#" + current) {
                a.classList.add("is-active");
            } else {
                a.classList.remove("is-active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    /* Skill filter */
    var filters = document.querySelectorAll(".skill-filter");
    var skillGroups = document.querySelectorAll(".skill-group");

    filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var cat = btn.getAttribute("data-filter");
            filters.forEach(function (b) {
                b.classList.toggle("is-active", b === btn);
            });
            skillGroups.forEach(function (g) {
                var gcat = g.getAttribute("data-category");
                if (cat === "all" || gcat === cat) {
                    g.classList.remove("is-hidden");
                } else {
                    g.classList.add("is-hidden");
                }
            });
        });
    });

    /* Scroll reveal */
    var prefersReduced =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealEls = document.querySelectorAll(".reveal");

    if (!prefersReduced && revealEls.length && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            },
            { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
        revealEls.forEach(function (el) {
            io.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }


    /* visit counter*/
    (async function(){
        var namespace = "haojian-wang-site-2026";
        var today = new Date().toISOString().split("T")[0];

        try {
            var results = await Promise.all([
                fetch("https://api.countapi.xyz/hit/" + namespace + "/total-visits").then(function (r) { return r.json(); }),
                fetch("https://api.countapi.xyz/hit/" + namespace + "/daily-" + today).then(function (r) { return r.json(); })
            ]);

            var totalEl = document.getElementById("total-count");
            var dailyEl = document.getElementById("daily-count");

            if (totalEl) totalEl.textContent = (results[0].value || 0).toLocaleString();
            if (dailyEl) dailyEl.textContent = (results[1].value || 0).toLocaleString();
        
        } catch (err) {
            console.warn("Counter fail to load", err);
        }
    })
})();
