// Jennifer Liu Homes — site interactions
document.documentElement.classList.add('js');

const WEB3FORMS_KEY = '8402d40e-03ec-429f-9b31-1300c2e573cf';

/* ---------- Header: shadow on scroll ---------- */
const header = document.querySelector('.site-header');

function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

/* ---------- Mobile menu ---------- */
const menuToggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');

function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
}

menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
});

window.matchMedia('(min-width: 1101px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
});

/* ---------- Contact form (shared by the modal and contact page) ---------- */
function contactFormMarkup(idPrefix) {
    return `
        <form class="form js-contact-form" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="${WEB3FORMS_KEY}">
            <input type="hidden" name="subject" value="New inquiry from jenniferliuhomes.com">
            <input type="checkbox" name="botcheck" class="form__honeypot" tabindex="-1" autocomplete="off">
            <div class="form__field">
                <label for="${idPrefix}-name">Full name <span>*</span></label>
                <input type="text" id="${idPrefix}-name" name="name" autocomplete="name" required>
            </div>
            <div class="form__field">
                <label for="${idPrefix}-phone">Phone</label>
                <input type="tel" id="${idPrefix}-phone" name="phone" autocomplete="tel">
            </div>
            <div class="form__field form__field--full">
                <label for="${idPrefix}-email">Email <span>*</span></label>
                <input type="email" id="${idPrefix}-email" name="email" autocomplete="email" required>
            </div>
            <div class="form__field form__field--full">
                <label for="${idPrefix}-interest">I'm interested in</label>
                <select id="${idPrefix}-interest" name="interest">
                    <option>Buying a home</option>
                    <option>Selling a home</option>
                    <option>Buying and selling</option>
                    <option>Just exploring the market</option>
                </select>
            </div>
            <div class="form__field form__field--full">
                <label for="${idPrefix}-comment">Message</label>
                <textarea id="${idPrefix}-comment" name="comment" placeholder="Tell Jennifer a little about what you're looking for…"></textarea>
            </div>
            <button type="submit" class="btn btn--gold btn--block form__submit">Send Message</button>
            <p class="form__status" role="status" aria-live="polite"></p>
            <p class="form__note">Jennifer typically responds within one business day.</p>
        </form>`;
}

// The contact page renders its form into this placeholder
const pageFormSlot = document.querySelector('[data-contact-form]');
if (pageFormSlot) pageFormSlot.outerHTML = contactFormMarkup('page');

/* ---------- Contact modal ---------- */
const modal = document.createElement('div');
modal.className = 'modal';
modal.id = 'contact-modal';
modal.setAttribute('aria-hidden', 'true');
modal.innerHTML = `
    <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" class="modal__close" aria-label="Close">&times;</button>
        <div class="modal__head">
            <img src="images/pic.webp" alt="">
            <div>
                <h2 id="modal-title">Work with Jennifer</h2>
                <p>Realtor® · DRE# 02202452</p>
            </div>
        </div>
        ${contactFormMarkup('modal')}
    </div>`;
document.body.appendChild(modal);

let lastFocused = null;

function openModal() {
    lastFocused = document.activeElement;
    setMenu(false);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => modal.querySelector('input[name="name"]').focus(), 50);
}

function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
}

// Any link with data-contact opens the modal (and falls back to contact.html without JS)
document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-contact]');
    if (!trigger) return;
    event.preventDefault();
    openModal();
});

modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('.modal__close')) closeModal();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (modal.classList.contains('is-open')) closeModal();
        else if (menu.classList.contains('is-open')) setMenu(false);
    }

    // Keep keyboard focus inside the open modal
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
        const focusable = modal.querySelectorAll('button, input:not([type="hidden"]):not(.form__honeypot), select, textarea');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

/* ---------- Form submission (Web3Forms, no page reload) ---------- */
document.querySelectorAll('.js-contact-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = form.querySelector('.form__submit');
        const status = form.querySelector('.form__status');
        const originalLabel = button.textContent;

        button.disabled = true;
        button.textContent = 'Sending…';
        status.className = 'form__status';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            form.reset();
            status.textContent = 'Thank you! Your message has been sent — Jennifer will be in touch soon.';
            status.classList.add('is-success');
        } catch (error) {
            status.textContent = 'Sorry, something went wrong. Please call or email Jennifer directly.';
            status.classList.add('is-error');
        } finally {
            button.disabled = false;
            button.textContent = originalLabel;
        }
    });
});

/* ---------- Reveal on scroll ---------- */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

/* ---------- Footer year ---------- */
document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
});
