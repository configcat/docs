import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from '../css/copy-page-button.module.scss';

// --- TYPES ---

type ActionId = 'copy' | 'view' | 'chatgpt' | 'claude';

interface DropdownItem {
  id: ActionId;
  title: string;
  description: string;
  icon: JSX.Element;
  action: () => void;
}

interface DropdownPosition {
  top: number;
  left: number;
}

// --- CONFIGS ---

const CONFIG = {
  MOBILE_BREAKPOINT: 767,
  DROPDOWN_OFFSET: 8,
  DROPDOWN_WIDTH: 300,
  DEBUG: process.env.NODE_ENV === 'development',
  MIN_CONTENT_LENGTH: 100,
};

// Static selectors for content cleanup
const DEFAULT_SELECTORS_TO_REMOVE = [
  '.theme-edit-this-page',
  '.theme-last-updated',
  '.pagination-nav',
  '.theme-doc-breadcrumbs',
  '.theme-doc-footer',
  'button',
  '.copy-code-button',
  '.buttonGroup',
  '.clean-btn',
  '.theme-code-block-title',
  '.line-number',
];

const DEFAULT_CONTENT_SELECTORS = [
  'main article',
  'main .markdown',
  'main',
  'article',
  '.main-wrapper',
  '[role="main"]',
] as const;

// --- UTILS ---

const log = (...args: any[]) => {
  if (CONFIG.DEBUG) {
    console.log('[CopyPageButton]', ...args);
  }
};

