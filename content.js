window.fabamore = {
    'console': console
};

fabamore.console.log = () => {
};
fabamore.console.warn = () => {
};
fabamore.console.error = () => {
};

const isInvitePage = window.location.pathname.includes('/invites/');

if (isInvitePage) {
    Swal.fire({
        icon: 'info',
        title: 'FabaMore non funziona :(',
        text: "C'è stato un aggiornamento importante dell'applicativo MyFaba Studio, pertanto l'estensione FabaMore al momento non funziona. Stiamo lavorando per farla tornare funzionante più velocemente possibile.",
        confirmButtonText: 'Ho capito',
        buttonsStyling: false,
        didOpen: () => {
            const confirmButton = document.querySelector('.swal2-confirm');
            if (confirmButton) {
                confirmButton.style.backgroundColor = '#ed555a';
                confirmButton.style.color = '#ffffff';
                confirmButton.style.borderRadius = '9999px';
                confirmButton.style.padding = '10px 28px';
                confirmButton.style.fontWeight = '700';
                confirmButton.style.border = 'none';
                confirmButton.style.boxShadow = 'none';
            }
        },
    });
} else {
    initFabamore();
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
    badge.textContent = 'FabaMore 1.8';
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
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioCtx.close();

    // Downsample to 22050 Hz and mono
    const targetSampleRate = 22050;
    const length = Math.floor(audioBuffer.length * targetSampleRate / audioBuffer.sampleRate);
    const offlineCtx = new OfflineAudioContext(1, length, targetSampleRate);
    const source = offlineCtx.createBufferSource();
    // Convert to mono by averaging channels
    const monoBuffer = offlineCtx.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
    const channelData = monoBuffer.getChannelData(0);
    for (let i = 0; i < audioBuffer.length; i++) {
        let sum = 0;
        for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
            sum += audioBuffer.getChannelData(c)[i];
        }
        channelData[i] = sum / audioBuffer.numberOfChannels;
    }
    source.buffer = monoBuffer;
    source.connect(offlineCtx.destination);
    source.start();
    const renderedBuffer = await offlineCtx.startRendering();

    const wavBuffer = audioBufferToWav(renderedBuffer);
    return new File([wavBuffer], file.name.replace(/\.mp3$/i, '.wav'), {type: 'audio/wav'});
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
