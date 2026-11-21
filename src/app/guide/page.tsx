import guide from "../../../data/guide.json";

type GuideItem = {
  text: string;
  source: string;
  last_checked: string;
  verification?: string;
};

type GuideData = {
  title: string;
  notice: string;
  steps: (GuideItem & { title: string })[];
  documents: GuideItem[];
  deadlines: GuideItem[];
};

const guideData: GuideData = guide;

function SourceLink({ source }: { source: string }) {
  return <p className="guide-source"><a href={source} target="_blank" rel="noreferrer">Source</a></p>;
}

export default function GuidePage() {
  return <div className="page-shell content-page">
    <div className="eyebrow">A simple checklist</div>
    <h1>{guideData.title}</h1>
    <p className="intro">If you cannot find your name, ask your Booth Level Officer (BLO) to confirm your status and explain the current process.</p>
    <div className="checklist"><strong>{guideData.notice}</strong></div>
    <div className="guide-list">{guideData.steps.map((step, index) => <article className="guide-card" key={step.title}>
      <h2>{index + 1}. {step.title}</h2><p>{step.text}</p>{step.verification && <p className="verification">{step.verification}</p>}<SourceLink source={step.source} />
    </article>)}</div>
    <h2 className="section-title">Documents</h2>
    <div className="guide-list">{guideData.documents.map((item, index) => <article className="guide-card" key={index}><p>{item.text}</p><p className="verification">{item.verification}</p><SourceLink source={item.source} /></article>)}</div>
    <h2 className="section-title">Deadlines</h2>
    <div className="guide-list">{guideData.deadlines.map((item, index) => <article className="guide-card" key={index}><p>{item.text}</p><p className="verification">{item.verification}</p><SourceLink source={item.source} /></article>)}</div>
    <p className="note">A possible match is not a final decision. Please confirm with your BLO.</p>
  </div>;
}
