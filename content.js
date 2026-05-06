window.fabamore = {
    'console': console
};

fabamore.console.log = () => {
};
fabamore.console.warn = () => {
};
fabamore.console.error = () => {
};

const FABAMORE_VERSION = chrome.runtime.getManifest().version;
const FABAMORE_LABEL = `FabaMore ${FABAMORE_VERSION}`;
const INVITE_MP3_TARGET_SAMPLE_RATE = 22050;
const INVITE_MP3_TARGET_BITRATE = 64;
const MP3_ENCODER_FRAME_SIZE = 1152;
const CHROME_REVIEW_URL = 'https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn/reviews';
const FIREFOX_REVIEW_URL = 'https://addons.mozilla.org/firefox/addon/fabamore/';
const isInvitePage = window.location.pathname.includes('/invites/');

if (typeof Swal !== 'undefined' && Swal.mixin) {
    Swal = Swal.mixin({
        allowOutsideClick: false
    });
}

if (isInvitePage) {
    initInviteFlow();
} else {
    initFabamore();
}

async function initInviteFlow() {
    const canUseFabamore = await canOpenInvitePopup();
    if (!canUseFabamore) {
        return;
    }

    showInviteWelcomePopup();
}

function hasAlertImageInPage() {
    const images = document.querySelectorAll('img');
    for (const image of images) {
        const src = (image.getAttribute('src') || '').toLowerCase();
        const srcset = (image.getAttribute('srcset') || '').toLowerCase();
        if (src.includes('alert') || srcset.includes('alert')) {
            return true;
        }
    }

    return false;
}

function getPageTextContent() {
    return (document.body && document.body.textContent ? document.body.textContent : '').toLowerCase();
}

function isInvalidInvitePage() {
    const pageText = getPageTextContent();
    return hasAlertImageInPage()
        || pageText.includes('risorsa non trovata')
        || pageText.includes('ooops');
}

function isInviteContentReady() {
    return Array.from(document.querySelectorAll('button')).some((button) =>
        (button.textContent || '').trim().toLowerCase() === 'continua'
    );
}

