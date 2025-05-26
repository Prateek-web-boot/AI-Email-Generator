console.log("AI EMail Assistant is running...");

function injectButton() {

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