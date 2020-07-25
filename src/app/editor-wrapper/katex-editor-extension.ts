import * as katex from 'katex'

declare var MediumEditor: any;

export default MediumEditor.Extension.extend({
  init: function () {
    MediumEditor.Extension.prototype.init.apply(this, arguments);

    this.disableEventHandling = false;
    this.subscribe('editableKeypress', this.onKeypress.bind(this));
    this.subscribe('editableBlur', this.onBlur.bind(this));
  },

  onBlur: function (blurEvent, editable) {
    this.performTexing(editable);
  },

  onKeypress: function (keyPressEvent) {
    if (this.disableEventHandling) {
      return;
    }

    if (MediumEditor.util.isKey(keyPressEvent, [MediumEditor.util.keyCode.SPACE, MediumEditor.util.keyCode.ENTER])) {
      clearTimeout(this.performTexingTimeout);
      // Saving/restoring the selection in the middle of a keypress doesn't work well...
      this.performTexingTimeout = setTimeout(function () {
        try {
          var sel = this.base.exportSelection();
          if (this.performTexing(keyPressEvent.target)) {
            // pass true for favorLaterSelectionAnchor - this is needed for links at the end of a
            // paragraph in MS IE, or MS IE causes the link to be deleted right after adding it.
            this.base.importSelection(sel, true);
          }
        } catch (e) {
          if (window.console) {
            window.console.error('Failed to perform linking', e);
          }
          this.disableEventHandling = true;
        }
      }.bind(this), 0);
    }
  },

  performTexing: function (contenteditable) {
    /*
    Perform linking on blockElement basis, blockElements are HTML elements with text content and without
    child element.
    Example:
    - HTML content
    <blockquote>
      <p>link.</p>
      <p>my</p>
    </blockquote>
    - blockElements
    [<p>link.</p>, <p>my</p>]
    otherwise the detection can wrongly find the end of one paragraph and the beginning of another paragraph
    to constitute a link, such as a paragraph ending "link." and the next paragraph beginning with "my" is
    interpreted into "link.my" and the code tries to create a link across blockElements - which doesn't work
    and is terrible.
    (Medium deletes the spaces/returns between P tags so the textContent ends up without paragraph spacing)
    */
    var blockElements = MediumEditor.util.splitByBlockElements(contenteditable),
      documentModified = false;
    if (blockElements.length === 0) {
      blockElements = [contenteditable];
    }
    for (var i = 0; i < blockElements.length; i++) {
      documentModified = this.performTexingWithinElement(blockElements[i]) || documentModified;
    }
    this.base.events.updateInput(contenteditable, { target: contenteditable, currentTarget: contenteditable });
    return documentModified;
  },

  performTexingWithinElement: function (element) {
    var matches = this.findTexableText(element),
      linkCreated = false;


    let previousMatchSuccess = false;
    for (var matchIndex = 0; matchIndex < matches.length; matchIndex++) {
      var matchingTextNodes = MediumEditor.util.findOrCreateMatchingTextNodes(
        this.document,
        element,
        matches[matchIndex]
      );
      if (previousMatchSuccess) {
        previousMatchSuccess = false;
        continue;
      }
      this.createKatex(matchingTextNodes, matches[matchIndex].tex);
    }
    return linkCreated;
  },

  findTexableText: function (contenteditable) {
    var textContent = contenteditable.textContent,
      matches = [];
    if (!textContent.trim()) {
      return [];
    }

    let lastDollarSignIdx = -1;
    for (let i = 0; i < textContent.length; i++) {
      if (textContent[i] === '$' && lastDollarSignIdx !== -1) {
        matches.push({
          tex: textContent.substring(lastDollarSignIdx, i + 1),
          start: lastDollarSignIdx,
          end: i,
        });
        lastDollarSignIdx = -1;
      }
      else if (textContent[i] === '$' && lastDollarSignIdx === -1) {
        lastDollarSignIdx = i;
      }
    }

    return matches;
  },

  createKatex: function (textNodes, rawTex) {
    var span = this.document.createElement('span');
    span.setAttribute('data-auto-tex', 'true');
    span.setAttribute('data-tex', rawTex);
    const rawTexCleared = rawTex.substr(1, rawTex.length - 2);
    const compiledTex = katex.renderToString(rawTexCleared);

    textNodes[0].parentElement.innerHTML = `
      <span data-auto-text="true" data-tex="${rawTex}" >${compiledTex}</span>
    `;
  }
});
