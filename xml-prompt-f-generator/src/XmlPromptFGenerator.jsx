import React, { useState, useMemo } from "react";

// XML Prompt F-Generator
// Single-file React component (default export)
// Tailwind CSS classes assumed available in the host app.

export default function XmlPromptFGenerator() {
  const [task, setTask] = useState("");
  const [lines, setLines] = useState(5);
  const [tone, setTone] = useState("neutral");
  const [language, setLanguage] = useState("English");
  const [extra, setExtra] = useState("");
  const [includeExamples, setIncludeExamples] = useState(false);
  const [examples, setExamples] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");

  // helper: escape xml special chars
  const escapeXml = (str = "") =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const xml = useMemo(() => {
    const linesNode = `<Lines>${escapeXml(String(lines))}</Lines>`;
    const exampleNode = includeExamples
      ? `\n  <Examples>\n    ${escapeXml(examples).split(/\r?\n/).map((l) => `<Example>${l}</Example>`).join("\n    ")}\n  </Examples>`
      : "";

    return [
      `<?xml version=\"1.0\" encoding=\"UTF-8\"?>`,
      `<PromptSpecification generatedAt=\"${new Date().toISOString()}\">`,
      `  <Task>${escapeXml(task)}</Task>`,
      `  ${linesNode}`,
      `  <Tone>${escapeXml(tone)}</Tone>`,
      `  <Language>${escapeXml(language)}</Language>`,
      exampleNode ? exampleNode : "",
      `  <AdditionalNotes>${escapeXml(extra)}</AdditionalNotes>`,
      `</PromptSpecification>`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [task, lines, tone, language, extra, includeExamples, examples]);

  function handleCopy() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(xml)
        .then(() => {
          setCopyStatus("Copied!");
          setTimeout(() => setCopyStatus("Copy"), 2000);
        })
        .catch(() => {
          setCopyStatus("Failed");
          setTimeout(() => setCopyStatus("Copy"), 2000);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = xml;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy"), 2000);
      } catch (err) {
        setCopyStatus("Failed");
        setTimeout(() => setCopyStatus("Copy"), 2000);
      }
      document.body.removeChild(textArea);
    }
  }

  function handleDownload() {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.xml";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">XML Prompt F-Generator</h1>
          <div className="text-sm text-slate-500">Quickly build copyable XML prompts</div>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Task</span>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Describe the task (e.g. Write a formal email)..."
              className="border rounded p-2 focus:outline-none focus:ring"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Language</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              className="border rounded p-2 focus:outline-none focus:ring"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Russian">Russian</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Chinese (Simplified)">Chinese (Simplified)</option>
              <option value="Chinese (Traditional)">Chinese (Traditional)</option>
              <option value="Arabic">Arabic</option>
              <option value="Hindi">Hindi</option>
              <option value="Dutch">Dutch</option>
              <option value="Swedish">Swedish</option>
              <option value="Norwegian">Norwegian</option>
              <option value="Danish">Danish</option>
              <option value="Finnish">Finnish</option>
              <option value="Polish">Polish</option>
              <option value="Turkish">Turkish</option>
              <option value="Hebrew">Hebrew</option>
              <option value="Thai">Thai</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Indonesian">Indonesian</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Preferred number of lines (approx)</span>
            <input
              type="number"
              min={1}
              value={lines}
              onChange={(e) => setLines(Number(e.target.value))}
              className="border rounded p-2 focus:outline-none focus:ring"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Tone</span>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="border rounded p-2">
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
            </select>
          </label>

          <label className="md:col-span-2 flex flex-col">
            <span className="text-sm font-medium mb-1">Additional Notes / Constraints</span>
            <textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={3}
              placeholder="Any required phrases, words to avoid, or other constraints..."
              className="border rounded p-2 focus:outline-none focus:ring"
            />
          </label>

          <div className="md:col-span-2 grid gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeExamples} onChange={(e) => setIncludeExamples(e.target.checked)} />
              <span className="text-sm">Include example lines</span>
            </label>

            {includeExamples && (
              <textarea
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                rows={4}
                placeholder={`Put one example per line, e.g.\nThank you for your time.\nPlease let me know if you have questions.`}
                className="border rounded p-2 focus:outline-none focus:ring"
              />
            )}
          </div>
        </div>

        <section className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Generated XML</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  type="button"
                  className={`px-3 py-1 rounded-md border hover:bg-slate-100 ${copyStatus === "Copied!" ? "bg-green-100 text-green-700" : copyStatus === "Failed" ? "bg-red-100 text-red-700" : ""}`}
                >
                  {copyStatus}
                </button>
                <button onClick={handleDownload} type="button" className="px-3 py-1 rounded-md bg-blue-600 text-white hover:opacity-90">Download</button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap bg-slate-100 rounded p-4 h-72 overflow-auto text-sm">
              {xml}
            </pre>
          </div>

          <div>
            <h3 className="text-md font-medium mb-2">How to use</h3>
            <ol className="text-sm list-decimal pl-4 space-y-2">
              <li>Fill the fields on the left describing what you want the prompt to do.</li>
              <li>Toggle examples if you want to provide sample lines the prompt should follow.</li>
              <li>Copy the XML or download it as <code>prompt.xml</code> and paste into your workflow.</li>
            </ol>

            <div className="mt-4">
              <h4 className="font-medium">Preview (rendered)</h4>
              <div className="mt-2 border rounded p-3 bg-white h-48 overflow-auto text-sm">
                <strong>Task:</strong> {task || <span className="text-slate-400">(none)</span>}<br />
                <strong>Lines:</strong> {lines}<br />
                <strong>Tone:</strong> {tone}<br />
                <strong>Language:</strong> {language}<br />
                {includeExamples && (
                  <>
                    <strong>Examples:</strong>
                    <ul className="list-disc pl-6 mt-1">
                      {examples.split(/\r?\n/).filter(Boolean).map((ex, i) => (
                        <li key={i} className="text-sm">{ex}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Built with accessibility and easy export in mind. Use this component inside any React app that has Tailwind configured.
            </div>
          </div>
        </section>

        <footer className="text-sm text-slate-500 text-right">Generated on {new Date().toLocaleDateString()}</footer>
      </div>
    </div>
  );
}