// Add copy buttons to code blocks and .copyable elements.
// Safe to include once per page.
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
          // create a temporary textarea just to select, then remove
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

  // Wrap each <pre><code> into .code-block if not already
  document.querySelectorAll("pre > code").forEach(function (codeEl) {
    var pre = codeEl.parentNode;
    if (!pre.classList.contains("code-block")) {
      var wrapper = document.createElement("div");
      wrapper.className = "code-block";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      // preserve visible formatting (trim trailing newline if needed)
      var text = codeEl.innerText.replace(/\r\n/g, "\n");
      // Add copy button
      makeCopyButton(wrapper, text);
    }
  });

  // Also attach to elements with .copyable
  document.querySelectorAll(".copyable").forEach(function (el) {
    // skip if already has a copy-btn ancestor
    if (el.closest(".code-block")) return;
    var wrapper = document.createElement("div");
    wrapper.className = "code-block";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    var text = el.innerText || el.textContent;
    makeCopyButton(wrapper, text.trim());
  });
})();

// Mobile nav toggle (optional)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-right");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});

