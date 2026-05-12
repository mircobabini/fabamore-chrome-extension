(function () {
    const MESSAGE_SOURCE = 'fabamore-invite-ajax-hook';

    function isInteresting(rawUrl) {
        try {
            const url = new URL(rawUrl, window.location.href);
            const match = url.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\/invites\/([^/]+)\/?$/);

            if (!match) {
                return false;
            }

            return {
                lang: match[1],
                invitePublicId: match[2],
                url: url.href
            };
        } catch (error) {
            return false;
        }
    }

    function emitInviteResponse(match, status, body) {
        window.postMessage({
            source: MESSAGE_SOURCE,
            type: 'invite-response',
            lang: match.lang,
            invitePublicId: match.invitePublicId,
            url: match.url,
            status,
            body
        }, '*');
    }

    const originalFetch = window.fetch;
    if (typeof originalFetch === 'function') {
        window.fetch = async function (...args) {
            const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
            const response = await originalFetch.apply(this, args);
            const match = isInteresting(requestUrl);

            if (match) {
                response.clone().text().then((body) => {
                    emitInviteResponse(match, response.status, body);
                }).catch((error) => {
                    console.warn('FabaMore could not read fetch response', error);
                });
            }

            return response;
        };
    }

    const OriginalXHR = window.XMLHttpRequest;
    if (typeof OriginalXHR === 'function') {
        window.XMLHttpRequest = function () {
            const xhr = new OriginalXHR();
            let requestUrl = '';

            const originalOpen = xhr.open;
            xhr.open = function (...args) {
                requestUrl = args[1];
                return originalOpen.apply(xhr, args);
            };

            xhr.addEventListener('load', function () {
                const match = isInteresting(requestUrl);
                if (!match) {
                    return;
                }

                const responseBody = typeof xhr.responseText === 'string'
                    ? xhr.responseText
                    : (typeof xhr.response === 'string' ? xhr.response : '');

                emitInviteResponse(match, xhr.status, responseBody);
            });

            return xhr;
        };
    }
})();
