console.log("AI EMail Assistant is running...");

// Function to create the AI button with a dropdown for tone selection
function createAIButton() {
    const mergedButtonContainer = document.createElement('div');
    mergedButtonContainer.className = 'T-I J-J5-Ji aoO v7 T-I-atl hG L3 ai-reply-merged-button-container';
    mergedButtonContainer.setAttribute('role', 'button');
    mergedButtonContainer.setAttribute('data-tooltip', 'Generate AI Reply / Select Tone');

    mergedButtonContainer.style.position = 'relative';
    mergedButtonContainer.style.display = 'inline-flex';
    mergedButtonContainer.style.marginRight = '8px';
    mergedButtonContainer.style.verticalAlign = 'middle';
    mergedButtonContainer.style.boxSizing = 'border-box';
    mergedButtonContainer.style.lineHeight = '0';
    mergedButtonContainer.style.cursor = 'pointer';


    const aiTextSpan = document.createElement('span');
    aiTextSpan.innerText = 'AI Reply';
    aiTextSpan.className = 'ai-reply-text';
    aiTextSpan.style.flexGrow = '1';
    aiTextSpan.style.display = 'flex';
    aiTextSpan.style.alignItems = 'center';
    aiTextSpan.style.justifyContent = 'center';
    aiTextSpan.style.padding = '0 8px';
    aiTextSpan.style.fontWeight = 'bold';
    aiTextSpan.style.whiteSpace = 'nowrap';
    aiTextSpan.style.pointerEvents = 'auto';


    const dropdownArrowPart = document.createElement('span');
    dropdownArrowPart.className = 'ai-reply-dropdown-arrow-part G-asx';
    dropdownArrowPart.innerHTML = '<span class="e-G"></span><span class="e-G">&#9660;</span>';
    dropdownArrowPart.setAttribute('data-tooltip', 'Select Reply Tone');
    dropdownArrowPart.style.flexShrink = '0';
    dropdownArrowPart.style.width = '20px';
    dropdownArrowPart.style.display = 'flex';
    dropdownArrowPart.style.alignItems = 'center';
    dropdownArrowPart.style.justifyContent = 'center';
    dropdownArrowPart.style.height = '100%';
    dropdownArrowPart.style.boxSizing = 'border-box';
    dropdownArrowPart.style.cursor = 'pointer';
    dropdownArrowPart.style.pointerEvents = 'auto';


    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'ai-reply-dropdown-content';
    dropdownContent.style.display = 'none';
    dropdownContent.style.position = 'absolute';


    const tones = ['Professional', 'Friendly', 'Casual', 'Sarcastic'];

    tones.forEach(tone => {
        const option = document.createElement('a');
        option.href = '#';
        option.innerText = tone;
        option.className = 'ai-reply-dropdown-option';
        option.onclick = (e) => {
            e.preventDefault();
            aiTextSpan.dataset.selectedTone = tone.toLowerCase();
            aiTextSpan.innerText = `AI Reply (${tone.charAt(0).toUpperCase() + tone.slice(1)})`;
            dropdownContent.style.display = 'none';
            if (dropdownContent.parentNode === document.body) {
                document.body.removeChild(dropdownContent);
            }
            console.log(`Selected tone: ${tone}`);
        };
        dropdownContent.appendChild(option);
    });

    aiTextSpan.dataset.selectedTone = 'professional';
    aiTextSpan.innerText = 'AI Reply (Professional)';

    // This event listener needs to be aware of `mergedButtonContainer`, `dropdownArrowPart`, and `dropdownContent`
    // within its own scope, or access them from the object it is attached to (mergedButtonContainer).
    // For simplicity, we can rely on `aiTextSpan` accessing `mergedButtonContainer` as its parent,
    // and `dropdownArrowPart` and `dropdownContent` passed via the `mergedButtonContainer` object.
    aiTextSpan.addEventListener('click', async (e) => {
        e.stopPropagation();
        const selectedTone = aiTextSpan.dataset.selectedTone || 'professional';

        // Access properties directly from the button object itself
        const currentMergedButtonContainer = aiTextSpan.closest('.ai-reply-merged-button-container');
        const currentDropdownArrowPart = currentMergedButtonContainer ? currentMergedButtonContainer.dropdownArrowPart : null;
        const currentDropdownContent = currentMergedButtonContainer ? currentMergedButtonContainer.dropdownContent : null;


        try {
            aiTextSpan.innerText = "Generating...";
            if (currentMergedButtonContainer) {
                currentMergedButtonContainer.style.pointerEvents = 'none';
                currentMergedButtonContainer.style.opacity = '0.7';
            }


            if (currentDropdownArrowPart) {
                currentDropdownArrowPart.style.pointerEvents = 'none';
            }

            if (currentDropdownContent && currentDropdownContent.style.display === 'block') {
                 currentDropdownContent.style.display = 'none';
                 if (currentDropdownContent.parentNode === document.body) {
                    document.body.removeChild(currentDropdownContent);
                }
            }

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
            if (currentMergedButtonContainer) {
                currentMergedButtonContainer.style.pointerEvents = 'auto';
                currentMergedButtonContainer.style.opacity = '1';
            }


            if (currentDropdownArrowPart) {
                currentDropdownArrowPart.style.pointerEvents = 'auto';
            }
            aiTextSpan.innerText = `AI Reply (${aiTextSpan.dataset.selectedTone.charAt(0).toUpperCase() + aiTextSpan.dataset.selectedTone.slice(1)})`;
        }
    });


    dropdownArrowPart.addEventListener('click', (e) => {
        e.stopPropagation();

        if (dropdownContent.style.display === 'none') {
            const rect = mergedButtonContainer.getBoundingClientRect();

            dropdownContent.style.display = 'block';
            document.body.appendChild(dropdownContent);

            dropdownContent.style.top = `${rect.top + window.scrollY - dropdownContent.offsetHeight - 5}px`;
            dropdownContent.style.left = `${rect.left + window.scrollX}px`;

        } else {
            dropdownContent.style.display = 'none';
            if (dropdownContent.parentNode === document.body) {
                document.body.removeChild(dropdownContent);
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!mergedButtonContainer.contains(event.target) && !dropdownContent.contains(event.target) && dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            if (dropdownContent.parentNode === document.body) {
                document.body.removeChild(dropdownContent);
            }
        }
    });

    mergedButtonContainer.appendChild(aiTextSpan);
    mergedButtonContainer.appendChild(dropdownArrowPart);

    // Attach these elements as properties to the mergedButtonContainer for easier access later
    mergedButtonContainer.mainTextSpan = aiTextSpan;
    mergedButtonContainer.dropdownContent = dropdownContent;
    mergedButtonContainer.dropdownArrowPart = dropdownArrowPart;
    return mergedButtonContainer;
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
    const existingContainer = document.querySelector('.ai-reply-merged-button-container');
    if (existingContainer) {
        const existingDropdown = document.querySelector('.ai-reply-dropdown-content');
        if (existingDropdown && existingDropdown.parentNode === document.body) {
            document.body.removeChild(existingDropdown);
        }
        existingContainer.remove();
    }

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found!");
        return;
    }

    console.log("Toolbar found, adding AI button with tone selection");
    const mergedButtonContainer = createAIButton(); // This returns the button object

    // Directly use the properties attached to the returned object
    const mainTextSpan = mergedButtonContainer.mainTextSpan;
    const dropdownContent = mergedButtonContainer.dropdownContent;
    const dropdownArrowPart = mergedButtonContainer.dropdownArrowPart; // Corrected variable name

    toolbar.insertBefore(mergedButtonContainer, toolbar.firstChild);

    // The event listener for mainTextSpan is now inside createAIButton, so it has access
    // to dropdownArrowPart and dropdownContent through the currentMergedButtonContainer object.
    // If you need to add *another* listener here, you'd use the `mainTextSpan`, `dropdownContent`, `dropdownArrowPart`
    // variables defined right above this comment.

    // Example (if you needed another listener here, this is how you'd use them):
    /*
    mainTextSpan.addEventListener('someOtherEvent', () => {
        // You can now access mainTextSpan, dropdownContent, dropdownArrowPart here
        console.log('Another event on mainTextSpan. Dropdown content:', dropdownContent);
    });
    */
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