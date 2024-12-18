class ResponsiveSiteNavigationElement extends HTMLElement {
    constructor() {
        super();

		const self = this;

        if (!CustomElementHelpers.headings.includes(self.children[0].tagName)) return;
        if (!['UL', 'OL'].includes(self.children[1].tagName)) return;
        if (2 < self.children.length) return;

        let headingText = self.children[0].textContent;

		let dialogModalElement = CustomElementHelpers.createElementFromString(`
           <section
                id="section--site-navigation-menu"
                aria-labelledby="site-navigation-menu"
                is="dialog-modal-element"
                hidden
            >
                <h3 id="site-navigation-menu"><span class="visually-hidden">${headingText} </span>Menu</h3>
            </section>
        `);

        let clonedNodes = [];

        Array.from(self.children).forEach((child, i) => {
            if (
                (0 === i)
                && (CustomElementHelpers.headings.includes(child.tagName))
            ) {
                return;
            }

            clonedNodes.push(child.cloneNode(true));
        });

        self.appendChild(dialogModalElement);

        dialogModalElement = self.querySelector('[is="dialog-modal-element"]');

        clonedNodes.forEach(node => {
            dialogModalElement.appendChild(node);
        });

        let list = self.querySelector(':scope > ul, :scope > ol');

        list.hidden = true;

        self.dataset.defined = 'true';
	}
}

customElements.define(
    'responsive-site-navigation-element',
    ResponsiveSiteNavigationElement,
    {
        extends: 'nav'
    }
);