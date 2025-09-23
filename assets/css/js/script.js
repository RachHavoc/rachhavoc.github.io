// script.js
// Copy buttons for code blocks and .copyable elements
// Scoped to content areas only (main/article/.wrap/.content) and safe to include once.
(function () {
  // Helper: fallback copy using execCommand(select+copy)
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      return Promise.resolve(fallbackCopyTextToClipboard(text));
    }
    return navigator.clipboard.writeText(text);
  }

  function makeCopyButton(container, textToCopy) {
    // prevent adding multiple buttons to same container
    if (container.querySelector('.copy-btn')) return;

    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Copy code");
    btn.innerText = "Copy";

    var label = document.createElement("span");
    label.className = "copy-label";
    label.innerText = "Copied!";

    btn.addEventListener("click", function () {
      copyTextToClipboard(textToCopy).then(function () {
        btn.classList.add("copied");
        btn.innerText = "✓";
        label.classList.add("show");
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerText = "Copy";
          label.classList.remove("show");
        }, 1800);
      }, function () {
        // fallback: attempt to select and allow user to press Ctrl+C
        try {
          fallbackCopyTextToClipboard(textToCopy);
          btn.classList.add("copied");
          btn.innerText = "✓";
          label.classList.add("show");
          setTimeout(function () {
            btn.classList.remove("copied");
            btn.innerText = "Copy";
            label.classList.remove("show");
          }, 1800);
        } catch (e) {
          alert("Copy failed. Select the text and press Ctrl+C.");
        }
      });
    });

    container.appendChild(btn);
    container.appendChild(label);
  }

  // Utility: check if an element is inside header/nav/footer or has .no-copy ancestor
  function isInExcludedRegion(el) {
    return !!el.closest('header, nav, footer, .site-header, .site-footer, .no-copy');
  }

  // Run after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    // Define allowed content containers (scoped)
    var contentSelectors = ['main', 'article', '.wrap', '.content', '.post', '.entry'];
    var contentRoots = [];
    contentSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (n) { contentRoots.push(n); });
    });

    // If no explicit content roots found, fall back to body but still exclude header/nav/footer
    if (contentRoots.length === 0) contentRoots.push(document.body);

    // For each root, find pre>code and .copyable elements and add buttons (unless excluded)
    contentRoots.forEach(function (root) {
      // pre > code blocks
      root.querySelectorAll('pre > code').forEach(function (codeEl) {
        var pre = codeEl.parentNode;
        // skip if inside excluded region
        if (isInExcludedRegion(pre)) return;
        // don't double-wrap if already in .code-block
        if (!pre.classList.contains('code-block') && !pre.closest('.code-block')) {
          var wrapper = document.createElement('div');
          wrapper.className = 'code-block';
          pre.parentNode.insertBefore(wrapper, pre);
          wrapper.appendChild(pre);
          // preserve visible formatting (trim trailing newline if needed)
          var text = codeEl.innerText.replace(/\r\n/g, '\n');
          makeCopyButton(wrapper, text);
        } else {
          // Already has .code-block ancestor: ensure it has a button
          var existingRoot = pre.closest('.code-block');
          if (existingRoot && !isInExcludedRegion(existingRoot)) {
            var text = codeEl.innerText.replace(/\r\n/g, '\n');
            makeCopyButton(existingRoot, text);
          }
        }
      });

      // elements marked .copyable
      root.querySelectorAll('.copyable').forEach(function (el) {
        // skip if inside excluded region or already inside a code-block
        if (isInExcludedRegion(el) || el.closest('.code-block')) return;
        var wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        var text = (el.innerText || el.textContent || '').trim();
        makeCopyButton(wrapper, text);
      });
    });

    // Mobile nav toggle (optional)
    const toggleBtn = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-right");
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }
  });
})();
