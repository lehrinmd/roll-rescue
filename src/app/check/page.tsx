"use client";

import Fuse from "fuse.js";
import { FormEvent, useMemo, useState } from "react";
import records from "../../../data/sample-booth.json";

type Voter = (typeof records)[number];

const explanations: Record<string, string> = {
  Absent: "The list says the person was not found at the recorded address.",
  Shifted: "The list says the person may have moved to another address.",
  Dead: "The list says the person may have died. Please verify this with your BLO.",
  Duplicate: "The list says another entry may have the same details.",
  Other: "The list gives another reason. Please ask your BLO to explain it.",
};

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\./g, " ").replace(/th/g, "t").replace(/v/g, "w").replace(/(.)\1+/g, "$1").replace(/\bkuma?r\b/g, "kumar").replace(/\s+/g, " ").trim();
}

export default function CheckPage() {
  const [name, setName] = useState("");
  const [relative, setRelative] = useState("");
  const [age, setAge] = useState("");
  const [searched, setSearched] = useState(false);
  const [matches, setMatches] = useState<Voter[]>([]);
  const searchIndex = useMemo(() => new Fuse(records.map((person) => ({
    ...person,
    search_name: normalize(`${person.name} ${person.name_local} ${person.name_hindi}`),
    search_relative: normalize(`${person.relative_name} ${person.relative_name_local} ${person.relative_name_hindi}`),
  })), { keys: ["search_name", "search_relative"], includeScore: true, threshold: 0.48 }), []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    const query = normalize(name);
    if (!query) { setMatches([]); return; }
    const found = searchIndex.search(query).map(({ item, score }) => {
      let adjusted = score ?? 1;
      if (relative && item.search_relative.includes(normalize(relative))) adjusted -= 0.18;
      if (age && Math.abs(item.age - Number(age)) <= 2) adjusted -= 0.08;
      return { item, adjusted };
    }).sort((a, b) => a.adjusted - b.adjusted).slice(0, 5).map(({ item }) => item);
    setMatches(found);
  }

  return <div className="page-shell content-page">
    <div className="eyebrow">Voter mode</div>
    <h1>Check your name</h1>
    <p className="intro">Search a sample voter list by name. Add a relative’s name or your age to help sort possible matches.</p>
    <form className="panel" onSubmit={handleSearch}>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Your name</label><input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" /></div>
        <div className="field"><label htmlFor="relative">Relative’s name <span style={{fontWeight:400,color:"var(--muted)"}}>(optional)</span></label><input id="relative" value={relative} onChange={(e) => setRelative(e.target.value)} placeholder="Parent or spouse" /></div>
        <div className="field"><label htmlFor="age">Age <span style={{fontWeight:400,color:"var(--muted)"}}>(optional)</span></label><input id="age" inputMode="numeric" type="number" min="1" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" /></div>
      </div>
      <button className="button" style={{marginTop:18,cursor:"pointer"}} type="submit">Search</button>
    </form>
    {searched && <section aria-live="polite">
      <h2 className="section-title">Possible matches</h2>
      {matches.length ? <div className="results">{matches.map((person) => <article className="result-card" key={person.id}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start",flexWrap:"wrap"}}><h2>{person.name}</h2><span className="status">{person.status}</span></div>
        <p style={{fontFamily:"var(--font-telugu), sans-serif"}}>{person.name_local}</p>
        <p style={{fontFamily:"var(--font-devanagari), sans-serif"}}>{person.name_hindi}</p>
        <p><strong>Relative:</strong> {person.relative_name} · <strong>Age:</strong> {person.age}</p>
        <p><strong>Old booth:</strong> {person.old_part_no} · <strong>New booth:</strong> {person.part_no}</p>
        <p>{explanations[person.status]}</p>
        <p className="verification">Possible match. Please verify with your BLO.</p>
      </article>)}</div> : <p className="intro">No close match found in this sample list. Try another spelling or check with your BLO.</p>}
      <h2 className="section-title">What to do next</h2>
      <div className="checklist"><p>Check your details with your Booth Level Officer (BLO) and confirm the current rules on the official Election Commission or state CEO website.</p><a className="button secondary" href="/guide">See the full checklist</a></div>
    </section>}
    <p className="note">This sample demo does not check an official voter list. Possible match. Please verify with your BLO.</p>
  </div>;
}
