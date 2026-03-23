// Smart Autofill Content Script
console.log('Smart Autofill content script injected and ready.');

function scoreMatch(inputName, keyName) {
  if (!inputName || !keyName) return 0;
  
  const cleanInput = inputName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanKey = keyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (cleanInput === cleanKey) return 10;
  if (cleanInput.includes(cleanKey) || cleanKey.includes(cleanInput)) return 5;
  
  return 0;
}

function getRelatedText(input) {
  let text = '';

  // 1. Associated label
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) text += ' ' + label.innerText;
  }

  // 2. Parent label
  const parentLabel = input.closest('label');
  if (parentLabel && parentLabel !== input) {
    text += ' ' + parentLabel.innerText;
  }

  // 3. aria-labelledby
  const ariaLabelledBy = input.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    ariaLabelledBy.split(' ').forEach(id => {
      const el = document.getElementById(id);
      if (el) text += ' ' + el.innerText;
    });
  }

  // 4. aria-describedby
  const ariaDescribedBy = input.getAttribute('aria-describedby');
  if (ariaDescribedBy) {
    ariaDescribedBy.split(' ').forEach(id => {
      const el = document.getElementById(id);
      if (el) text += ' ' + el.innerText;
    });
  }

  // 5. Google Forms specific & Generic container fallback
  // Google forms wrap the question and input in a common ancestor like role="listitem"
  const listItem = input.closest('[role="listitem"]');
  if (listItem) {
    // Only grab text that is likely a header or the main question
    const heading = listItem.querySelector('[role="heading"]');
    if (heading) text += ' ' + heading.innerText;
    else text += ' ' + listItem.innerText.substring(0, 100); 
  } else if (!text.trim()) {
    // Fall back to closest div/fieldset/li if text is still empty
    const container = input.closest('div, li, fieldset');
    if (container) text += ' ' + container.innerText.substring(0, 100);
  }

  return text;
}

function handleFillForm(profile) {
  console.log('Smart Autofill processing profile:', profile.name);
  if (!profile || !profile.fields || profile.fields.length === 0) {
    console.log('No fields to fill.');
    return;
  }

  // Expand the search to textareas and selects
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, select');
  console.log(`Found ${inputs.length} inputs on page.`);
  
  let filledCount = 0;

  inputs.forEach(input => {
    let bestMatchScore = 0;
    let bestMatchField = null;

    const relatedText = getRelatedText(input);

    const attributesToMatch = [
      input.id,
      input.name,
      input.placeholder,
      input.getAttribute('aria-label'),
      relatedText
    ];

    profile.fields.forEach(field => {
      let maxScoreForField = 0;
      attributesToMatch.forEach(attr => {
        if (!attr) return;
        const score = scoreMatch(attr, field.key);
        if (score > maxScoreForField) maxScoreForField = score;
      });

      if (maxScoreForField > bestMatchScore && maxScoreForField > 0) {
        bestMatchScore = maxScoreForField;
        bestMatchField = field;
      }
    });

    if (bestMatchField && bestMatchScore > 0) {
      // Inject value
      input.value = bestMatchField.value;
      filledCount++;
      
      // Focus element (some sites need this before change)
      input.focus();

      // Trigger change events so React/Vue/Angular notice the change
      const eventInfo = { bubbles: true, cancelable: true };
      input.dispatchEvent(new Event('input', eventInfo));
      input.dispatchEvent(new Event('change', eventInfo));
      
      // Blur element
      input.blur();

      // Visually highlight autofilled field temporarily
      const originalBg = input.style.backgroundColor;
      const originalTransition = input.style.transition;
      
      input.style.transition = 'background-color 0.3s ease';
      input.style.backgroundColor = '#e0f2fe'; // light blue
      setTimeout(() => {
        input.style.backgroundColor = originalBg;
        setTimeout(() => {
          input.style.transition = originalTransition;
        }, 300);
      }, 1500);
    }
  });

  console.log(`Smart Autofill injected entries into ${filledCount} fields.`);
  return filledCount;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'FILL_FORM') {
    const count = handleFillForm(message.profile);
    sendResponse({ status: 'success', filledCount: count });
  }
  return true;
});
