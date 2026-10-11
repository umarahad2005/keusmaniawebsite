/* Ledger of record (DESIGN-LANGUAGE §4 Stats ledger).
   One ruled row of four figures (a 2×2 cross on phones). The final value is
   real text for screen readers and no-JS visitors; the counting copy beside it
   is aria-hidden. A licence line appears only when its data exists. */
import { useSite } from '../lib/SiteContext.jsx'

export default function StatsSection({ surface = 'paper', className = '' }) {
  const { site } = useSite()
  const stats = site.stats || []
  const licence = site.company?.licence
  return (
    <section id="stats" className={`ledger-section ${className}`.trim()} data-surface={surface} aria-label="Karwan e Usmania International in figures">
      <div className="k-container">
        <dl className="ledger">
          {stats.map(s => (
            <div key={s.label} className="ledger__item">
              <dt className="ledger__label">{s.label}</dt>
              <dd className="ledger__figure">
                <span className="sr-only">{Number(s.value).toLocaleString('en-US')}{s.suffix}</span>
                <span aria-hidden="true">
                  <span data-count={s.value}>{Number(s.value).toLocaleString('en-US')}</span>
                  <span className="ledger__suffix">{s.suffix}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        {licence && <p className="ledger__licence">{licence}</p>}
      </div>
    </section>
  )
}
