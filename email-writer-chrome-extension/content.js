console.log("AI EMail Assistant is running...");

function createAIButton() {

const button = document.createElement('div');

button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
button.style.marginRight = '8px';
button.innerHTML = 'AI Reply';
button.setAttribute('role', 'button');
button.setAttribute('data-tooltip', 'Generate AI Reply');

return button;
    
}


function findComposeToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role = "toolbar"]',
        '.gU.Up'
    ];
    
    for(const selector of selectors) {
        const toolbar = document.querySelector(selector);
    
        if(toolbar) {
            return toolbar;
        }
    
        return null;
        
    }
}

function injectButton() {

    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton) {
        existingButton.remove();
    }

    const toolbar = findComposeToolbar();
    if(!toolbar) {
        console.log("toolbar not found!");
        return;
    }

    console.log("Toolbar found adding AI button");
    const button = createAIButton();

    button.classList.add('ai-reply-button');

    button.addEventListener('click', async () => {

    });

    toolbar.insertBefore(button, toolbar.firstChild);


}


const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposedEelements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role = "dialog"]') || node.querySelector('.aDh, .btC, [role = "dialog"]'))
        );
        
        if(hasComposedEelements) {
            console.log("Composed Window Detected");
            setTimeout(injectButton, 500);
        }     
        
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});