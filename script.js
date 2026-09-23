/**
 * Howard Liao, Ph.D. Executive Portfolio - Unified Interactive Controller
 * High-reliability Mobile & Desktop Touch Interactions, Tab Navigation, and Form Submission
 */

// 1. Immediate Global Definitions for Inline Handlers
window.switchConsoleTab = function(tabName) {
    const tabBtns = document.querySelectorAll('.console-tab-btn');
    const panes = document.querySelectorAll('.console-pane');

    tabBtns.forEach(btn => {
        const isMatch = btn.getAttribute('data-tab') === tabName;
        if (isMatch) {
            btn.classList.add('active');
            // Auto-center active tab in horizontal mobile scrollview
            try {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch (err) {}
        } else {
            btn.classList.remove('active');
        }
    });

    panes.forEach(pane => {
        if (pane.id === `pane-${tabName}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
};

window.switchLang = function(lang, e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
        localStorage.setItem('hl_lang', lang);
    } catch(err) {
        console.warn('LocalStorage not accessible:', err);
    }
    const hash = window.location.hash || '';
    let target = 'index.html';
    if (lang === 'en') {
        target = 'index_en.html';
    } else if (lang === 'ja') {
        target = 'index_ja.html';
    }
    // Navigate reliably relative to current folder
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    window.location.href = basePath + target + hash;
};

// 2. DOM Ready Orchestration
document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Navigation with RequestAnimationFrame ---
    const navbar = document.getElementById('navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Mobile Menu Drawer Controller ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    const closeMobileMenu = () => {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    };

    const openMobileMenu = () => {
        if (navLinks) {
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (mobileMenuToggle) {
                mobileMenuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            }
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // --- Universal Smooth Scroll for All Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const targetEl = document.querySelector(href);
            if (targetEl) {
                e.preventDefault();
                closeMobileMenu();

                // Compute exact offset factoring header
                const headerOffset = 76;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash cleanly
                try {
                    history.pushState(null, null, href);
                } catch (err) {}
            }
        });
    });

    // --- Chapter 4: Case Study Tabs Controller ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const casePanes = document.querySelectorAll('.case-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const caseId = btn.getAttribute('data-case');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            casePanes.forEach(pane => {
                if (pane.getAttribute('data-case') === caseId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // --- Chapter 6: Playbook Console Tabs Direct Listeners ---
    document.querySelectorAll('.console-tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            if (tabName) {
                window.switchConsoleTab(tabName);
            }
        });
    });

    // --- Chapter 7: Executive Contact Form Submission ---
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Locate submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

            // Detect current language for executive confirmation response
            const currentLang = document.documentElement.lang || 'zh-Hant';
            let confirmMsg = '✓ 您的洽談訊息已成功送出！廖倫豪 博士 (Howard Liao, Ph.D.) 將以最高機密等級於 24 小時內親自與您聯繫。';
            let sendingMsg = '正在安全加密傳輸...';
            
            if (currentLang.startsWith('en')) {
                confirmMsg = '✓ Your request has been securely submitted! Dr. Howard Liao will personally reach out to you within 24 hours under strict discretion.';
                sendingMsg = 'Transmitting securely...';
            } else if (currentLang.startsWith('ja')) {
                confirmMsg = '✓ お問い合わせを送信いたしました。廖倫豪 博士 (Howard Liao) より24時間以内に親しくご連絡申し上げます。';
                sendingMsg = '暗号化送信中...';
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>⏳</span> ${sendingMsg}`;
            }

            // Simulate ultra-fast secure transmission
            setTimeout(() => {
                // Remove existing toast if any
                const existingToast = form.querySelector('.form-toast-banner');
                if (existingToast) existingToast.remove();

                // Create executive toast banner
                const toast = document.createElement('div');
                toast.className = 'form-toast-banner';
                toast.style.cssText = `
                    margin-top: 18px;
                    padding: 16px 20px;
                    background: rgba(16, 185, 129, 0.12);
                    border: 1px solid rgba(16, 185, 129, 0.35);
                    border-radius: 12px;
                    color: #10b981;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    font-weight: 500;
                    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
                    animation: fadeIn 0.4s ease;
                `;
                toast.innerHTML = confirmMsg;

                form.appendChild(toast);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }

                // Reset form inputs
                form.reset();

                // Auto-scroll toast into full view
                try {
                    toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } catch(e) {}
            }, 600);
        });
    });

    // --- Cursor Glow Effect (Desktop Only) ---
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const glassCards = document.querySelectorAll('.glass-card, .hero-card');
        glassCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // --- Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
        reveals.forEach(reveal => revealObserver.observe(reveal));
    } else {
        reveals.forEach(r => r.classList.add('active'));
    }

    // --- Dynamic Sparklines (Observability) ---
    const generateSparkline = (containerId, barCount = 18, colorClass = '') => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.classList.add('spark-bar');
            if (colorClass) bar.classList.add(colorClass);
            const initialHeight = Math.floor(Math.random() * 70) + 15;
            bar.style.height = `${initialHeight}%`;
            container.appendChild(bar);
        }
        
        setInterval(() => {
            const bars = container.querySelectorAll('.spark-bar');
            bars.forEach(bar => {
                const currentHeight = parseFloat(bar.style.height);
                const delta = (Math.random() * 20 - 10);
                let newHeight = Math.max(10, Math.min(95, currentHeight + delta));
                bar.style.height = `${newHeight}%`;
            });
        }, 1800);
    };

    generateSparkline('sparkline-1', 18, 'pulse-green');
    generateSparkline('sparkline-2', 18, '');

    // --- Dynamic Log Streamer (SIEM Simulation) ---
    const logsContainer = document.getElementById('dash-logs');
    if (logsContainer) {
        const sampleLogs = [
            "SEC: Graylog lookup matched IP 10.200.5.42 to MES_PLC_04.",
            "NET: LibreNMS auto-discovery detected new edge storage switch.",
            "SYS: Prometheus alert cleared: Grafana CPU load < 45%.",
            "AIMS: ISO 42001 audit engine scanned 12 active API routes.",
            "FINOPS: Automated GKE node pool scaled down (saved $0.45/hr).",
            "SEC: CI/CD automated scan completed. 0 CVEs found.",
            "MFA: Blocks unauthorized cross-network access to core segment.",
            "AI-TRiSM: Prompt Injection attempt blocked on Agentic AI API."
        ];
        
        setInterval(() => {
            const logMsg = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            const timeStr = new Date().toTimeString().split(' ')[0];
            
            const logLine = document.createElement('div');
            logLine.classList.add('dash-log-line');
            logLine.textContent = `[${timeStr}] ${logMsg}`;
            
            logsContainer.appendChild(logLine);
            logsContainer.scrollTop = logsContainer.scrollHeight;
            
            if (logsContainer.children.length > 8) {
                logsContainer.removeChild(logsContainer.firstElementChild);
            }
        }, 3400);
    }
});