function canOpenInvitePopup() {
    return new Promise((resolve) => {
        if (isInvalidInvitePage()) {
            resolve(false);
            return;
        }

        if (isInviteContentReady()) {
            resolve(true);
            return;
        }

        let resolved = false;

        function finalize(result) {
            if (resolved) {
                return;
            }

            resolved = true;
            observer.disconnect();
            clearTimeout(timeoutId);
            resolve(result);
        }

        const observer = new MutationObserver(() => {
            if (isInvalidInvitePage()) {
                finalize(false);
                return;
            }

            if (isInviteContentReady()) {
                finalize(true);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['src', 'srcset'] });

        const timeoutId = setTimeout(() => {
            finalize(false);
        }, 8000);
    });
}

function getInviteContext() {
    const pathnameMatch = window.location.pathname.match(/^\/([a-z]{2})\/invites\/([^/?#]+)/i);
    const localePrefix = pathnameMatch ? `/${pathnameMatch[1]}` : '';
    const inviteId = pathnameMatch ? pathnameMatch[2] : null;
    const token = new URLSearchParams(window.location.search).get('token');

    return {
        localePrefix,
        inviteId,
        token
    };
}

function styleSwalButtons() {
    const styledButtons = document.querySelectorAll('.swal2-styled, .swal2-confirm, .swal2-cancel, .swal2-deny, .swal2-close');
    const confirmButton = document.querySelector('.swal2-confirm');
    const cancelButton = document.querySelector('.swal2-cancel');
    const actions = document.querySelector('.swal2-actions');

    styledButtons.forEach((button) => {
        button.style.cursor = 'pointer';
    });

    if (actions) {
        actions.style.gap = '20px';
    }

    if (confirmButton) {
        confirmButton.style.backgroundColor = '#ed555a';
        confirmButton.style.color = '#ffffff';
        confirmButton.style.borderRadius = '9999px';
        confirmButton.style.padding = '10px 28px';
        confirmButton.style.fontWeight = '700';
        confirmButton.style.border = 'none';
        confirmButton.style.boxShadow = 'none';
    }

    if (cancelButton) {
        cancelButton.style.backgroundColor = 'var(--color-primary)';
        cancelButton.style.color = '#ffffff';
        cancelButton.style.borderRadius = '9999px';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.fontWeight = '700';
        cancelButton.style.border = 'none';
        cancelButton.style.boxShadow = 'none';
    }
}

function showInviteWelcomePopup() {
    removeFloatingInviteBadge();

    const inviteContext = getInviteContext();
    const iconUrl = chrome.runtime.getURL('fabamore-swal2-icon.jpg');

    Swal.fire({
        imageUrl: iconUrl,
        imageWidth: 180,
        imageHeight: 180,
        imageAlt: 'FabaMore icon',
        title: 'FabaMore è pronto!',
        html: '<p><span style="display:inline-block;padding:4px 10px;border-radius:9999px;border:2px solid #ed555a;color:#ed555a;font-size:12px;font-weight:700;">' + FABAMORE_LABEL + '</span></p><p style="margin-top:12px;">FabaMore ti permette di selezionare un file dal tuo computer e caricarlo sui FabaMe, senza dover registrare nuovamente la traccia audio.</p><p style="margin-top:14px;"><a href="https://mircobabini.dev/fabamore-per-faba-e-faba-plus/" target="_blank" rel="noopener noreferrer" style="color:#ed555a;text-decoration:underline;font-weight:600;">Hai bisogno di aiuto?</a></p>',
        confirmButtonText: 'Carica audio',
        showCancelButton: true,
        cancelButtonText: 'Preferisco registrare io',
        reverseButtons: true,
        buttonsStyling: false,
        didOpen: styleSwalButtons
    }).then((result) => {
        if (result.isConfirmed) {
            showInviteUploadPopup(inviteContext);
            return;
        }

        if (result.dismiss === Swal.DismissReason.cancel) {
            ensureFloatingInviteBadge();
        }
    });
}

function ensureFloatingInviteBadge() {
    if (document.getElementById('fabamore-floating-badge')) {
        return;
    }

    const badge = document.createElement('button');
    badge.id = 'fabamore-floating-badge';
    badge.type = 'button';
    badge.textContent = FABAMORE_LABEL;
    badge.style.position = 'fixed';
    badge.style.top = '0';
    badge.style.right = '16px';
    badge.style.zIndex = '2147483647';
    badge.style.backgroundColor = '#ed555a';
    badge.style.color = '#ffffff';
    badge.style.border = 'none';
    badge.style.borderRadius = '0 0 12px 12px';
    badge.style.padding = '8px 12px';
    badge.style.fontWeight = '700';
    badge.style.fontSize = '12px';
    badge.style.cursor = 'pointer';
    badge.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
    badge.title = 'Apri FabaMore';
    badge.onclick = () => {
        removeFloatingInviteBadge();
        showInviteWelcomePopup();
    };

    document.body.appendChild(badge);
}

function removeFloatingInviteBadge() {
    const badge = document.getElementById('fabamore-floating-badge');
    if (badge) {
        badge.remove();
    }
}

function showInviteUploadPopup(inviteContext) {
    Swal.fire({
        title: 'Carica audio',
        html: '' +
            '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.45;color:#2a2a2a;">Puoi caricare file <strong>.mp3 o qualunque formato audio</strong>, anche di grandi dimensioni. Prima dell\'invio FabaMore verifica se può alleggerirli per ridurre i tempi di upload. Per una migliore esperienza, dividi le tracce audio troppo lunghe.</p>' +
            '<input id="fabamore-name" class="swal2-input" placeholder="Il tuo nome" />' +
            '<input id="fabamore-title" class="swal2-input" placeholder="Titolo traccia" />' +
            '<div id="fabamore-dropzone" style="margin-top:10px;border:2px dashed #ed555a;border-radius:14px;padding:18px 14px;text-align:center;background:#fff8f8;cursor:pointer;">' +
                '<div style="font-weight:700;color:#ed555a;">Trascina qui il file audio</div>' +
                '<div style="font-size:13px;color:#555;margin-top:4px;">oppure clicca per selezionarlo</div>' +
                '<div id="fabamore-selected-file" style="margin-top:8px;font-size:12px;color:#222;"></div>' +
            '</div>' +
            '<div id="fabamore-upload-status" style="display:none;margin-top:12px;padding:10px 12px;border-radius:12px;background:#fff3f3;color:#a63b3f;font-size:13px;line-height:1.4;">' +
                '<div id="fabamore-upload-status-text"></div>' +
                '<div id="fabamore-progress-track" style="display:none;margin-top:8px;height:8px;border-radius:999px;background:rgba(237,85,90,0.18);overflow:hidden;">' +
                    '<div id="fabamore-progress-bar" style="width:0%;height:100%;border-radius:999px;background:#ed555a;transition:width 120ms ease;"></div>' +
                '</div>' +
            '</div>' +
            '<input id="fabamore-audio" style="display:none;" type="file" accept="audio/*,.mp3,.wav,.webm,.m4a,.aac,.ogg,.oga,.opus,.mp4" />',
        confirmButtonText: 'Invia a FabaMe',
        showCancelButton: true,
        cancelButtonText: 'Annulla',
        reverseButtons: true,
        focusConfirm: false,
        showLoaderOnConfirm: true,
        buttonsStyling: false,
        didOpen: () => {
            styleSwalButtons();
            const dropzone = document.getElementById('fabamore-dropzone');
            const audioInput = document.getElementById('fabamore-audio');
            const selectedFile = document.getElementById('fabamore-selected-file');

            const renderSelectedFile = () => {
                if (audioInput && audioInput.files && audioInput.files[0] && selectedFile) {
                    selectedFile.textContent = `File selezionato: ${audioInput.files[0].name}`;
                }
            };

            if (dropzone && audioInput) {
                dropzone.addEventListener('click', () => {
                    audioInput.click();
                });

                dropzone.addEventListener('dragover', (event) => {
                    event.preventDefault();
                    dropzone.style.background = '#ffeaea';
                });

                dropzone.addEventListener('dragleave', () => {
                    dropzone.style.background = '#fff8f8';
                });

                dropzone.addEventListener('drop', (event) => {
                    event.preventDefault();
                    dropzone.style.background = '#fff8f8';
                    if (!event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files[0]) {
                        return;
                    }

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(event.dataTransfer.files[0]);
                    audioInput.files = dataTransfer.files;
                    renderSelectedFile();
                });

                audioInput.addEventListener('change', renderSelectedFile);
            }
        },
        preConfirm: async () => {
            const name = document.getElementById('fabamore-name').value.trim();
            const title = document.getElementById('fabamore-title').value.trim();
            const audioInput = document.getElementById('fabamore-audio');
            const audioFile = audioInput && audioInput.files ? audioInput.files[0] : null;

            if (!inviteContext.inviteId || !inviteContext.token) {
                Swal.showValidationMessage('URL invito non valida: invite o token mancanti.');
                return false;
            }

            if (!name) {
                Swal.showValidationMessage('Inserisci il nome.');
                return false;
            }

            if (!title) {
                Swal.showValidationMessage('Inserisci il titolo.');
                return false;
            }

            if (!audioFile) {
                Swal.showValidationMessage('Seleziona un file audio.');
                return false;
            }

            if (!isSupportedInviteAudioFile(audioFile)) {
                Swal.showValidationMessage('Formato non supportato. Seleziona un file audio valido.');
                return false;
            }

            try {
                setInviteUploadStatus('Verifico se il file puo essere alleggerito prima del caricamento...', 'info', 5);
                const preparedAudio = await prepareInviteAudioFileForUpload(audioFile, (progress) => {
                    setInviteUploadStatus(progress.message, 'info', progress.percent);
                });

                if (preparedAudio.finalFile.size >= getInviteUploadMaxSizeBytes()) {
                    const finalSizeMb = formatFileSizeMb(preparedAudio.finalFile.size);
                    const maxSizeMb = formatFileSizeMb(getInviteUploadMaxSizeBytes());
                    const suggestedParts = Math.ceil(preparedAudio.finalFile.size / getInviteUploadMaxSizeBytes());
                    setInviteUploadStatus('');
                    Swal.showValidationMessage(
                        `Il file selezionato e ${finalSizeMb} MB, il limite e ${maxSizeMb}MB. Dividi il file in ${suggestedParts} parti. <a href="https://clideo.com/it/cut-audio" target="_blank" rel="noopener noreferrer">Taglialo qui</a>.`
                    );
                    return false;
                }

                setInviteUploadStatus(
                    preparedAudio.wasOptimized
                        ? `Carico il file ottimizzato...`
                        : 'Carico il file selezionato...',
                    'info',
                    95
                );
                await uploadInviteRecording(inviteContext, {name, title, audioFile: preparedAudio.finalFile});
                setInviteUploadStatus('Upload completato.', 'success', 100);
                return true;
            } catch (error) {
                setInviteUploadStatus('');
                const message = error && error.message ? error.message : 'Errore durante il caricamento.';
                Swal.showValidationMessage(message);
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            showInviteUploadSuccessPopup();
            return;
        }

        if (result.dismiss === Swal.DismissReason.cancel) {
            ensureFloatingInviteBadge();
        }
    });
}

function showInviteUploadSuccessPopup() {
    Swal.fire({
        icon: 'success',
        title: 'Audio caricato',
        text: 'Il file è stato caricato correttamente su FabaMe.',
        confirmButtonText: 'Continua',
        buttonsStyling: false,
        didOpen: styleSwalButtons
    }).then((result) => {
        if (result.isConfirmed) {
            showInviteFinalInstructionsPopup();
        }
    });
}

function showInviteFinalInstructionsPopup() {
    const reviewUrl = getReviewUrlByBrowser();

    Swal.fire({
        title: 'Tutto fatto!',
        html: 'Torna sulla app e ricarica i FabaMe, vedrai la notifica dell\'audio appena inviato. Buon ascolto!<br/><br/>Non dimenticare la recensione.',
        confirmButtonText: 'Lascia una recensione',
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showCloseButton: false,
        didOpen: styleSwalButtons,
        preConfirm: () => {
            window.open(reviewUrl, '_blank', 'noopener,noreferrer');
            return false;
        }
    });
}

function getReviewUrlByBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isFirefox = userAgent.includes('firefox');
    return isFirefox ? FIREFOX_REVIEW_URL : CHROME_REVIEW_URL;
}

function setInviteUploadStatus(message, tone, progressPercent) {
    const statusElement = document.getElementById('fabamore-upload-status');
    const statusTextElement = document.getElementById('fabamore-upload-status-text');
    const progressTrack = document.getElementById('fabamore-progress-track');
    const progressBar = document.getElementById('fabamore-progress-bar');
    const cancelButton = document.querySelector('.swal2-cancel');
    if (!statusElement) {
        return;
    }

    if (!message) {
        statusElement.style.display = 'none';
        if (statusTextElement) {
            statusTextElement.textContent = '';
        }
        if (progressTrack) {
            progressTrack.style.display = 'none';
        }
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        if (cancelButton) {
            cancelButton.style.display = '';
        }
        return;
    }

    statusElement.style.display = 'block';
    if (statusTextElement) {
        statusTextElement.textContent = message;
    }
    updateInviteProgressBar(progressPercent);
    if (cancelButton) {
        cancelButton.style.display = 'none';
    }

    if (tone === 'success') {
        statusElement.style.background = '#edf9f0';
        statusElement.style.color = '#1f7a3d';
        return;
    }

    statusElement.style.background = '#fff3f3';
    statusElement.style.color = '#a63b3f';
}

function updateInviteProgressBar(progressPercent) {
    const progressTrack = document.getElementById('fabamore-progress-track');
    const progressBar = document.getElementById('fabamore-progress-bar');
    if (!progressTrack || !progressBar || typeof progressPercent !== 'number') {
        return;
    }

    const safePercent = Math.max(0, Math.min(100, progressPercent));
    progressTrack.style.display = 'block';
    progressBar.style.width = `${safePercent}%`;
}

function getInviteUploadMaxSizeBytes() {
    return 100 * 1024 * 1024;
}

function formatFileSizeMb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1);
}

function isSupportedInviteAudioFile(file) {
    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.mp3', '.wav', '.webm', '.m4a', '.aac', '.ogg', '.oga', '.opus', '.mp4'];
    const supportedMimeTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav',
        'audio/wave',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg',
        'audio/opus',
        'video/webm',
        'video/mp4'
    ];

    if (supportedExtensions.some((extension) => fileName.endsWith(extension))) {
        return true;
    }

    if (file.type && (supportedMimeTypes.includes(file.type) || file.type.startsWith('audio/'))) {
        return true;
    }

    return false;
}

async function prepareInviteAudioFileForUpload(file, onProgress) {
    const originalFile = file;
    const canTryOptimization = isSupportedInviteAudioFile(file);

    reportInviteAudioProgress(onProgress, 'Analizzo il formato audio...', 8);

    if (!canTryOptimization) {
        return {
            finalFile: originalFile,
            wasOptimized: false,
            optimizedLabel: ''
        };
    }

    if (shouldKeepOriginalInviteAudioFile(originalFile)) {
        reportInviteAudioProgress(onProgress, "Il file e' gia' in un formato compresso, uso l'originale.", 90);
        return {
            finalFile: originalFile,
            wasOptimized: false,
            optimizedLabel: ''
        };
    }

    try {
        const optimizedCandidate = await convertAudioFileToMonoMp3Candidate(file, onProgress);
        if (optimizedCandidate.size < originalFile.size) {
            return {
                finalFile: optimizedCandidate,
                wasOptimized: true,
                optimizedLabel: 'MP3 mono'
            };
        }
    } catch (error) {
        fabamore.console.warn('Audio optimization skipped, using original file instead.', error);
    }

    reportInviteAudioProgress(onProgress, 'Uso il file originale per mantenere la dimensione migliore.', 90);
    return {
        finalFile: originalFile,
        wasOptimized: false,
        optimizedLabel: ''
    };
}

function reportInviteAudioProgress(onProgress, message, percent) {
    if (typeof onProgress === 'function') {
        onProgress({message, percent});
    }
}

function shouldKeepOriginalInviteAudioFile(file) {
    if (isMp3AudioFile(file)) {
        return false;
    }

    return isAlreadyCompressedAudioFile(file);
}

function isMp3AudioFile(file) {
    const fileName = file.name.toLowerCase();
    return fileName.endsWith('.mp3') || file.type === 'audio/mpeg';
}

function isAlreadyCompressedAudioFile(file) {
    const fileName = file.name.toLowerCase();
    const compressedExtensions = ['.mp3', '.m4a', '.aac', '.ogg', '.oga', '.opus', '.webm', '.mp4'];
    const compressedMimeTypes = [
        'audio/mpeg',
        'audio/mp4',
        'audio/aac',
        'audio/ogg',
        'audio/opus',
        'audio/webm',
        'video/webm',
        'video/mp4'
    ];

    if (compressedExtensions.some((extension) => fileName.endsWith(extension))) {
        return true;
    }

    return compressedMimeTypes.includes(file.type);
}

async function uploadInviteRecording(inviteContext, formValues) {
    const formData = new FormData();
    formData.append('audio', formValues.audioFile);
    formData.append('creator', formValues.name);
    formData.append('title', formValues.title);

    const uploadUrl = `https://api.myfaba.com/api/v3/studio/invites/${inviteContext.inviteId}/recordings?token=${encodeURIComponent(inviteContext.token)}`;
    const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        credentials: 'omit'
    });

    if (!response.ok) {
        let errorMessage = '';

        try {
            const responseBody = await response.json();
            if (responseBody && typeof responseBody.message === 'string') {
                errorMessage = responseBody.message;
            }
        } catch (error) {
            try {
                errorMessage = await response.text();
            } catch (textError) {
                errorMessage = '';
            }
        }

        throw new Error(errorMessage || `Upload fallito (${response.status}). Riprova tra poco.`);
    }
}

