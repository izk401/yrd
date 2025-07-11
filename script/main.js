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
    document.documentElement.classList.toggle("no-scroll");

    // メニューが非アクティブになる時（閉じる時）にサブメニューをリセット
    if (!nav.classList.contains("active")) {
      document.querySelectorAll('.has-submenu.submenu-open').forEach(openSubmenu => {
        openSubmenu.classList.remove('submenu-open');
      });
    }
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // サブメニューを持つリンクの親要素(.has-submenu)で、モバイル表示の場合
      if (this.parentElement.classList.contains('has-submenu') && window.innerWidth <= 768) {
        e.preventDefault();
        const parentLi = this.parentElement;

        // 現在開いている他のサブメニューを閉じる
        document.querySelectorAll('.has-submenu.submenu-open').forEach(openSubmenu => {
          if (openSubmenu !== parentLi) {
            openSubmenu.classList.remove('submenu-open');
          }
        });

        // クリックされたサブメニューを開閉する
        parentLi.classList.toggle('submenu-open');
        return;
      }

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
        document.documentElement.classList.remove("no-scroll");
      }
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
    ".content-section, .business-item, .character-item, .case-study, .sns-link-animated",
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
    document.documentElement.style.overflow = 'hidden';

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

    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollPosition);

    // フォーカスを外す処理を追加
    if (document.activeElement) {
      document.activeElement.blur();
    }

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
        .filter((item) => item.trim() !== "")
        .map((item, index) => {
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
      return newsItems;
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
                // 1. Create a temporary div to parse the string as HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = str;

                // 2. Define the URL regex
                const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

                // 3. Traverse the DOM tree and process text nodes
                function processNode(node) {
                  if (node.nodeType === Node.TEXT_NODE) { // It's a text node
                    const originalText = node.nodeValue;
                    if (urlRegex.test(originalText)) {
                      // Create a temporary span to hold the new HTML
                      const tempSpan = document.createElement('span');
                      tempSpan.innerHTML = originalText.replace(urlRegex, (match) => {
                        return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
                      });
                      // Replace the text node with the new HTML content
                      while (tempSpan.firstChild) {
                        node.parentNode.insertBefore(tempSpan.firstChild, node);
                      }
                      node.parentNode.removeChild(node);
                    }
                  } else if (node.nodeType === Node.ELEMENT_NODE) { // It's an element node
                    // Skip processing children of <a> tags to avoid re-linkifying
                    if (node.tagName.toLowerCase() === 'a') {
                      return;
                    }
                    // Recursively process child nodes
                    for (let i = 0; i < node.childNodes.length; i++) {
                      processNode(node.childNodes[i]);
                    }
                  }
                }

                processNode(tempDiv); // Start processing from the temporary div

                // 4. Get the modified HTML string
                const processedHtml = tempDiv.innerHTML;

                // 5. Sanitize the HTML using DOMPurify
                const cleanHtml = DOMPurify.sanitize(processedHtml, {
                  USE_PROFILES: { html: true },
                  ALLOWED_TAGS: ['a', 'p', 'br'],
                  FORBID_TAGS: [
                    "script", "style", "iframe", "object", "embed", "form",
                    "img", "svg", "video", "audio", "details", "dialog",
                    "canvas", "map", "area", "input", "textarea", "select",
                    "button", "option", "meter", "progress", "link"
                  ],
                  FORBID_ATTR: ["on*"], 
                  ADD_ATTR: ["target", "rel", "href"], 
                  ADD_URI_SAFE_ATTR: ["href"],
                });

                return cleanHtml;
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

  // Dynamic phone number linking for mobile
  function handlePhoneNumberLink() {
    const phoneNumberSpan = document.querySelector(".contact-phone .phone-number");
    if (!phoneNumberSpan) return;

    const phoneNumber = phoneNumberSpan.textContent;
    const parentP = phoneNumberSpan.closest(".contact-phone");

    // Check if already linked
    const existingLink = parentP.querySelector("a[href^='tel:']");

    if (window.innerWidth <= 768) { // Mobile breakpoint
      if (!existingLink) {
        const telLink = document.createElement("a");
        telLink.href = `tel:${phoneNumber.replace(/-/g, '')}`;
        telLink.style.textDecoration = "none"; // Remove underline
        telLink.style.color = "inherit"; // Keep original color
        telLink.appendChild(phoneNumberSpan);
        parentP.appendChild(telLink);
      }
    } else { // Desktop
      if (existingLink) {
        parentP.appendChild(phoneNumberSpan);
        existingLink.remove();
      }
    }
  }

  // Initial call
  handlePhoneNumberLink();

  // Call on resize
  window.addEventListener("resize", handlePhoneNumberLink);
});