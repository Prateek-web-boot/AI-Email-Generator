console.log("AI EMail Assistant is running...");

function createAIButton() {

    const container = document.createElement('div');
    container.className = 'ai-reply-button-container';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.marginRight = '8px'; // Maintain original spacing

    const button = document.createElement('div');

    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.style.borderTopRightRadius = '0'; // For a smoother look with the dropdown
    button.style.borderBottomRightRadius = '0';

    // Dropdown arrow button
    const dropdownArrow = document.createElement('div');
    dropdownArrow.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'; // Gmail button classes
    dropdownArrow.innerHTML = '&#9660;'; // Down arrow character
    dropdownArrow.setAttribute('role', 'button');
    dropdownArrow.setAttribute('data-tooltip', 'Select Reply Tone');
    dropdownArrow.style.marginLeft = '-1px'; // To visually merge with the main button
    dropdownArrow.style.borderTopLeftRadius = '0';
    dropdownArrow.style.borderBottomLeftRadius = '0';
    dropdownArrow.style.paddingLeft = '5px';
    dropdownArrow.style.paddingRight = '5px';

    // Dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'ai-reply-dropdown-content';
    dropdownContent.style.display = 'none'; // Hidden by default
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.backgroundColor = '#f9f9f9';
    dropdownContent.style.minWidth = '160px';
    dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
    dropdownContent.style.zIndex = '1';
    dropdownContent.style.borderRadius = '4px';
    dropdownContent.style.top = '100%'; // Position below the button
    dropdownContent.style.left = '0';

    const tones = ['Professional', 'Friendly', 'Casual', 'Concise', 'Empathetic']; // Define your tones


    tones.forEach(tone => {
        const option = document.createElement('a');
        option.href = '#';
        option.innerText = tone;
        option.className = 'ai-reply-dropdown-option';
        option.style.color = 'black';
        option.style.padding = '12px 16px';
        option.style.textDecoration = 'none';
        option.style.display = 'block';
        option.style.fontSize = '13px'; // Match Gmail's font size
        option.style.whiteSpace = 'nowrap'; // Prevent text wrapping
        option.onmouseover = function () { this.style.backgroundColor = '#ddd'; };
        option.onmouseout = function () { this.style.backgroundColor = '#f9f9f9'; };
        option.onclick = (e) => {
            e.preventDefault();
            button.dataset.selectedTone = tone.toLowerCase(); // Store selected tone
            button.innerHTML = `AI Reply (${tone})`; // Update button text to show selected tone
            dropdownContent.style.display = 'none'; // Hide dropdown after selection
            console.log(`Selected tone: ${tone}`);
        };
        dropdownContent.appendChild(option);
    });

    // Default selected tone
    button.dataset.selectedTone = 'professional';
    button.innerHTML = 'AI Reply (Professional)'; // Show default tone

    dropdownArrow.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing
        dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'block' : 'none';
    });

    // Close the dropdown if the user clicks outside of it
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    });

    container.appendChild(button);
    container.appendChild(dropdownArrow);
    container.appendChild(dropdownContent);

    // Attach the main button for event listener access in injectButton
    container.mainButton = button;
    return container;


}


function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '[role = "presentation"]'

    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);

        if (content) {
            return content.innerText.trim();
        }

    }
    return '';
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role = "toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }

    }
    return null;
}

function injectButton() {

    const existingContainer = document.querySelector('.ai-reply-button-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("toolbar not found!");
        return;
    }

    console.log("Toolbar found adding AI button with tone selector");
    const buttonContainer = createAIButton();
    const mainButton = buttonContainer.mainButton; // Get the reference to the actual button inside the container


    // mainButton.classList.add('ai-reply-button');

    mainButton.addEventListener('click', async () => {
        const selectedTone = mainButton.dataset.selectedTone || 'professional'; // Get selected tone, default to 'professional'


        try {
            mainButton.innerHTML = "Generating...";
            mainButton.disabled = true;
            buttonContainer.querySelector('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3[data-tooltip="Select Reply Tone"]').disabled = true; // Disable dropdown button too


            const emailContent = getEmailContent();

            const response = await fetch("https://ai-email-reply-dayq.onrender.com/api/email/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: selectedTone
                })
            });

            if (!response.ok) {
                throw new Error("API request Failed!");
            }

            const generatedReply = await response.text();

            //class="Am aiL aO9 Al editable LW-avf tS-tW"
            //g_editable="true"
            //role="textbox"

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.innerHTML = '';
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('ComposeBox Not found !');
            }

        } catch (error) {
            console.error(error);
            alert("Failed to Generate Reply!");

        } finally {
            mainButton.disabled = false;
            buttonContainer.querySelector('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3[data-tooltip="Select Reply Tone"]').disabled = false; // Re-enable dropdown button
            mainButton.innerHTML = `AI Reply (${mainButton.dataset.selectedTone})`; // Revert to showing selected tone
        }

    });

    toolbar.insertBefore(buttonContainer, toolbar.firstChild);

}


const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedEelements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role = "dialog"]') || node.querySelector('.aDh, .btC, [role = "dialog"]'))
        );

        if (hasComposedEelements) {
            console.log("Composed Window Detected");
            requestAnimationFrame(() => setTimeout(injectButton, 500));
        }

    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});