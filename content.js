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
const CHROME_REVIEW_URL_DEFAULT = 'https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn/reviews';
const CHROME_REVIEW_URL_IT = 'https://chromewebstore.google.com/detail/fabamore-do-more-with-you/lceoahoffijefgjgepcnilmdlmjeeidn/reviews?hl=it';
const FIREFOX_REVIEW_URL_DEFAULT = 'https://addons.mozilla.org/en-US/firefox/addon/fabamore-do-more-faba/reviews/';
const FIREFOX_REVIEW_URL_IT = 'https://addons.mozilla.org/it/firefox/addon/fabamore-do-more-faba/reviews/';
const INVITE_AJAX_HOOK_SOURCE = 'fabamore-invite-ajax-hook';
const INVITE_AJAX_WAIT_TIMEOUT_MS = 10000;
const SWEETALERT_WAIT_TIMEOUT_MS = 10000;
const isInvitePage = window.location.pathname.includes('/invites/');
const SUPPORTED_LANGUAGES = ['en', 'it', 'fr', 'es'];
const TRANSLATIONS = {
    en: {
        invite: {
            remainingTime: 'Time still available on this FabaMe: <strong>{{duration}}</strong>.',
            iconAlt: 'FabaMore icon',
            welcomeTitle: 'FabaMore is ready!',
            welcomeBody: 'FabaMore lets you select a file from your computer and upload it to FabaMe, without recording the audio track again.',
            helpLink: 'Need help?',
            uploadAudio: 'Upload audio',
            preferRecord: 'I prefer to record it myself',
            openFabamore: 'Open FabaMore',
            uploadTitle: 'Upload audio',
            uploadIntro: 'You can upload <strong>.mp3 files or any audio format</strong>, even large ones. Before uploading, FabaMore checks whether it can make them lighter to reduce upload time. For a better experience, split very long audio tracks.',
            yourName: 'Your name',
            trackTitle: 'Track title',
            dragAudio: 'Drag the audio file here',
            clickToSelect: 'or click to select it',
            submitToFabaMe: 'Send to FabaMe',
            cancel: 'Cancel',
            selectedFile: 'Selected file: {{fileName}}',
            invalidInviteUrl: 'Invalid invite URL: missing invite or token.',
            enterName: 'Enter your name.',
            enterTitle: 'Enter the title.',
            selectAudioFile: 'Select an audio file.',
            unsupportedAudioFormat: 'Unsupported format. Select a valid audio file.',
            checkingDuration: 'Checking the file duration against the time still available...',
            audioTooLong: 'The track lasts about {{audioDuration}}, but only {{remainingDuration}} remain on this FabaMe. Split the file into smaller parts and try again.',
            optimizingBeforeUpload: 'Checking whether the file can be made lighter before upload...',
            fileTooLarge: 'The selected file is {{finalSizeMb}} MB, the limit is {{maxSizeMb}} MB. Split the file into {{suggestedParts}} parts. <a href="{{splitAudioUrl}}" target="_blank" rel="noopener noreferrer">Cut it here</a>.',
            uploadingOptimized: 'Uploading the optimized file...',
            uploadingSelected: 'Uploading the selected file...',
            uploadCompleted: 'Upload completed.',
            uploadError: 'Error during upload.',
            uploadSuccessTitle: 'Audio uploaded',
            uploadSuccessText: 'The file was uploaded to FabaMe successfully.',
            continue: 'Continue',
            allDoneTitle: 'All done!',
            allDoneBody: 'Go back to the app and reload the FabaMe items, you will see the notification for the audio that was just sent. Enjoy listening!<br/><br/>Don\'t forget the review.',
            leaveReview: 'Leave a review',
            analyzeFormat: 'Analyzing the audio format...',
            alreadyCompressed: 'The file is already in a compressed format, I will use the original.',
            keepOriginal: 'I will use the original file to keep the better size.',
            decodeAudio: 'Decoding the audio file...',
            convertMono: 'Converting the audio to mono...',
            createOptimizedMp3: 'Creating the optimized mono MP3 version...',
            finalizeOptimizedMp3: 'Finalizing the mono MP3 file...'
        },
        inline: {
            record: 'Record',
            uploadFromFile: 'Upload from file',
            selectAudioToUpload: 'Select the audio file to upload',
            unsupportedFileTitle: 'Unsupported file format',
            unsupportedFileText: 'Please upload a .wav or .mp3 file',
            ok: 'OK',
            convertingAndCompressing: 'Converting and compressing',
            largeFileTitle: 'Large file',
            largeFileText: 'The selected file is larger than {{maxSizeMb}} MB. It may cause upload errors, so splitting long tracks into multiple uploads is recommended.',
            submitToFaba: 'Send to FABA',
            uploading: 'Uploading...'
        },
        errors: {
            optimizeAudio: 'I could not optimize this audio file. Try another file or split it into shorter tracks.',
            createMonoMp3: 'I could not create an optimized mono MP3 version. Try another file or split it into shorter tracks.',
            mp3EncoderUnavailable: 'MP3 encoder is not available.'
        },
        time: {
            hourShort: 'h',
            minuteShort: 'm',
            secondShort: 's'
        }
    },
    it: {
        invite: {
            remainingTime: 'Tempo ancora disponibile su questo FabaMe: <strong>{{duration}}</strong>.',
            iconAlt: 'Icona FabaMore',
            welcomeTitle: 'FabaMore è pronto!',
            welcomeBody: 'FabaMore ti permette di selezionare un file dal tuo computer e caricarlo sui FabaMe, senza dover registrare nuovamente la traccia audio.',
            helpLink: 'Hai bisogno di aiuto?',
            uploadAudio: 'Carica audio',
            preferRecord: 'Preferisco registrare io',
            openFabamore: 'Apri FabaMore',
            uploadTitle: 'Carica audio',
            uploadIntro: 'Puoi caricare file <strong>.mp3 o qualunque formato audio</strong>, anche di grandi dimensioni. Prima dell\'invio FabaMore verifica se può alleggerirli per ridurre i tempi di upload. Per una migliore esperienza, dividi le tracce audio troppo lunghe.',
            yourName: 'Il tuo nome',
            trackTitle: 'Titolo traccia',
            dragAudio: 'Trascina qui il file audio',
            clickToSelect: 'oppure clicca per selezionarlo',
            submitToFabaMe: 'Invia a FabaMe',
            cancel: 'Annulla',
            selectedFile: 'File selezionato: {{fileName}}',
            invalidInviteUrl: 'URL invito non valida: invite o token mancanti.',
            enterName: 'Inserisci il nome.',
            enterTitle: 'Inserisci il titolo.',
            selectAudioFile: 'Seleziona un file audio.',
            unsupportedAudioFormat: 'Formato non supportato. Seleziona un file audio valido.',
            checkingDuration: 'Controllo la durata del file rispetto al tempo ancora disponibile...',
            audioTooLong: 'La traccia dura circa {{audioDuration}}, ma su questo FabaMe restano solo {{remainingDuration}}. Dividi il file in piu parti e riprova.',
            optimizingBeforeUpload: 'Verifico se il file puo essere alleggerito prima del caricamento...',
            fileTooLarge: 'Il file selezionato e {{finalSizeMb}} MB, il limite e {{maxSizeMb}} MB. Dividi il file in {{suggestedParts}} parti. <a href="{{splitAudioUrl}}" target="_blank" rel="noopener noreferrer">Taglialo qui</a>.',
            uploadingOptimized: 'Carico il file ottimizzato...',
            uploadingSelected: 'Carico il file selezionato...',
            uploadCompleted: 'Upload completato.',
            uploadError: 'Errore durante il caricamento.',
            uploadSuccessTitle: 'Audio caricato',
            uploadSuccessText: 'Il file è stato caricato correttamente su FabaMe.',
            continue: 'Continua',
            allDoneTitle: 'Tutto fatto!',
            allDoneBody: 'Torna sulla app e ricarica i FabaMe, vedrai la notifica dell\'audio appena inviato. Buon ascolto!<br/><br/>Non dimenticare la recensione.',
            leaveReview: 'Lascia una recensione',
            analyzeFormat: 'Analizzo il formato audio...',
            alreadyCompressed: 'Il file e\' gia\' in un formato compresso, uso l\'originale.',
            keepOriginal: 'Uso il file originale per mantenere la dimensione migliore.',
            decodeAudio: 'Decodifico il file audio...',
            convertMono: 'Converto l\'audio in mono...',
            createOptimizedMp3: 'Creo la versione MP3 mono ottimizzata...',
            finalizeOptimizedMp3: 'Finalizzo il file MP3 mono...'
        },
        inline: {
            record: 'Registra',
            uploadFromFile: 'Carica da file',
            selectAudioToUpload: 'Seleziona il file audio da caricare',
            unsupportedFileTitle: 'Formato file non supportato',
            unsupportedFileText: 'Si prega di caricare un file .wav o .mp3',
            ok: 'OK',
            convertingAndCompressing: 'Conversione e compressione',
            largeFileTitle: 'File di grandi dimensioni',
            largeFileText: 'Il file selezionato supera i {{maxSizeMb}} MB. Potrebbe causare errori durante il caricamento, è consigliabile dividere tracce lunghe in più caricamenti.',
            submitToFaba: 'Invia a FABA',
            uploading: 'Caricamento...'
        },
        errors: {
            optimizeAudio: 'Non sono riuscito a ottimizzare questo file audio. Prova con un altro file o dividilo in tracce piu brevi.',
            createMonoMp3: 'Non sono riuscito a creare una versione MP3 mono ottimizzata. Prova con un altro file o dividilo in tracce piu brevi.',
            mp3EncoderUnavailable: 'Encoder MP3 non disponibile.'
        },
        time: {
            hourShort: 'h',
            minuteShort: 'm',
            secondShort: 's'
        }
    },
    fr: {
        invite: {
            remainingTime: 'Temps encore disponible sur ce FabaMe : <strong>{{duration}}</strong>.',
            iconAlt: 'Icône FabaMore',
            welcomeTitle: 'FabaMore est pret !',
            welcomeBody: 'FabaMore vous permet de selectionner un fichier depuis votre ordinateur et de l\'envoyer vers FabaMe, sans devoir reenregistrer la piste audio.',
            helpLink: 'Besoin d\'aide ?',
            uploadAudio: 'Televerser un audio',
            preferRecord: 'Je prefere l\'enregistrer moi-meme',
            openFabamore: 'Ouvrir FabaMore',
            uploadTitle: 'Televerser un audio',
            uploadIntro: 'Vous pouvez televerser des fichiers <strong>.mp3 ou n\'importe quel format audio</strong>, meme volumineux. Avant l\'envoi, FabaMore verifie s\'il peut les alleger pour reduire le temps de televersement. Pour une meilleure experience, divisez les pistes audio tres longues.',
            yourName: 'Votre nom',
            trackTitle: 'Titre de la piste',
            dragAudio: 'Glissez le fichier audio ici',
            clickToSelect: 'ou cliquez pour le selectionner',
            submitToFabaMe: 'Envoyer a FabaMe',
            cancel: 'Annuler',
            selectedFile: 'Fichier selectionne : {{fileName}}',
            invalidInviteUrl: 'URL d\'invitation invalide : invitation ou jeton manquant.',
            enterName: 'Saisissez votre nom.',
            enterTitle: 'Saisissez le titre.',
            selectAudioFile: 'Selectionnez un fichier audio.',
            unsupportedAudioFormat: 'Format non pris en charge. Selectionnez un fichier audio valide.',
            checkingDuration: 'Verification de la duree du fichier par rapport au temps encore disponible...',
            audioTooLong: 'La piste dure environ {{audioDuration}}, mais il ne reste que {{remainingDuration}} sur ce FabaMe. Divisez le fichier en plusieurs parties puis reessayez.',
            optimizingBeforeUpload: 'Verification de la possibilite d\'alleger le fichier avant l\'envoi...',
            fileTooLarge: 'Le fichier selectionne fait {{finalSizeMb}} Mo, la limite est de {{maxSizeMb}} Mo. Divisez le fichier en {{suggestedParts}} parties. <a href="{{splitAudioUrl}}" target="_blank" rel="noopener noreferrer">Coupez-le ici</a>.',
            uploadingOptimized: 'Televersement du fichier optimise...',
            uploadingSelected: 'Televersement du fichier selectionne...',
            uploadCompleted: 'Televersement termine.',
            uploadError: 'Erreur pendant le televersement.',
            uploadSuccessTitle: 'Audio televerse',
            uploadSuccessText: 'Le fichier a ete televerse sur FabaMe avec succes.',
            continue: 'Continuer',
            allDoneTitle: 'C\'est termine !',
            allDoneBody: 'Revenez dans l\'application et rechargez les FabaMe, vous verrez la notification de l\'audio qui vient d\'etre envoye. Bonne ecoute !<br/><br/>N\'oubliez pas l\'avis.',
            leaveReview: 'Laisser un avis',
            analyzeFormat: 'Analyse du format audio...',
            alreadyCompressed: 'Le fichier est deja dans un format compresse, j\'utilise l\'original.',
            keepOriginal: 'J\'utilise le fichier original pour conserver la meilleure taille.',
            decodeAudio: 'Decodage du fichier audio...',
            convertMono: 'Conversion de l\'audio en mono...',
            createOptimizedMp3: 'Creation de la version MP3 mono optimisee...',
            finalizeOptimizedMp3: 'Finalisation du fichier MP3 mono...'
        },
        inline: {
            record: 'Enregistrer',
            uploadFromFile: 'Televerser depuis un fichier',
            selectAudioToUpload: 'Selectionnez le fichier audio a televerser',
            unsupportedFileTitle: 'Format de fichier non pris en charge',
            unsupportedFileText: 'Veuillez televerser un fichier .wav ou .mp3',
            ok: 'OK',
            convertingAndCompressing: 'Conversion et compression',
            largeFileTitle: 'Fichier volumineux',
            largeFileText: 'Le fichier selectionne depasse {{maxSizeMb}} Mo. Cela peut provoquer des erreurs de televersement ; il est recommande de diviser les pistes longues en plusieurs envois.',
            submitToFaba: 'Envoyer a FABA',
            uploading: 'Televersement...'
        },
        errors: {
            optimizeAudio: 'Je n\'ai pas pu optimiser ce fichier audio. Essayez avec un autre fichier ou divisez-le en pistes plus courtes.',
            createMonoMp3: 'Je n\'ai pas pu creer une version MP3 mono optimisee. Essayez avec un autre fichier ou divisez-le en pistes plus courtes.',
            mp3EncoderUnavailable: 'Encodeur MP3 indisponible.'
        },
        time: {
            hourShort: 'h',
            minuteShort: 'min',
            secondShort: 's'
        }
    },
    es: {
        invite: {
            remainingTime: 'Tiempo aun disponible en este FabaMe: <strong>{{duration}}</strong>.',
            iconAlt: 'Icono de FabaMore',
            welcomeTitle: 'FabaMore esta listo!',
            welcomeBody: 'FabaMore te permite seleccionar un archivo desde tu ordenador y subirlo a FabaMe, sin tener que volver a grabar la pista de audio.',
            helpLink: 'Necesitas ayuda?',
            uploadAudio: 'Subir audio',
            preferRecord: 'Prefiero grabarlo yo',
            openFabamore: 'Abrir FabaMore',
            uploadTitle: 'Subir audio',
            uploadIntro: 'Puedes subir archivos <strong>.mp3 o cualquier formato de audio</strong>, incluso grandes. Antes del envio, FabaMore comprueba si puede hacerlos mas ligeros para reducir el tiempo de subida. Para una mejor experiencia, divide las pistas de audio muy largas.',
            yourName: 'Tu nombre',
            trackTitle: 'Titulo de la pista',
            dragAudio: 'Arrastra aqui el archivo de audio',
            clickToSelect: 'o haz clic para seleccionarlo',
            submitToFabaMe: 'Enviar a FabaMe',
            cancel: 'Cancelar',
            selectedFile: 'Archivo seleccionado: {{fileName}}',
            invalidInviteUrl: 'URL de invitacion no valida: falta la invitacion o el token.',
            enterName: 'Introduce tu nombre.',
            enterTitle: 'Introduce el titulo.',
            selectAudioFile: 'Selecciona un archivo de audio.',
            unsupportedAudioFormat: 'Formato no compatible. Selecciona un archivo de audio valido.',
            checkingDuration: 'Comprobando la duracion del archivo con respecto al tiempo aun disponible...',
            audioTooLong: 'La pista dura aproximadamente {{audioDuration}}, pero en este FabaMe solo quedan {{remainingDuration}}. Divide el archivo en varias partes y vuelve a intentarlo.',
            optimizingBeforeUpload: 'Comprobando si el archivo puede hacerse mas ligero antes de subirlo...',
            fileTooLarge: 'El archivo seleccionado pesa {{finalSizeMb}} MB y el limite es {{maxSizeMb}} MB. Divide el archivo en {{suggestedParts}} partes. <a href="{{splitAudioUrl}}" target="_blank" rel="noopener noreferrer">Cortalo aqui</a>.',
            uploadingOptimized: 'Subiendo el archivo optimizado...',
            uploadingSelected: 'Subiendo el archivo seleccionado...',
            uploadCompleted: 'Subida completada.',
            uploadError: 'Error durante la subida.',
            uploadSuccessTitle: 'Audio subido',
            uploadSuccessText: 'El archivo se ha subido correctamente a FabaMe.',
            continue: 'Continuar',
            allDoneTitle: 'Todo listo!',
            allDoneBody: 'Vuelve a la aplicacion y recarga los FabaMe; veras la notificacion del audio que acabas de enviar. Disfruta la escucha.<br/><br/>No olvides dejar una resena.',
            leaveReview: 'Dejar una resena',
            analyzeFormat: 'Analizando el formato de audio...',
            alreadyCompressed: 'El archivo ya esta en un formato comprimido, usare el original.',
            keepOriginal: 'Usare el archivo original para mantener el mejor tamano.',
            decodeAudio: 'Decodificando el archivo de audio...',
            convertMono: 'Convirtiendo el audio a mono...',
            createOptimizedMp3: 'Creando la version MP3 mono optimizada...',
            finalizeOptimizedMp3: 'Finalizando el archivo MP3 mono...'
        },
        inline: {
            record: 'Grabar',
            uploadFromFile: 'Subir desde archivo',
            selectAudioToUpload: 'Selecciona el archivo de audio para subir',
            unsupportedFileTitle: 'Formato de archivo no compatible',
            unsupportedFileText: 'Sube un archivo .wav o .mp3',
            ok: 'OK',
            convertingAndCompressing: 'Convirtiendo y comprimiendo',
            largeFileTitle: 'Archivo grande',
            largeFileText: 'El archivo seleccionado supera los {{maxSizeMb}} MB. Puede causar errores durante la subida, por lo que se recomienda dividir las pistas largas en varias cargas.',
            submitToFaba: 'Enviar a FABA',
            uploading: 'Subiendo...'
        },
        errors: {
            optimizeAudio: 'No he podido optimizar este archivo de audio. Prueba con otro archivo o dividelo en pistas mas cortas.',
            createMonoMp3: 'No he podido crear una version MP3 mono optimizada. Prueba con otro archivo o dividelo en pistas mas cortas.',
            mp3EncoderUnavailable: 'Codificador MP3 no disponible.'
        },
        time: {
            hourShort: 'h',
            minuteShort: 'min',
            secondShort: 's'
        }
    }
};
const CURRENT_LANGUAGE = detectCurrentLanguage();
const inviteApiState = {
    status: 'pending',
    response: null,
    listenerAttached: false,
    waiters: []
};
let sweetAlertReadyPromise = null;

