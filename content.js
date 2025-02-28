// Function to linkify plain text URLs in a span
function linkifySpan(span) {
    const text = span.textContent.trim();
    const urlRegex = /^(https?:\/\/[^\s]+)$/; // Match only if entire content is a URL
    if (urlRegex.test(text) && !span.querySelector('a')) {
        span.innerHTML = `<a href="${text}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff; text-decoration: underline; cursor: pointer;">${text}</a>`;
        span.dataset.linkified = 'true';
        console.log(`Linkified: "${text}"`); // Debug
    }
}

// Process chat spans
function processChat() {
    // Target spans that might contain URLs
    const spans = document.querySelectorAll('span.ng-star-inserted:not([data-linkified])');
    console.log('Found', spans.length, 'potential URL spans'); // Debug
    spans.forEach(linkifySpan);
}

// Initialize with observer for dynamic updates
function initialize() {
    // Run once after a short delay
    setTimeout(processChat, 2000);

    // Watch for new spans added by Angular
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processChat();
            }
        });
    });

    // Observe the body or a parent container
    const target = document.body;
    observer.observe(target, {
        childList: true,
        subtree: true
    });
    console.log('Observer started'); // Debug
}

// Start when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}