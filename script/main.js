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

  // General Modal functionality (Privacy Policy, Joint Use)
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalButtons = document.querySelectorAll(".modal-close");
  const modalOverlays = document.querySelectorAll(".modal-overlay");

  let scrollPosition = 0; // スクロール位置を保持する変数

  // Helper function to manage focusable elements within a modal
  function toggleModalFocus(modalElement, enableFocus) {
    const focusableElements = modalElement.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]'
    );

    focusableElements.forEach(el => {
      if (enableFocus) {
        // When modal is active, make elements focusable
        if (el.tabIndex === -1) {
          el.tabIndex = 0;
        }
      } else {
        // When modal is inactive, make elements unfocusable
        if (el.tabIndex !== -1) {
          el.tabIndex = -1;
        }
      }
    });
  }

  // Ensure all modals are hidden and unfocusable on load
  modalOverlays.forEach((overlay) => {
    overlay.classList.remove("is-active"); // Ensure no active class on load
    overlay.setAttribute("aria-hidden", "true"); // Set aria-hidden to true
    overlay.removeAttribute("role"); // Ensure role is not set when hidden
    overlay.removeAttribute("aria-modal"); // Ensure aria-modal is not set when hidden
    toggleModalFocus(overlay, false); // Make elements inside unfocusable
  });

  openModalButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const modalId = this.dataset.modalTarget;
      const modal = document.getElementById(modalId);
      if (modal) {
        scrollPosition = window.pageYOffset; // 現在のスクロール位置を保存
        document.body.style.top = `-${scrollPosition}px`; // スクロール位置をtopに設定
        document.body.style.position = "fixed"; // bodyを固定
        document.body.style.overflow = "hidden"; // bodyのスクロールを無効化
        document.documentElement.style.overflow = "hidden"; // htmlのスクロールを無効化
        document.body.classList.add("modal-open"); // modal-openクラスを追加
        document.documentElement.classList.add("modal-open"); // htmlにもmodal-openクラスを追加

        modal.classList.add("is-active");
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        toggleModalFocus(modal, true); // Make elements inside focusable
        modal.focus();
        // モーダル内のスクロール可能な要素のスクロール位置をリセット
        const scrollableContent = modal.querySelector('.modal-body-scrollable');
        if (scrollableContent) {
          scrollableContent.scrollTop = 0;
        }
      } else {
        console.error("Modal element not found for ID:", modalId); // エラーログ
      }
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal-overlay");
      modal.classList.remove("is-active");
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      document.body.style.top = "";
      document.body.style.position = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollPosition);

      modal.removeAttribute("aria-hidden");
      modal.removeAttribute("role");
      modal.removeAttribute("aria-modal");
      toggleModalFocus(modal, false);
    });
  });

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        // Close if clicked on overlay, not content
        this.classList.remove("is-active");
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(0, scrollPosition);

        this.setAttribute("aria-hidden", "true");
        this.removeAttribute("role");
        this.removeAttribute("aria-modal");
        toggleModalFocus(this, false);
      }
    });
  });

  // News List and Modal functionality
  const newsListContainer = document.getElementById("news-list");
  if (newsListContainer) {
    const newsModal = document.getElementById("newsDetailModal");
    const newsModalTitle = document.getElementById("newsModalTitle");
    const newsModalBody = document.getElementById("newsModalBody");

    // テキストをパースしてニュースオブジェクトの配列を返す
    function parseNewsText(text) {
      const newsItems = text
        .split("---NEWS_ITEM---")
        .filter((item) => item.trim() !== "");
      return newsItems.map((item, index) => {
        const lines = item.trim().split("\n");
        let date = "";
        let title = "";
        let content = "";

        // 'CONTENT:'で始まる行を見つけて、それ以降をcontentとする
        const contentIndex = lines.findIndex((l) => l.startsWith("CONTENT:"));
        if (contentIndex !== -1) {
          content = lines
            .slice(contentIndex + 1)
            .join("\n")
            .trim();
        }

        // DATEとTITLEを取得
        lines.forEach((line) => {
          if (line.startsWith("DATE:")) {
            date = line.substring(5).trim();
          } else if (line.startsWith("TITLE:")) {
            title = line.substring(6).trim();
          }
        });

        const id = `news-${index}`;
        // パースした生のデータを返す（サニタイズは表示直前に行う）
        return { id, date, title, content };
      });
    }

    // ニュースデータを読み込んで表示する
    async function loadNews() {
      try {
        const response = await fetch("data/news.txt");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const newsData = parseNewsText(text);

        newsListContainer.innerHTML = ""; // 既存のコンテンツをクリア

        // 取得したニュースデータからリストを生成
        newsData.forEach((newsItem) => {
          const listItem = document.createElement("li");
          const link = document.createElement("a");
          link.href = "#";
          link.classList.add("open-news-modal");
          // データ属性に情報を格納
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

        // 生成された各ニュース項目にクリックイベントを追加
        document.querySelectorAll(".open-news-modal").forEach((button) => {
          button.addEventListener("click", function (e) {
            e.preventDefault();
            const newsId = this.dataset.newsId;
            const selectedNews = newsData.find((item) => item.id === newsId);

            if (selectedNews) {
              // モーダルのタイトルを安全に設定
              newsModalTitle.innerHTML = ""; // クリア
              const dateSpan = document.createElement("span");
              dateSpan.className = "news-modal-date";
              dateSpan.textContent = selectedNews.date;
              newsModalTitle.appendChild(dateSpan);
              newsModalTitle.appendChild(document.createElement("br")); // 改行を追加
              newsModalTitle.appendChild(
                document.createTextNode(`${selectedNews.title}`),
              );

              // 安全なHTMLを生成し、URLをリンク化するための関数
              function sanitizeAndLinkify(str) {
                // DOMParserを使用してHTMLをパース
                const parser = new DOMParser();
                const doc = parser.parseFromString(str, "text/html");
                const body = doc.body;

                // DOMを再帰的に走査して処理する
                const walkTheDOM = (node) => {
                  // テキストノードの場合、URLをリンク化する
                  if (node.nodeType === Node.TEXT_NODE) {
                    const textContent = node.textContent;
                    // URLの正規表現
                    const urlRegex = /(https?:\/\/[^\s<>"']+)/g;

                    if (urlRegex.test(textContent)) {
                      const fragment = document.createDocumentFragment();
                      let lastIndex = 0;
                      textContent.replace(urlRegex, (match, offset) => {
                        // URLの前のテキストを追加
                        if (offset > lastIndex) {
                          fragment.appendChild(
                            document.createTextNode(
                              textContent.substring(lastIndex, offset),
                            ),
                          );
                        }
                        // aタグを作成
                        const a = document.createElement("a");
                        a.href = match;
                        a.textContent = match;
                        a.target = "_blank";
                        a.rel = "noopener noreferrer";
                        fragment.appendChild(a);
                        lastIndex = offset + match.length;
                      });
                      // URLの後のテキストを追加
                      if (lastIndex < textContent.length) {
                        fragment.appendChild(
                          document.createTextNode(
                            textContent.substring(lastIndex),
                          ),
                        );
                      }
                      // 元のテキストノードを新しいフラグメントに置換
                      if (node.parentNode) {
                        node.parentNode.replaceChild(fragment, node);
                      }
                    }
                    return; // テキストノードはこれ以上の子を持たないので終了
                  }

                  // 要素ノードの場合
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();

                    // 危険なタグは削除
                    if (
                      ["script", "style", "iframe", "object", "embed"].includes(
                        tagName,
                      )
                    ) {
                      node.remove();
                      return;
                    }

                    // 既存のaタグの属性をサニタイズ
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
                            node.removeAttribute("href"); // 安全でないプロトコルは削除
                          } else {
                            node.target = "_blank";
                            node.rel = "noopener noreferrer";
                          }
                        } catch (e) {
                          node.removeAttribute("href"); // 無効なURLは削除
                        }
                      }
                      // 不要な属性を削除
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

                  // 子ノードを再帰的に処理（静的配列に変換してから）
                  [...node.childNodes].forEach(walkTheDOM);
                };

                walkTheDOM(body);
                return body.innerHTML;
              }

              // モーダルの本文を安全に設定
              newsModalBody.innerHTML = ""; // クリア
              // コンテンツの改行を<p>タグに変換して追加
              const lines = selectedNews.content.split("\n");
              lines.forEach((line) => {
                // サニタイズとリンク化処理を通してHTMLを取得
                const sanitizedLine = sanitizeAndLinkify(line);
                const p = document.createElement("p");
                p.innerHTML = sanitizedLine; // サニタイズ済みのHTMLをinnerHTMLとして設定
                newsModalBody.appendChild(p);
              });
            } else {
              // お知らせが見つからない場合
              newsModalTitle.textContent = "エラー";
              newsModalBody.innerHTML = ""; // クリア
              const p = document.createElement("p");
              p.textContent = "お知らせの内容を読み込めませんでした。";
              newsModalBody.appendChild(p);
              console.error("News content not found for ID:", newsId);
            }

            // モーダルを表示
            newsModal.classList.add("is-active");
            scrollPosition = window.pageYOffset; // 現在のスクロール位置を保存
            document.body.style.top = `-${scrollPosition}px`; // スクロール位置をtopに設定
            document.body.classList.add("modal-open"); // modal-openクラスを追加
            document.documentElement.classList.add("modal-open"); // htmlにもmodal-openクラスを追加
            document.body.style.position = "fixed"; // bodyを固定
            document.body.style.overflow = "hidden"; // bodyのスクロールを無効化
            document.documentElement.style.overflow = "hidden"; // htmlのスクロールを無効化
            newsModal.classList.add("is-active");
          });
        });
      } catch (error) {
        console.error("Failed to load news data:", error);
        newsListContainer.innerHTML = ""; // クリア
        const p = document.createElement("p");
        p.textContent = "お知らせの読み込み中にエラーが発生しました。";
        newsListContainer.appendChild(p);
      }
    }

    loadNews(); // ページ読み込み時にニュースを読み込む
  }

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal-overlay.is-active"); // Select by class
      if (openModal) {
        openModal.classList.remove("is-active");
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.scrollTo(0, scrollPosition);

        // No need to reset overflow here, as modal-open class handles it
        openModal.setAttribute("aria-hidden", "true");
        openModal.removeAttribute("role");
        openModal.removeAttribute("aria-modal");
        toggleModalFocus(openModal, false); // Make elements inside unfocusable
      }
    }
  });
});