function detectCurrentLanguage() {
    const pathLocaleMatch = window.location.pathname.match(/^\/([a-z]{2})(?:\/|$)/i);
    const candidates = [
        pathLocaleMatch ? pathLocaleMatch[1] : '',
        document.documentElement && document.documentElement.lang ? document.documentElement.lang : '',
        navigator.language || '',
        navigator.languages && navigator.languages.length ? navigator.languages[0] : ''
    ];

    for (const candidate of candidates) {
        const normalizedLanguage = normalizeLanguage(candidate);
        if (SUPPORTED_LANGUAGES.includes(normalizedLanguage)) {
            return normalizedLanguage;
        }
    }

    return 'en';
}

function normalizeLanguage(value) {
    return typeof value === 'string' && value
        ? value.toLowerCase().split(/[-_]/)[0]
        : '';
}

function getTranslationValue(key) {
    const languages = [CURRENT_LANGUAGE, 'en'];
    for (const language of languages) {
        const translation = TRANSLATIONS[language];
        if (!translation) {
            continue;
        }

        const value = key.split('.').reduce((result, segment) => (
            result && Object.prototype.hasOwnProperty.call(result, segment) ? result[segment] : undefined
        ), translation);

        if (typeof value === 'string') {
            return value;
        }
    }

    return key;
}

