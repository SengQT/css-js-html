document.addEventListener('DOMContentLoaded', () => {
    // Navigation highlighting
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('header nav a');
  
    function setActiveLink() {
      let index = sections.length;
      while (--index && window.scrollY + 120 < sections[index].offsetTop) {}
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[index].classList.add('active');
    }
  
    setActiveLink();
    window.addEventListener('scroll', setActiveLink);
  
    // Scroll progress indicator
    const progressBar = document.querySelector('.progress-bar');
    
    function updateProgress() {
      const scrollPosition = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / maxScroll) * 100;
      progressBar.style.width = scrollPercentage + '%';
    }
  
    window.addEventListener('scroll', updateProgress);
  
    // Code syntax highlighting
    document.querySelectorAll('pre code').forEach(block => {
      highlightSyntax(block);
    });
  
    // Add copy buttons to code blocks
    document.querySelectorAll('pre').forEach(codeBlock => {
      // Create wrapper div
      const container = document.createElement('div');
      container.className = 'code-container';
      
      // Create header with copy button
      const header = document.createElement('div');
      header.className = 'code-header';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => {
        const code = codeBlock.textContent;
        navigator.clipboard.writeText(code)
          .then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
          });
      });
      
      header.appendChild(copyButton);
      
      // Place code block in the new structure
      const parent = codeBlock.parentNode;
      parent.insertBefore(container, codeBlock);
      container.appendChild(header);
      container.appendChild(codeBlock);
    });
  
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
        
        // Save preference
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
      });
      
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = '🌙';
      }
    }
  
    // Simple syntax highlighting function
    function highlightSyntax(codeBlock) {
      let html = codeBlock.innerHTML;
      
      // Determine the language from parent or default to HTML
      const pre = codeBlock.parentElement;
      let language = 'html';
      
      if (pre.textContent.includes('function') && pre.textContent.includes('const')) {
        language = 'javascript';
      } else if (pre.textContent.includes('{') && pre.textContent.includes(':') && !pre.textContent.includes('<')) {
        language = 'css';
      }
      
      if (language === 'html') {
        // HTML syntax highlighting
        html = html
          // HTML tags
          .replace(/(&lt;[\/]?)([\w-]+)/g, '$1<span class="hljs-tag">$2</span>')
          // HTML attributes
          .replace(/\s([\w-]+)=/g, ' <span class="hljs-attr">$1</span>=')
          // HTML comments
          .replace(/(&lt;!--.*?--&gt;)/g, '<span class="hljs-comment">$1</span>')
          // String in attributes
          .replace(/"([^"]*)"/g, '"<span class="hljs-string">$1</span>"');
      } 
      else if (language === 'css') {
        // CSS syntax highlighting
        html = html
          // CSS selectors
          .replace(/([\.\#]?[\w-]+)\s*\{/g, '<span class="hljs-tag">$1</span> {')
          // CSS properties
          .replace(/([\w-]+):/g, '<span class="hljs-attr">$1</span>:')
          // CSS values
          .replace(/:\s*([^;]+);/g, ': <span class="hljs-string">$1</span>;')
          // CSS comments
          .replace(/(\/\*.*?\*\/)/g, '<span class="hljs-comment">$1</span>');
      }
      else if (language === 'javascript') {
        // JavaScript syntax highlighting
        html = html
          // Keywords
          .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|from|async|await)\b/g, 
                  '<span class="hljs-keyword">$1</span>')
          // Strings
          .replace(/'([^']*)'/g, '<span class="hljs-string">\'$1\'</span>')
          .replace(/"([^"]*)"/g, '<span class="hljs-string">"$1"</span>')
          // Template literals
          .replace(/`([^`]*)`/g, '<span class="hljs-string">`$1`</span>')
          // Comments
          .replace(/(\/\/.*)/g, '<span class="hljs-comment">$1</span>')
          // Functions
          .replace(/(\w+)\(/g, '<span class="hljs-function">$1</span>(')
          // Variables after const/let/var
          .replace(/(const|let|var)\s+(\w+)/g, 
                  '<span class="hljs-keyword">$1</span> <span class="hljs-variable">$2</span>');
      }
      
      codeBlock.innerHTML = html;
    }
  
    // Make subsections collapsible
    document.querySelectorAll('.subsection h3').forEach(header => {
      header.style.cursor = 'pointer';
      
      // Add a toggle indicator
      const indicator = document.createElement('span');
      indicator.textContent = ' −';
      indicator.style.float = 'right';
      header.appendChild(indicator);
      
      header.addEventListener('click', () => {
        const content = Array.from(header.parentNode.children).filter(el => el !== header);
        const isVisible = content[0].style.display !== 'none';
        
        content.forEach(el => {
          el.style.display = isVisible ? 'none' : '';
        });
        
        indicator.textContent = isVisible ? ' +' : ' −';
      });
    });
  });