function initFabamore() {
    if (!initFabamoreOnMatchingSelector()) {
        const observer = new MutationObserver(() => {
            if (initFabamoreOnMatchingSelector()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function initFabamoreOnMatchingSelector() {
    const originalButton = document.querySelector(
      "button.bg-white.rounded-full.py-2.px-7.mb-3"
    );

    if (!originalButton) {
        return false;
    }

    if (originalButton.dataset.fabamoreInitialized === 'true') {
        return true;
    }

    originalButton.dataset.fabamoreInitialized = 'true';
    originalButton.textContent = "Registra";

    // Clone the button
    const clonedButton = originalButton.cloneNode(true);

    // Update the text of the cloned button
    clonedButton.textContent = "Carica da file";
    clonedButton.style.position = 'relative';

    const badgeLink = document.createElement('a');
    badgeLink.href = 'https://mircobabini.dev/fabamore-per-faba-e-faba-plus/';
    badgeLink.target = '_blank';
    badgeLink.style.textDecoration = 'none';
    
    const badge = document.createElement('span');
    badge.textContent = FABAMORE_LABEL;
    badge.style.backgroundColor = '#ffffff';
    badge.style.color = '#ed555a';
    badge.style.fontSize = '12px';
    badge.style.padding = '5px 10px';
    badge.style.right = '-7px';
    badge.style.position = 'absolute';
    badge.style.lineHeight = '12px';
    badge.style.border = '2px solid #ed555a';
    badge.style.borderRadius = '12px';
    badge.style.top = '-7px';

    badgeLink.appendChild(badge);
    clonedButton.appendChild(badgeLink);

    // add onclick hook
    clonedButton.onclick = function () {
        // Select the block using its unique attributes or class
        const block = document.querySelector("div[x-show=\"isCurrentBlock('record')\"]");

        if (block) {
            // change x-show to false
            block.setAttribute('x-show', 'false');

            // Optionally, apply styles to make the block hidden immediately
            block.style.display = 'none';
        } else {
            fabamore.console.warn('Block with x-show="isCurrentBlock(\'record\')" not found.');
        }

        // Show the form with id="form"
        const formElement = document.getElementById('form');
        if (formElement) {
            formElement.style.display = 'block'; // Ensure the form is visible
        } else {
            fabamore.console.warn('Form with id="form" not found.');
        }

        // Remove the 'hidden' class from the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.classList.remove('hidden'); // Remove the hidden class

            // Allow both WAV and MP3 files to be selected
            fileInput.setAttribute('accept', '.wav,.mp3');
            
            // set as required
            fileInput.setAttribute('required', 'required');

            // prepend the file input with a span: <p class="text-white font-bold text-center mb-3">Seleziona il file audio da caricare</p>
            const fileInputLabel = document.createElement('p');
            fileInputLabel.className = 'text-white font-bold text-center mb-3';
            fileInputLabel.textContent = 'Seleziona il file audio da caricare';
            fileInput.parentNode.insertBefore(fileInputLabel, fileInput);

            // add 20px margin before and after the file input
            fileInputLabel.style.marginTop = '20px';
            fileInput.style.margin = '0 0 20px 50px';

            // Convert MP3 files to WAV before upload
            // todo: check if this is still needed
            fileInput.addEventListener('change', async (event) => {
                const selectedFile = event.target.files[0];
                if (!selectedFile) {
                    return;
                }

                // Check if file is .wav or .mp3
                const validExtensions = ['.wav', '.mp3'];
                const fileName = event.target.files[0].name.toLowerCase();
                const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
                if (!isValidExtension) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Formato file non supportato',
                        text: 'Si prega di caricare un file .wav o .mp3',
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                    });

                    event.target.value = ''; // Clear the input
                    return;
                }

                // Convert mp3 to wav
                if (selectedFile.type === 'audio/mpeg' || selectedFile.name.toLowerCase().endsWith('.mp3')) {
                    try {
                        // use swal3 to show a loading alert
                        Swal.fire({
                            title: 'Conversione e compressione',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        const wavFile = await convertMp3FileToWav(selectedFile);
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(wavFile);
                        event.target.files = dataTransfer.files;

                        Swal.close();
                    } catch (err) {
                        fabamore.console.error('Errore nella conversione MP3 in WAV', err);
                    }
                }

                // Check file size
                const maxSizeMb = 120;
                const maxSize = maxSizeMb * 1024 * 1024; // 5MB in bytes
                if (event.target.files[0].size > maxSize) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'File di grandi dimensioni',
                        text: 'Il file selezionato supera i ' + maxSizeMb + 'MB. Potrebbe causare errori durante il caricamento, è consigliabile dividere tracce lunghe in più caricamenti.',
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                    });
                }
            });

            // hide the official submit button with the specific @click attribute (Vue/Alpine style)
            let buttonSubmit;

            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.getAttribute && btn.getAttribute('@click') === "$store.externalRecording.stopAndSubmit($el.closest('form'))") {
                    buttonSubmit = btn;
                }

                btn.style.display = 'none';
            });

            let lastItemHook = buttonSubmit && buttonSubmit.length ? buttonSubmit : document.querySelector('input[name="title"]');

            // add a new input type submit with class = bg-white text-[#ED555A] rounded-full py-2 px-7 mb-3 and value "Invia a FABA"
            const customSubmit = document.createElement('button');
            customSubmit.type = 'submit';
            customSubmit.className = 'flex flex-col text-2xl font-rodger-black font-black bg-white text-[#ED555A] rounded-full py-2 px-7 mb-3';
            customSubmit.style = 'width: 100%; margin-top: 10px;';
            customSubmit.textContent = 'Invia a FABA';
            // Insert after file input
            fileInput.parentNode.appendChild(customSubmit, lastItemHook);

            // Add submit event listener to the form to update button state
            const parentForm = fileInput.closest('form');
            if (parentForm) {
                parentForm.addEventListener('submit', function (e) {
                    // If the event is not prevented (no validation error), update button
                    setTimeout(() => {
                        if (!e.defaultPrevented) {
                            customSubmit.textContent = 'Caricamento...';
                            customSubmit.disabled = true;
                        }
                    }, 0);
                });
            }
        } else {
            fabamore.console.warn('File input not found.');
        }
    };

    // back button handling: @click="toPrevBlock"
    const backButton = document.querySelector('img[alt="Back button"]');
    backButton.onclick = function () {
        formElement.style.display = 'none';
        fileInput.style.display = 'none';
    };

    // Append the cloned button after the original button
    originalButton.parentNode.insertBefore(clonedButton, originalButton.nextSibling);
    return true;
}

