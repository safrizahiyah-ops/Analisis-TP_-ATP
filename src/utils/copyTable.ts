export async function copyTableToClipboard(tableElement: HTMLElement | null, fallbackText?: string): Promise<boolean> {
  if (!tableElement && !fallbackText) return false;

  try {
    if (tableElement && navigator.clipboard && window.ClipboardItem) {
      const htmlData = tableElement.outerHTML;
      const plainText = tableElement.innerText || fallbackText || '';
      
      const blobHtml = new Blob([htmlData], { type: 'text/html' });
      const blobPlain = new Blob([plainText], { type: 'text/plain' });
      
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobPlain,
      });

      await navigator.clipboard.write([item]);
      return true;
    } else if (navigator.clipboard) {
      const text = fallbackText || tableElement?.innerText || '';
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem write failed, fallback to writeText:', err);
    try {
      const text = fallbackText || tableElement?.innerText || '';
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e2) {
      console.error('Copy table failed completely:', e2);
      return false;
    }
  }
  return false;
}

export async function copyPlainText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error('Copy plain text failed:', e);
    return false;
  }
}