// Text cleaning
const cleanSpecialChars = (text: string): string => {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/â€‹/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Sanitize content
const sanitizeContent = (content: string): string => {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// --- CONTENT EXTRACTION ---

const findContentElement = (): HTMLElement | null => {
  for (const selector of DEFAULT_CONTENT_SELECTORS) {
    const element = document.querySelector(selector);
    if (
      element?.textContent &&
      element.textContent.trim().length > CONFIG.MIN_CONTENT_LENGTH
    ) {
      log('Found content with selector:', selector);
      return element as HTMLElement;
    }
  }
  return null;
};

const extractCodeContent = (codeElement: HTMLElement): string => {
  // 1: Data attributes
  const dataContent =
    codeElement.getAttribute('data-code') ||
    codeElement.getAttribute('data-raw');
  if (dataContent) return dataContent;

  // 2: Line-based elements
  const lineSelectors =
    'span[data-line], .token-line, .code-line, .highlight-line';
  const codeLines = codeElement.querySelectorAll(lineSelectors);
  if (codeLines.length > 0) {
    return Array.from(codeLines)
      .map((line) => line.textContent || '')
      .join('\n');
  }

  // 3: Div-based structure
  const codeLineDivs = codeElement.querySelectorAll('div');
  if (codeLineDivs.length > 0) {
    return Array.from(codeLineDivs)
      .filter((div) => {
        const className = div.className || '';
        return (
          !className.includes('codeLineNumber') &&
          !className.includes('LineNumber') &&
          !className.includes('line-number') &&
          div.style?.userSelect !== 'none'
        );
      })
      .map((div) => div.textContent || '')
      .join('\n');
  }

  // 4: Direct text
  return (codeElement.textContent || '')
    .replace(/^\d+\s+/gm, '') // Remove line numbers
    .replace(/^Copy$/gm, '')
    .replace(/^Copied!$/gm, '')
    .replace(/^\s*Copy to clipboard\s*$/gm, '');
};

export default function CopyPageButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Recalculate position when isOpen changes to true
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;

      setDropdownPosition({
        top: rect.bottom + CONFIG.DROPDOWN_OFFSET,
        left: isMobile ? rect.left : rect.right - CONFIG.DROPDOWN_WIDTH,
      });
    }
  }, [isOpen]);

  const convertToMarkdown = useCallback((element: HTMLElement): string => {
    const cleanText = (text: string) => cleanSpecialChars(text);

    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return cleanText(node.textContent || '');
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const childResults = Array.from(node.childNodes).map((child) =>
          processNode(child),
        );

        const children = childResults
          .reduce((acc: string[], current: string, i: number) => {
            if (!current) return acc;

            const previous = i > 0 ? childResults[i - 1] : '';
            const needsSpace =
              previous &&
              !previous.match(/[\s\n]$/) &&
              !current.match(/^[\s\n]/) &&
              previous.trim() &&
              current.trim();

            if (needsSpace && acc.length > 0) {
              acc.push(' ');
            }
            acc.push(current);
            return acc;
          }, [])
          .join('');

        switch (tag) {
          case 'h1':
            return `\n# ${children.trim()}\n\n`;
          case 'h2':
            return `\n## ${children.trim()}\n\n`;
          case 'h3':
            return `\n### ${children.trim()}\n\n`;
          case 'h4':
            return `\n#### ${children.trim()}\n\n`;
          case 'h5':
            return `\n##### ${children.trim()}\n\n`;
          case 'h6':
            return `\n###### ${children.trim()}\n\n`;
          case 'p':
            return children.trim() ? `${children.trim()}\n\n` : '\n';
          case 'strong':
          case 'b':
            return `**${children}**`;
          case 'em':
          case 'i':
            return `*${children}*`;
          case 'code':
            if (el.parentElement?.tagName.toLowerCase() === 'pre') {
              return children;
            }
            return `\`${cleanSpecialChars(children)}\``;
          case 'pre':
            const codeElement = el.querySelector('code');
            if (codeElement) {
              const language =
                (codeElement.className?.match(/language-(\w+)/) ||
                  el.className?.match(/language-(\w+)/) ||
                  codeElement.className?.match(/hljs-(\w+)/) ||
                  codeElement.className?.match(/prism-(\w+)/) ||
                  [])[1] || '';

              const codeContent = cleanSpecialChars(
                extractCodeContent(codeElement),
              ).replace(/^\n+|\n+$/g, '');

              return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
            }
            return `\n\`\`\`\n${children}\n\`\`\`\n\n`;
          case 'ul':
            return `\n${children}`;
          case 'ol':
            const items = Array.from(el.querySelectorAll('li'));
            return (
              '\n' +
              items
                .map(
                  (item, index) =>
                    `${index + 1}. ${processNode(item)
                      .replace(/^- /, '')
                      .trim()}\n`,
                )
                .join('')
            );
          case 'li':
            return `- ${children.trim()}\n`;
          case 'a':
            const href = el.getAttribute('href');
            if (href && !href.startsWith('#') && children.trim()) {
              return `[${children.trim()}](${href})`;
            }
            return children;
          case 'br':
            return '\n';
          case 'blockquote':
            return `\n> ${children.trim()}\n\n`;
          case 'table':
            return `\n${children}\n`;
          case 'tr':
            return `${children}\n`;
          case 'th':
          case 'td':
            return `| ${children.trim()} `;
          case 'img':
            const src = el.getAttribute('src');
            const alt = el.getAttribute('alt') || '';
            return src ? `![${alt}](${src})` : '';
          case 'div':
          case 'section':
          case 'article':
            if (el.classList?.contains('admonition')) {
              const type =
                Array.from(el.classList)
                  .find((cls) => cls.startsWith('alert--'))
                  ?.replace('alert--', '') || 'note';
              return `\n> **${type.toUpperCase()}**: ${children.trim()}\n\n`;
            }
            return children + '\n';
          default:
            return children;
        }
      }

      return '';
    };

    return processNode(element)
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\n+|\n+$/g, '')
      .trim();
  }, []);

  const extractPageContent = useCallback(() => {
    log('Extracting page content...');
    const mainContent = findContentElement();
    if (!mainContent) {
      log('No main content found on page');
      return '';
    }

    const clone = mainContent.cloneNode(true) as HTMLElement;

    DEFAULT_SELECTORS_TO_REMOVE.forEach((selector) => {
      try {
        clone.querySelectorAll(selector).forEach((el) => el.remove());
      } catch (err) {
        log('Error removing selector:', selector, err);
      }
    });

    const firstH1 = clone.querySelector('h1');
    const title = firstH1?.textContent?.trim() || 'Documentation Page';
    log('Extracted title:', title);
    if (firstH1) {
      firstH1.remove();
    }

    const content = convertToMarkdown(clone);
    const currentUrl = window.location.href;
    const finalContent = `# ${title}\n\nURL: ${currentUrl}\n\n${content}`;

    return sanitizeContent(finalContent);
  }, [convertToMarkdown]);

  const getPageContent = useCallback(() => {
    return extractPageContent();
  }, [extractPageContent]);

  const copyToClipboard = useCallback(async () => {
    const content = getPageContent();

    if (!content || content.trim() === '') {
      log('Failed to extract content');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        log('Content copied to clipboard successfully');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        log('Content copied to clipboard using fallback method');
      }
    } catch (err) {
      log('Failed to copy to clipboard:', err);
    }
  }, [getPageContent]);

  const openInAI = useCallback((baseUrl: string) => {
    try {
      const currentUrl = window.location.href;
      const prompt = encodeURIComponent(
        `Please read and explain this documentation page: ${currentUrl}

Please provide a clear summary and help me understand the key concepts covered in this documentation.`,
      );
      window.open(`${baseUrl}?q=${prompt}`, '_blank');
      log('Opened AI tool with prompt');
    } catch (err) {
      log('Failed to open AI tool:', err);
    }
  }, []);

  const viewAsMarkdown = useCallback(() => {
    const content = getPageContent();

    if (!content || content.trim() === '') {
      log('Failed to extract content');
      return;
    }

    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      log('Opened markdown view');
    } catch (err) {
      log('Failed to open markdown view:', err);
    }
  }, [getPageContent]);

  const dropdownItems: DropdownItem[] = useMemo(() => [
    {
      id: 'copy',
      title: 'Copy page',
      description: 'Copy the page as Markdown for LLMs',
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      ),
      action: copyToClipboard,
    },
    {
      id: 'view',
      title: 'View as Markdown',
      description: 'View this page as plain text',
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
      action: viewAsMarkdown,
    },
    {
      id: 'chatgpt',
      title: 'Open in ChatGPT',
      description: 'Ask questions about this page',
      icon: (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="1.5"
          viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386"
        >
          <path
            d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"
            fill="currentColor"
          />
        </svg>
      ),
      action: () => openInAI('https://chat.openai.com/'),
    },
    {
      id: 'claude',
      title: 'Open in Claude',
      description: 'Ask questions about this page',
      icon: (
        <svg
          width="16"
          height="16"
          fill="currentColor"
          fillRule="evenodd"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
        </svg>
      ),
      action: () => openInAI('https://claude.ai/new'),
    },
  ], [copyToClipboard, viewAsMarkdown, openInAI]);

  return (
    <>
      <div className={styles.copyPageButtonContainer}>
        <button
          className={styles.copyPageButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          ref={buttonRef}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span className={styles.copyPageText}>Copy page</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={
              isOpen ? `${styles.chevron} ${styles.open}` : styles.chevron
            }
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className={styles.copyPageDropdown}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 10000,
          }}
          ref={dropdownRef}
          role="menu"
          aria-label="Copy page actions"
        >
          {dropdownItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className={styles.dropdownItem}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
            >
              {item.icon}
              <div>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemDescription}>{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