// Compress WAV by downsampling and converting to mono
async function convertMp3FileToWav(file) {
    return convertAudioFileToOptimizedWav(file);
}

async function convertAudioFileToOptimizedWav(file) {
    return convertAudioFileToMonoWavCandidate(file);
}

async function convertAudioFileToMonoWavCandidate(file) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    try {
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();

        const renderedBuffer = await renderAudioBufferToMono(audioBuffer, INVITE_MP3_TARGET_SAMPLE_RATE);

        const wavBuffer = audioBufferToWav(renderedBuffer);
        const baseName = file.name.replace(/\.[^.]+$/i, '');
        return new File([wavBuffer], `${baseName}.wav`, {type: 'audio/wav'});
    } catch (error) {
        audioCtx.close();
        throw new Error('Non sono riuscito a ottimizzare questo file audio. Prova con un altro file o dividilo in tracce piu brevi.');
    }
}

async function convertAudioFileToMonoMp3Candidate(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    try {
        reportInviteAudioProgress(onProgress, 'Decodifico il file audio...', 15);
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();

        reportInviteAudioProgress(onProgress, 'Converto l\'audio in mono...', 35);
        const renderedBuffer = await renderAudioBufferToMono(audioBuffer, INVITE_MP3_TARGET_SAMPLE_RATE);
        const monoSamples = float32ToInt16(renderedBuffer.getChannelData(0));
        const lamejsEncoder = getLameJsEncoder();
        const mp3Encoder = new lamejsEncoder.Mp3Encoder(1, renderedBuffer.sampleRate, INVITE_MP3_TARGET_BITRATE);
        const mp3Chunks = [];

        for (let index = 0; index < monoSamples.length; index += MP3_ENCODER_FRAME_SIZE) {
            const sampleChunk = monoSamples.subarray(index, index + MP3_ENCODER_FRAME_SIZE);
            const mp3Buffer = mp3Encoder.encodeBuffer(sampleChunk);
            if (mp3Buffer.length > 0) {
                mp3Chunks.push(new Int8Array(mp3Buffer));
            }

            const encodeProgress = 45 + Math.round((index / monoSamples.length) * 45);
            reportInviteAudioProgress(onProgress, 'Creo la versione MP3 mono ottimizzata...', encodeProgress);
        }

        reportInviteAudioProgress(onProgress, 'Finalizzo il file MP3 mono...', 92);
        const finalBuffer = mp3Encoder.flush();
        if (finalBuffer.length > 0) {
            mp3Chunks.push(new Int8Array(finalBuffer));
        }

        if (!mp3Chunks.length) {
            throw new Error('Encoder MP3 non ha prodotto dati validi.');
        }

        const baseName = file.name.replace(/\.[^.]+$/i, '');
        return new File(mp3Chunks, `${baseName}.mp3`, {type: 'audio/mpeg'});
    } catch (error) {
        audioCtx.close();
        throw new Error('Non sono riuscito a creare una versione MP3 mono ottimizzata. Prova con un altro file o dividilo in tracce piu brevi.');
    }
}

