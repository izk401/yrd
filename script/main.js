document.addEventListener("DOMContentLoaded", function () {
  // Typewriter effect for hero title
  const heroTitleElement = document.querySelector("#hero h1");
  if (heroTitleElement) {
    const lines = heroTitleElement.innerHTML.split("<br>");
    heroTitleElement.innerHTML = ""; // Clear the text initially

    lines.forEach((line, index) => {
      const span = document.createElement("span");
      span.textContent = line.trim();
      span.style.opacity = 0; // Initially hidden
      span.style.transform = "translateY(20px)"; // Start slightly below
      span.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      span.style.display = "block"; // Each line on its own block
      heroTitleElement.appendChild(span);

      setTimeout(
        () => {
          span.style.opacity = 1;
          span.style.transform = "translateY(0)";
        },
        index * 500 + 800,
      ); // Staggered animation with a slight delay
    });
  }

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const header = document.querySelector("header");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    nav.classList.toggle("active");
    // Prevent scrolling when hamburger menu is active
    document.body.classList.toggle("no-scroll");
    document.documentElement.classList.toggle("no-scroll");
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // モーダル用のリンクは除外
      if (
        this.classList.contains("open-modal") ||
        this.classList.contains("open-news-modal")
      ) {
        return;
      }
      e.preventDefault(); // デフォルトの動作をキャンセル

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        let scrollOffset = 0;

        // 要素がまだ表示されていない場合、アニメーションによるズレを考慮する
        // style.cssの .content-section { transform: translateY(60px); } に対応
        if (!targetElement.classList.contains("is-visible")) {
          scrollOffset = 60;
        }

        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          scrollOffset;

        // 計算した正しい位置へ一度でスムーズにスクロール
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      // ハンバーガーメニューが開いていれば閉じる
      if (nav.classList.contains("active")) {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      }

      // ナビゲーション後にスクロールを再度有効にする
      document.body.classList.remove("no-scroll", "modal-open");
      document.documentElement.classList.remove("no-scroll", "modal-open");

    });
  });

  // Header scroll effect
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      // 50pxスクロールしたら
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll);
  handleHeaderScroll(); // 初期表示時にも実行

  // Scroll-based animations for sections with staggered effect
  const animatedElements = document.querySelectorAll(
    ".content-section, .business-item, .character-item, .case-study",
  );

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("business-grid")) {
            // Business grid special handling
            Array.from(entry.target.children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("is-visible");
              }, index * 150); // Stagger effect
            });
          } else if (entry.target.classList.contains("character-container")) {
            // Character container special handling
            Array.from(entry.target.children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("is-visible");
              }, index * 200); // Stagger effect
            });
          } else if (entry.target.classList.contains("case-study-grid")) {
            // Case study grid special handling
            Array.from(entry.target.children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("is-visible");
              }, index * 150); // Stagger effect
            });
          } else {
            entry.target.classList.add("is-visible");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  ); // 20%ビューポートに入ったらアニメーション

  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // --- Modal Functionality ---
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  let scrollPosition = 0;

  function openModal(modal) {
    if (!modal) return;

    scrollPosition = window.pageYOffset;
    document.body.classList.add("modal-open");
    document.body.style.top = `-${scrollPosition}px`;

    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const scrollableContent = modal.querySelector('.modal-body-scrollable');
    if (scrollableContent) {
      scrollableContent.scrollTop = 0;
    }
    modal.focus();
  }

  function closeModal(modal) {
    if (!modal) return;

    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, scrollPosition);

    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("role");
    modal.removeAttribute("aria-modal");
  }

  // General Modal Triggers
  document.querySelectorAll(".open-modal").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = this.dataset.modalTarget;
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  // Close Triggers (Buttons and Overlays)
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === this || e.target.classList.contains("modal-close")) {
        closeModal(this);
      }
    });
  });

  // News List and Modal functionality
  const newsListContainer = document.getElementById("news-list");
  if (newsListContainer) {
    const newsModal = document.getElementById("newsDetailModal");
    const newsModalTitle = document.getElementById("newsModalTitle");
    const newsModalBody = document.getElementById("newsModalBody");

    function parseNewsText(text) {
      const newsItems = text
        .split("---NEWS_ITEM---")
        .filter((item) => item.trim() !== "");
      return newsItems.map((item, index) => {
        const lines = item.trim().split("\n");
        let date = "";
        let title = "";
        let content = "";

        const contentIndex = lines.findIndex((l) => l.startsWith("CONTENT:"));
        if (contentIndex !== -1) {
          content = lines
            .slice(contentIndex + 1)
            .join("\n")
            .trim();
        }

        lines.forEach((line) => {
          if (line.startsWith("DATE:")) {
            date = line.substring(5).trim();
          } else if (line.startsWith("TITLE:")) {
            title = line.substring(6).trim();
          }
        });

        const id = `news-${index}`;
        return { id, date, title, content };
      });
    }

    async function loadNews() {
      try {
        const response = await fetch("data/news.txt");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const newsData = parseNewsText(text);

        newsListContainer.innerHTML = "";

        newsData.forEach((newsItem) => {
          const listItem = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#";
          link.classList.add("open-news-modal");
          link.dataset.newsId = newsItem.id;

          const time = document.createElement("time");
          time.textContent = newsItem.date;

          const titleSpan = document.createElement("span");
          titleSpan.className = "news-title";
          titleSpan.textContent = newsItem.title;

          link.appendChild(time);
          link.appendChild(titleSpan);
          listItem.appendChild(link);
          newsListContainer.appendChild(listItem);
        });

        document.querySelectorAll(".open-news-modal").forEach((button) => {
          button.addEventListener("click", function (e) {
            e.preventDefault();
            const newsId = this.dataset.newsId;
            const selectedNews = newsData.find((item) => item.id === newsId);

            if (selectedNews) {
              newsModalTitle.innerHTML = "";
              const dateSpan = document.createElement("span");
              dateSpan.className = "news-modal-date";
              dateSpan.textContent = selectedNews.date;
              newsModalTitle.appendChild(dateSpan);
              newsModalTitle.appendChild(document.createElement("br"));
              newsModalTitle.appendChild(
                document.createTextNode(`${selectedNews.title}`),
              );

              function sanitizeAndLinkify(str) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(str, "text/html");
                const body = doc.body;

                const walkTheDOM = (node) => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    const textContent = node.textContent;
                    const urlRegex = /(https?:\/\/[^\s<>\"']+)/g;

                    if (urlRegex.test(textContent)) {
                      const fragment = document.createDocumentFragment();
                      let lastIndex = 0;
                      textContent.replace(urlRegex, (match, offset) => {
                        if (offset > lastIndex) {
                          fragment.appendChild(
                            document.createTextNode(
                              textContent.substring(lastIndex, offset),
                            ),
                          );
                        }
                        const a = document.createElement("a");
                        a.href = match;
                        a.textContent = match;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        fragment.appendChild(a);
                        lastIndex = offset + match.length;
                      });
                      if (lastIndex < textContent.length) {
                        fragment.appendChild(
                          document.createTextNode(
                            textContent.substring(lastIndex),
                          ),
                        );
                      }
                      if (node.parentNode) {
                        node.parentNode.replaceChild(fragment, node);
                      }
                    }
                    return;
                  }

                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();

                    if (
                      ["script", "style", "iframe", "object", "embed"].includes(
                        tagName,
                      )
                    ) {
                      node.remove();
                      return;
                    }

                    if (tagName === "a") {
                      const href = node.getAttribute("href");
                      if (href) {
                        try {
                          const url = new URL(href, window.location.origin);
                          if (
                            !["http:", "https:", "mailto:"].includes(
                              url.protocol,
                            )
                          ) {
                            node.removeAttribute("href");
                          } else {
                            node.target = "_blank";
                            node.rel = "noopener noreferrer";
                          }
                        } catch (e) {
                          node.removeAttribute("href");
                        }
                      }
                      const allowedAttributes = ["href", "target", "rel"];
                      for (const attr of [...node.attributes]) {
                        if (
                          !allowedAttributes.includes(attr.name.toLowerCase())
                        ) {
                          node.removeAttribute(attr.name);
                        }
                      }
                    }
                  }

                  [...node.childNodes].forEach(walkTheDOM);
                };

                walkTheDOM(body);
                return body.innerHTML;
              }

              newsModalBody.innerHTML = "";
              const lines = selectedNews.content.split("\n");
              lines.forEach((line) => {
                const sanitizedLine = sanitizeAndLinkify(line);
                const p = document.createElement("p");
                p.innerHTML = sanitizedLine;
                newsModalBody.appendChild(p);
              });
            } else {
              newsModalTitle.textContent = "エラー";
              newsModalBody.innerHTML = "";
              const p = document.createElement("p");
              p.textContent = "お知らせの内容を読み込めませんでした。";
              newsModalBody.appendChild(p);
              console.error("News content not found for ID:", newsId);
            }

            openModal(newsModal);
          });
        });
      } catch (error) {
        console.error("Failed to load news data:", error);
        newsListContainer.innerHTML = "";
        const p = document.createElement("p");
        p.textContent = "お知らせの読み込み中にエラーが発生しました。";
        newsListContainer.appendChild(p);
      }
    }

    loadNews();
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal-overlay.is-active");
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
});