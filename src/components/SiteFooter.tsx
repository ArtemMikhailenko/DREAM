import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-grid">
          <div className="footer-col footer-brand-col">
            <p className="footer-mark brush">dc.prod</p>
            <p className="footer-tagline">Studio that builds systems —<br />from idea to result.</p>
            <div className="footer-social">
              <a href="https://wa.me/0" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
                </svg>
              </a>
              <a href="https://t.me/" target="_blank" rel="noopener" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">Services</h4>
            <ul className="footer-list">
              <li><Link href="/#services">Promotional videos</Link></li>
              <li><Link href="/#services">Image &amp; brand films</Link></li>
              <li><Link href="/#services">Social media &amp; ads</Link></li>
              <li><Link href="/#services">3D &amp; AI content</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">Studio</h4>
            <ul className="footer-list">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/#process">Process</Link></li>
              <li><Link href="/portfolio">Works</Link></li>
              <li><Link href="/#packages">Pricing</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">Contacts</h4>
            <ul className="footer-list">
              <li><a href="mailto:hello@dc.prod">hello@dc.prod</a></li>
              <li><a href="tel:+10000000000">+1 000 000 0000</a></li>
              <li><Link href="/#lead">Get a brief ↗</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© {new Date().getFullYear()} dc.prod studio · From idea to result</p>
          <p className="footer-copy">Built in-house · all rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