function t(key, replacements = {}) {
    return getTranslationValue(key).replace(/\{\{(\w+)\}\}/g, (match, name) => (
        Object.prototype.hasOwnProperty.call(replacements, name) ? String(replacements[name]) : match
    ));
}

if (isInvitePage) {
    setupInviteAjaxObserver();
    initInviteFlow();
} else {
    onDocumentBodyReady(async () => {
        await ensureSwalReady();
        initFabamore();
    });
}

async function initInviteFlow() {
    const inviteState = await waitForInviteApiState();
    if (inviteState.status !== 'valid') {
        return;
    }

    await ensureSwalReady();

    onDocumentBodyReady(() => {
        showInviteWelcomePopup();
    });
}

function setupInviteAjaxObserver() {
    if (inviteApiState.listenerAttached) {
        return;
    }

    inviteApiState.listenerAttached = true;
    window.addEventListener('message', handleInviteAjaxMessage);
    injectInviteAjaxHook();
}

function injectInviteAjaxHook() {
    if (document.getElementById('fabamore-invite-ajax-hook')) {
        return;
    }

    const script = document.createElement('script');
    script.id = 'fabamore-invite-ajax-hook';
    script.src = chrome.runtime.getURL('assets/js/invite-ajax-hook.js');
    script.async = false;
    script.onload = () => {
        script.remove();
    };
    (document.head || document.documentElement).appendChild(script);
}

