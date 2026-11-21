export default function HomePage() {
  return <div className="page-shell">
    <section className="hero">
      <div>
        <div className="eyebrow">Clear next steps for every voter</div>
        <h1>Find your name. Know what to do next.</h1>
        <p className="hero-copy">Check whether your name may appear on a voter list, and get a simple checklist for what to do next.</p>
        <div className="button-row"><a className="button" href="/check">Check my name</a><a className="button secondary" href="/volunteer">Volunteer mode</a></div>
        <p className="note">This tool shows possible matches only. Please confirm with your Booth Level Officer (BLO).</p>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit"><div className="card-art"><div className="art-badge">Possible match</div><div className="art-line"/><div className="art-line short"/><div className="art-line"/><div className="art-line short"/></div></div></div>
    </section>
    <section className="feature-strip" aria-label="How it works">
      <div className="feature"><strong>Search simply</strong>Try a name and a relative’s name to find likely matches.</div>
      <div className="feature"><strong>See the status</strong>Understand what the list entry says in plain words.</div>
      <div className="feature"><strong>Take the next step</strong>Use a clear checklist and verify details with your BLO.</div>
    </section>
  </div>;
}
