window.fabamore = {
    'console': console
};

fabamore.console.log = () => {
};
fabamore.console.warn = () => {
};
fabamore.console.error = () => {
};

// Find the button based on its class and text content
const originalButton = document.querySelector(
  "button.bg-white.rounded-full.py-2.px-7.mb-3"
);

// Check if the button exists
if (originalButton) {
    originalButton.textContent = "Registra";

    // Clone the button
    const clonedButton = originalButton.cloneNode(true);

    // Update the text of the cloned button
    clonedButton.textContent = "Carica WAV";

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

            // prepend the file input with a span: <p class="text-white font-bold text-center mb-3">Seleziona il file audio da caricare</p>
            const fileInputLabel = document.createElement('p');
            fileInputLabel.className = 'text-white font-bold text-center mb-3';
            fileInputLabel.textContent = 'Seleziona il file audio da caricare';
            fileInput.parentNode.insertBefore(fileInputLabel, fileInput);

            // add 20px margin before and after the file input
            fileInputLabel.style.marginTop = '20px';
            fileInput.style.margin = '0 0 20px 50px';

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
} else {
    fabamore.console.warn('Recording not found.');
}