function handleInviteAjaxMessage(event) {
    if (event.source !== window || !event.data || event.data.source !== INVITE_AJAX_HOOK_SOURCE) {
        return;
    }

    const inviteContext = getInviteContext();
    if (inviteContext.inviteId && event.data.invitePublicId && inviteContext.inviteId !== event.data.invitePublicId) {
        return;
    }

    const parsedResponse = parseInviteAjaxResponseBody(event.data.body);
    if (!parsedResponse) {
        return;
    }

    if (parsedResponse.ok) {
        setInviteApiState('valid', parsedResponse);
        return;
    }

    setInviteApiState('invalid', parsedResponse);
}

function parseInviteAjaxResponseBody(body) {
    if (typeof body !== 'string' || !body.trim()) {
        return null;
    }

    const segments = {};
    body.split(/\r?\n/).forEach((line) => {
        const match = line.match(/^(\d+):(.*)$/);
        if (!match) {
            return;
        }

        try {
            segments[match[1]] = JSON.parse(match[2]);
        } catch (error) {
            return;
        }
    });

    if (segments['1'] && typeof segments['1'].ok === 'boolean') {
        return segments['1'];
    }

    try {
        const parsed = JSON.parse(body);
        return parsed && typeof parsed.ok === 'boolean' ? parsed : null;
    } catch (error) {
        return null;
    }
}

