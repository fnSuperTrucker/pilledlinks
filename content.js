// Function to linkify text, handling URLs separately from mentions
function linkifySpan(span) {
    const text = span.textContent.trim();
    // Regex to match URLs, ensuring they stand alone or are separated from mentions
    const urlRegex = /(?:^|\s)(https?:\/\/[^\s]+)/g;
    
    // Only process spans that haven't been linkified
    if (!span.dataset.linkified) {
        let newHtml = text;
        let hasLinks = false;

        // Replace URLs with anchor tags, preserving surrounding text like @mentions
        newHtml = text.replace(urlRegex, (match, url) => {
            hasLinks = true;
            // If there's a space before the URL, preserve it
            const prefix = match.startsWith(' ') ? ' ' : '';
            return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e90ff; text-decoration: underline; cursor: pointer;">${url}</a>`;
        });

        // Only update if we found and replaced a URL
        if (hasLinks) {
            span.innerHTML = newHtml;
            span.dataset.linkified = 'true';
            console.log(`Linkified: "${text}" -> "${span.innerHTML}"`);
        }
    }
}

// Process chat spans
function processChat() {
    // Adjust selector based on Pilled.net's chat structure
    const spans = document.querySelectorAll('span.ng-star-inserted:not([data-linkified]), span.chat-message:not([data-linkified])');
    console.log('Found', spans.length, 'potential URL spans');
    spans.forEach(linkifySpan);
}

// Initialize with observer for dynamic updates
function initialize() {
    // Run immediately and after delays for initial load
    processChat();
    setTimeout(processChat, 1000);
    setTimeout(processChat, 3000);

    // Watch for new spans added dynamically
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                shouldProcess = true;
            }
        });
        if (shouldProcess) {
            processChat();
        }
    });

    // Observe the body or a specific chat container
    const target = document.body;
    observer.observe(target, {
        childList: true,
        subtree: true
    });
    console.log('Observer started');
}

// Persistent execution on page changes
function ensurePersistent() {
    initialize();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            processChat();
        }
    });
}

// Start when document is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensurePersistent);
} else {
    ensurePersistent();
}