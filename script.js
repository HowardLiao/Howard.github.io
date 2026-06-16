document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const isActive = navLinks.classList.contains('active');
        mobileMenuToggle.innerHTML = isActive 
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when navigation link is clicked
    document.querySelectorAll('.nav-link a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });
    });

    // 3. Cursor Glow Effect Tracker for Glass Cards
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

    // 4. Scroll Reveal Animations (IntersectionObserver)
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 5. Dynamic Dashboard Sparkline Generator
    const generateSparkline = (containerId, barCount = 18, colorClass = '') => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.classList.add('spark-bar');
            if (colorClass) bar.classList.add(colorClass);
            
            // Random initial height between 15% and 85%
            const initialHeight = Math.floor(Math.random() * 70) + 15;
            bar.style.height = `${initialHeight}%`;
            container.appendChild(bar);
        }
        
        // Active pulse animation loop
        setInterval(() => {
            const bars = container.querySelectorAll('.spark-bar');
            bars.forEach(bar => {
                // Slight fluctuation
                const currentHeight = parseFloat(bar.style.height);
                const delta = (Math.random() * 20 - 10);
                let newHeight = Math.max(10, Math.min(95, currentHeight + delta));
                bar.style.height = `${newHeight}%`;
            });
        }, 1500);
    };

    generateSparkline('sparkline-1', 18, 'pulse-green');
    generateSparkline('sparkline-2', 18, '');

    // 6. Dynamic Log Message Streamer (SIEM Simulation)
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
            
            // Keep container scrolled to bottom
            logsContainer.scrollTop = logsContainer.scrollHeight;
            
            // Keep maximum 8 log lines to prevent memory bloat
            if (logsContainer.children.length > 8) {
                logsContainer.removeChild(logsContainer.firstElementChild);
            }
        }, 3200);
    }

    // 7. Case Study Tab Selector
    const tabBtns = document.querySelectorAll('.tab-btn');
    const casePanes = document.querySelectorAll('.case-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const caseId = btn.getAttribute('data-case');
            
            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle panes
            casePanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.getAttribute('data-case') === caseId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // 8. C-Level Playbook Hub Tab Switching
    window.switchConsoleTab = (tabName) => {
        // Toggle buttons
        const tabBtns = document.querySelectorAll('.console-tab-btn');
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Toggle panes
        const panes = document.querySelectorAll('.console-pane');
        panes.forEach(pane => {
            if (pane.id === `pane-${tabName}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };
});