function setInviteApiState(status, response) {
    inviteApiState.status = status;
    inviteApiState.response = response;

    while (inviteApiState.waiters.length) {
        const waiter = inviteApiState.waiters.shift();
        waiter({status, response});
    }
}

function waitForInviteApiState() {
    return new Promise((resolve) => {
        if (inviteApiState.status !== 'pending') {
            resolve({status: inviteApiState.status, response: inviteApiState.response});
            return;
        }

        const timeoutId = setTimeout(() => {
            const timeoutState = {
                status: inviteApiState.status === 'pending' ? 'timeout' : inviteApiState.status,
                response: inviteApiState.response
            };

            inviteApiState.waiters = inviteApiState.waiters.filter((waiter) => waiter !== finalize);
            resolve(timeoutState);
        }, INVITE_AJAX_WAIT_TIMEOUT_MS);

        const finalize = (state) => {
            clearTimeout(timeoutId);
            resolve(state);
        };

        inviteApiState.waiters.push(finalize);
    });
}

function getInviteContext() {
    const pathnameMatch = window.location.pathname.match(/^\/([a-z]{2})\/invites\/([^/?#]+)/i);
    const localePrefix = pathnameMatch ? `/${pathnameMatch[1]}` : '';
    const inviteId = pathnameMatch ? pathnameMatch[2] : null;
    const token = new URLSearchParams(window.location.search).get('token');
    const inviteData = inviteApiState.response && inviteApiState.response.data ? inviteApiState.response.data : null;

    return {
        localePrefix,
        inviteId,
        token,
        inviteData,
        remainingTime: inviteData && inviteData.limits && typeof inviteData.limits.remainingTime === 'number'
            ? inviteData.limits.remainingTime
            : null
    };
}

function onDocumentBodyReady(callback) {
    if (document.body) {
        callback();
        return;
    }

    const observer = new MutationObserver(() => {
        if (!document.body) {
            return;
        }

        observer.disconnect();
        callback();
    });

    observer.observe(document.documentElement, {childList: true, subtree: true});
}

function ensureSwalMixin() {
    if (typeof Swal === 'undefined' || !Swal || !Swal.mixin) {
        return;
    }

    if (Swal.__fabamoreConfigured) {
        return;
    }

    Swal = Swal.mixin({
        allowOutsideClick: false
    });
    Swal.__fabamoreConfigured = true;
}

function ensureSwalReady() {
    if (typeof Swal !== 'undefined' && Swal && Swal.fire) {
        ensureSwalMixin();
        return Promise.resolve(Swal);
    }

    if (sweetAlertReadyPromise) {
        return sweetAlertReadyPromise;
    }

    sweetAlertReadyPromise = new Promise((resolve) => {
        const startTime = Date.now();
        const intervalId = window.setInterval(() => {
            if (typeof Swal !== 'undefined' && Swal && Swal.fire) {
                window.clearInterval(intervalId);
                ensureSwalMixin();
                resolve(Swal);
                return;
            }

            if (Date.now() - startTime >= SWEETALERT_WAIT_TIMEOUT_MS) {
                window.clearInterval(intervalId);
                fabamore.console.error('SweetAlert2 did not become available in time.');
                resolve(null);
            }
        }, 50);
    });

    return sweetAlertReadyPromise;
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
    const remainingTimeHtml = typeof inviteContext.remainingTime === 'number'
        ? `<p style="margin-top:10px;font-size:13px;color:#555;">${t('invite.remainingTime', {duration: formatDurationFromSeconds(inviteContext.remainingTime)})}</p>`
        : '';

    Swal.fire({
        imageUrl: iconUrl,
        imageWidth: 180,
        imageHeight: 180,
        imageAlt: t('invite.iconAlt'),
        title: t('invite.welcomeTitle'),
        html: '<p><span style="display:inline-block;padding:4px 10px;border-radius:9999px;border:2px solid #ed555a;color:#ed555a;font-size:12px;font-weight:700;">' + FABAMORE_LABEL + '</span></p><p style="margin-top:12px;">' + t('invite.welcomeBody') + '</p>' + remainingTimeHtml + '<p style="margin-top:14px;"><a href="https://mircobabini.dev/fabamore-per-faba-e-faba-plus/" target="_blank" rel="noopener noreferrer" style="color:#ed555a;text-decoration:underline;font-weight:600;">' + t('invite.helpLink') + '</a></p>',
        confirmButtonText: t('invite.uploadAudio'),
        showCancelButton: true,
        cancelButtonText: t('invite.preferRecord'),
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
    badge.title = t('invite.openFabamore');
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
        title: t('invite.uploadTitle'),
        html: '' +
            '<p style="margin:0 0 12px 0;font-size:14px;line-height:1.45;color:#2a2a2a;">' + t('invite.uploadIntro') + '</p>' +
            '<input id="fabamore-name" class="swal2-input" placeholder="' + t('invite.yourName') + '" />' +
            '<input id="fabamore-title" class="swal2-input" placeholder="' + t('invite.trackTitle') + '" />' +
            '<div id="fabamore-dropzone" style="margin-top:10px;border:2px dashed #ed555a;border-radius:14px;padding:18px 14px;text-align:center;background:#fff8f8;cursor:pointer;">' +
                '<div style="font-weight:700;color:#ed555a;">' + t('invite.dragAudio') + '</div>' +
                '<div style="font-size:13px;color:#555;margin-top:4px;">' + t('invite.clickToSelect') + '</div>' +
                '<div id="fabamore-selected-file" style="margin-top:8px;font-size:12px;color:#222;"></div>' +
            '</div>' +
            '<div id="fabamore-upload-status" style="display:none;margin-top:12px;padding:10px 12px;border-radius:12px;background:#fff3f3;color:#a63b3f;font-size:13px;line-height:1.4;">' +
                '<div id="fabamore-upload-status-text"></div>' +
                '<div id="fabamore-progress-track" style="display:none;margin-top:8px;height:8px;border-radius:999px;background:rgba(237,85,90,0.18);overflow:hidden;">' +
                    '<div id="fabamore-progress-bar" style="width:0%;height:100%;border-radius:999px;background:#ed555a;transition:width 120ms ease;"></div>' +
                '</div>' +
            '</div>' +
            '<input id="fabamore-audio" style="display:none;" type="file" accept="audio/*,.mp3,.wav,.webm,.m4a,.aac,.ogg,.oga,.opus,.mp4" />',
        confirmButtonText: t('invite.submitToFabaMe'),
        showCancelButton: true,
        cancelButtonText: t('invite.cancel'),
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
                    selectedFile.textContent = t('invite.selectedFile', {fileName: audioInput.files[0].name});
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
                Swal.showValidationMessage(t('invite.invalidInviteUrl'));
                return false;
            }

            if (!name) {
                Swal.showValidationMessage(t('invite.enterName'));
                return false;
            }

            if (!title) {
                Swal.showValidationMessage(t('invite.enterTitle'));
                return false;
            }

            if (!audioFile) {
                Swal.showValidationMessage(t('invite.selectAudioFile'));
                return false;
            }

            if (!isSupportedInviteAudioFile(audioFile)) {
                Swal.showValidationMessage(t('invite.unsupportedAudioFormat'));
                return false;
            }

            try {
                if (typeof inviteContext.remainingTime === 'number' && inviteContext.remainingTime >= 0) {
                    setInviteUploadStatus(t('invite.checkingDuration'), 'info', 3);
                    const audioDurationSeconds = await getAudioFileDurationSeconds(audioFile);

                    if (typeof audioDurationSeconds === 'number' && audioDurationSeconds > inviteContext.remainingTime) {
                        setInviteUploadStatus('');
                        Swal.showValidationMessage(
                            t('invite.audioTooLong', {
                                audioDuration: formatDurationFromSeconds(audioDurationSeconds),
                                remainingDuration: formatDurationFromSeconds(inviteContext.remainingTime)
                            })
                        );
                        return false;
                    }
                }

                setInviteUploadStatus(t('invite.optimizingBeforeUpload'), 'info', 5);
                const preparedAudio = await prepareInviteAudioFileForUpload(audioFile, (progress) => {
                    setInviteUploadStatus(progress.message, 'info', progress.percent);
                });

                if (preparedAudio.finalFile.size >= getInviteUploadMaxSizeBytes()) {
                    const finalSizeMb = formatFileSizeMb(preparedAudio.finalFile.size);
                    const maxSizeMb = formatFileSizeMb(getInviteUploadMaxSizeBytes());
                    const suggestedParts = Math.ceil(preparedAudio.finalFile.size / getInviteUploadMaxSizeBytes());
                    setInviteUploadStatus('');
                    Swal.showValidationMessage(
                        t('invite.fileTooLarge', {
                            finalSizeMb,
                            maxSizeMb,
                            suggestedParts,
                            splitAudioUrl: 'https://clideo.com/cut-audio'
                        })
                    );
                    return false;
                }

                setInviteUploadStatus(
                    preparedAudio.wasOptimized
                        ? t('invite.uploadingOptimized')
                        : t('invite.uploadingSelected'),
                    'info',
                    95
                );
                await uploadInviteRecording(inviteContext, {name, title, audioFile: preparedAudio.finalFile});
                setInviteUploadStatus(t('invite.uploadCompleted'), 'success', 100);
                return true;
            } catch (error) {
                setInviteUploadStatus('');
                const message = error && error.message ? error.message : t('invite.uploadError');
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
        title: t('invite.uploadSuccessTitle'),
        text: t('invite.uploadSuccessText'),
        confirmButtonText: t('invite.continue'),
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
        title: t('invite.allDoneTitle'),
        html: t('invite.allDoneBody'),
        confirmButtonText: t('invite.leaveReview'),
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
    const isItalianLanguage = CURRENT_LANGUAGE === 'it';

    try {
        const extensionBaseUrl = typeof browser !== 'undefined'
            && browser.runtime
            && browser.runtime.getURL
            ? browser.runtime.getURL('')
            : '';
        const isFirefox = extensionBaseUrl.startsWith('moz-extension://');
        if (isFirefox) {
            return isItalianLanguage ? FIREFOX_REVIEW_URL_IT : FIREFOX_REVIEW_URL_DEFAULT;
        }

        return isItalianLanguage ? CHROME_REVIEW_URL_IT : CHROME_REVIEW_URL_DEFAULT;
    } catch (error) {
        return isItalianLanguage ? CHROME_REVIEW_URL_IT : CHROME_REVIEW_URL_DEFAULT;
    }
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

function formatDurationFromSeconds(seconds) {
    const safeSeconds = Math.max(0, Math.ceil(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;
    const hourShort = t('time.hourShort');
    const minuteShort = t('time.minuteShort');
    const secondShort = t('time.secondShort');

    if (hours > 0) {
        return remainingSeconds > 0
            ? `${hours}${hourShort} ${minutes}${minuteShort} ${remainingSeconds}${secondShort}`
            : `${hours}${hourShort} ${minutes}${minuteShort}`;
    }

    if (minutes > 0) {
        return remainingSeconds > 0
            ? `${minutes}${minuteShort} ${remainingSeconds}${secondShort}`
            : `${minutes}${minuteShort}`;
    }

    return `${safeSeconds}${secondShort}`;
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

async function getAudioFileDurationSeconds(file) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    try {
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();
        return audioBuffer.duration;
    } catch (error) {
        audioCtx.close();
        fabamore.console.warn('Could not read audio duration before upload.', error);
        return null;
    }
}

async function prepareInviteAudioFileForUpload(file, onProgress) {
    const originalFile = file;
    const canTryOptimization = isSupportedInviteAudioFile(file);

    reportInviteAudioProgress(onProgress, t('invite.analyzeFormat'), 8);

    if (!canTryOptimization) {
        return {
            finalFile: originalFile,
            wasOptimized: false,
            optimizedLabel: ''
        };
    }

    if (shouldKeepOriginalInviteAudioFile(originalFile)) {
        reportInviteAudioProgress(onProgress, t('invite.alreadyCompressed'), 90);
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

    reportInviteAudioProgress(onProgress, t('invite.keepOriginal'), 90);
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
    originalButton.textContent = t('inline.record');

    // Clone the button
    const clonedButton = originalButton.cloneNode(true);

    // Update the text of the cloned button
    clonedButton.textContent = t('inline.uploadFromFile');
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
            fileInputLabel.textContent = t('inline.selectAudioToUpload');
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
                        title: t('inline.unsupportedFileTitle'),
                        text: t('inline.unsupportedFileText'),
                        confirmButtonText: t('inline.ok'),
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
                            title: t('inline.convertingAndCompressing'),
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
                        title: t('inline.largeFileTitle'),
                        text: t('inline.largeFileText', {maxSizeMb}),
                        confirmButtonText: t('inline.ok'),
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
            customSubmit.textContent = t('inline.submitToFaba');
            // Insert after file input
            fileInput.parentNode.appendChild(customSubmit, lastItemHook);

            // Add submit event listener to the form to update button state
            const parentForm = fileInput.closest('form');
            if (parentForm) {
                parentForm.addEventListener('submit', function (e) {
                    // If the event is not prevented (no validation error), update button
                    setTimeout(() => {
                        if (!e.defaultPrevented) {
                            customSubmit.textContent = t('inline.uploading');
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
        throw new Error(t('errors.optimizeAudio'));
    }
}

async function convertAudioFileToMonoMp3Candidate(file, onProgress) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    try {
        reportInviteAudioProgress(onProgress, t('invite.decodeAudio'), 15);
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioCtx.close();

        reportInviteAudioProgress(onProgress, t('invite.convertMono'), 35);
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
            reportInviteAudioProgress(onProgress, t('invite.createOptimizedMp3'), encodeProgress);
        }

        reportInviteAudioProgress(onProgress, t('invite.finalizeOptimizedMp3'), 92);
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
        throw new Error(t('errors.createMonoMp3'));
    }
}

function getLameJsEncoder() {
    if (typeof lamejs !== 'undefined' && lamejs && lamejs.Mp3Encoder) {
        return lamejs;
    }

    if (window.lamejs && window.lamejs.Mp3Encoder) {
        return window.lamejs;
    }

    throw new Error(t('errors.mp3EncoderUnavailable'));
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