function getLameJsEncoder() {
    if (typeof lamejs !== 'undefined' && lamejs && lamejs.Mp3Encoder) {
        return lamejs;
    }

    if (window.lamejs && window.lamejs.Mp3Encoder) {
        return window.lamejs;
    }

    throw new Error('Encoder MP3 non disponibile.');
}

async function renderAudioBufferToMono(audioBuffer, targetSampleRate) {
    const length = Math.floor(audioBuffer.length * targetSampleRate / audioBuffer.sampleRate);
    const offlineCtx = new OfflineAudioContext(1, length, targetSampleRate);
    const source = offlineCtx.createBufferSource();
    const monoBuffer = offlineCtx.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
    const channelData = monoBuffer.getChannelData(0);

    for (let index = 0; index < audioBuffer.length; index++) {
        let sum = 0;
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            sum += audioBuffer.getChannelData(channel)[index];
        }
        channelData[index] = sum / audioBuffer.numberOfChannels;
    }

    source.buffer = monoBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    return offlineCtx.startRendering();
}

function float32ToInt16(samples) {
    const int16Samples = new Int16Array(samples.length);
    for (let index = 0; index < samples.length; index++) {
        const sample = Math.max(-1, Math.min(1, samples[index]));
        int16Samples[index] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
    return int16Samples;
}

// Encode an AudioBuffer as a WAV ArrayBuffer
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    let offset = 0;

    function setUint16(data) {
        view.setUint16(offset, data, true);
        offset += 2;
    }

    function setUint32(data) {
        view.setUint32(offset, data, true);
        offset += 4;
    }

    // RIFF identifier 'RIFF'
    setUint32(0x46464952);
    // file length minus RIFF and size
    setUint32(length - 8);
    // RIFF type 'WAVE'
    setUint32(0x45564157);
    // format chunk identifier 'fmt '
    setUint32(0x20746d66);
    // format chunk length
    setUint32(16);
    // sample format (raw)
    setUint16(1);
    // channel count
    setUint16(numOfChan);
    // sample rate
    setUint32(buffer.sampleRate);
    // byte rate (sample rate * block align)
    setUint32(buffer.sampleRate * numOfChan * 2);
    // block align (channel count * bytes per sample)
    setUint16(numOfChan * 2);
    // bits per sample
    setUint16(16);
    // data chunk identifier 'data'
    setUint32(0x61746164);
    // data chunk length
    setUint32(length - offset - 4);

    const channels = [];
    for (let i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    let sampleIndex = 0;
    while (offset < length) {
        for (let i = 0; i < numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][sampleIndex]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
        sampleIndex++;
    }

    return arrayBuffer;
}
