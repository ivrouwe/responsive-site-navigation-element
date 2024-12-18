class DialogModalElement extends HTMLElement {
    constructor() {
        super();

		const self = this;

		let idInteger = CustomElementHelpers.getUniqueIdInteger();

		let div = CustomElementHelpers.createElementFromString(`<div is="dialog-modal-element"></div>`),
			triggerControl = CustomElementHelpers.createElementFromString(`<button type="button" id="dialog-modal--${idInteger}__trigger-control" aria-controls="dialog-modal--${idInteger}"></button>`),
			dialog = CustomElementHelpers.createElementFromString(`<dialog id="dialog-modal--${idInteger}"></dialog>`),
			closeControl = CustomElementHelpers.createElementFromString(`<button type="button" id="dialog-modal--${idInteger}__close-control" class="dialog__close-control">Close<span class="visually-hidden"> Dialog</span></button>`),
			heading = this.querySelector(`#${this.getAttribute('aria-labelledby')}`),
			headingChildNodes = [];

		this.parentElement.insertBefore(div, this);

		div = this.previousElementSibling;

		let originalSection = this.parentElement.removeChild(this);

		heading.childNodes.forEach(node => {
			headingChildNodes.push(node.cloneNode(true));
		});
		
		div.appendChild(triggerControl);

		triggerControl = div.children[0];

		triggerControl.addEventListener('click', (e) => {
			let triggerControl = e.currentTarget,
				dialog = triggerControl.closest('[is="dialog-modal-element"]').querySelector(`#${triggerControl.getAttribute('aria-controls')}`),
				activeElement = dialog.querySelector('button.dialog__close-control');

			if (dialog.dataset.activeElement) {
				activeElement = dialog.querySelector(`#${dialog.dataset.activeElement}`);
			}

			dialog.dataset.triggeringElement = triggerControl.id;

			dialog.showModal(true);
			
			document.documentElement.dataset.showModal = 'true';

			activeElement.focus();
		});

		for (const node of headingChildNodes) {
			triggerControl.appendChild(node);
		}

		div.appendChild(dialog);

		dialog = div.children[1];

		dialog.appendChild(heading);

		dialog.setAttribute('aria-labelledby', heading.id);

		dialog.appendChild(closeControl);

		closeControl = dialog.children[1];

		closeControl.addEventListener('click', e => {
			let closeControl = e.currentTarget,
				dialog = closeControl.closest('dialog');

			dialog.close();
		});

		dialog.addEventListener('close', e => {
			let dialog = e.currentTarget,
				triggeringElement = document.querySelector(`#${dialog.dataset.triggeringElement}`);

			document.documentElement.removeAttribute('data-show-modal');
			triggeringElement.focus();
		});

		while (this.childNodes[0]) {
			dialog.appendChild(this.removeChild(this.childNodes[0]));
		}

		let dialogHeadings = dialog.querySelectorAll('h2, h3, h4, h5, h6'),
			startingHeadingLevel = parseInt(dialogHeadings[0].tagName.charAt(1)),
			startingHeadingLevelOffset = startingHeadingLevel - 2;

		if (0 !== startingHeadingLevelOffset) {
			dialogHeadings.forEach(heading => {
				const headingLevel = parseInt(heading.tagName.charAt(1));
				let newHeadingLevel = headingLevel - startingHeadingLevelOffset;

				if (2 > newHeadingLevel) {
					newHeadingLevel = 2;
				}

				if (6 < newHeadingLevel) {
					newHeadingLevel = 6;
				}

				CustomElementHelpers.changeTag(heading, `h${newHeadingLevel}`, true);
			});
		}

		if (dialog.querySelector('[autofocus]')) {
			triggerControl.focus();
		}
	}
}

customElements.define(
    'dialog-modal-element',
    DialogModalElement,
    {
        extends: 'section'
    }
);