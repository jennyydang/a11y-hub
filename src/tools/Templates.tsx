import { Button } from '@fluid-design/fluid-ui';
import { useState } from 'react';

function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const EMAIL = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<!-- The title shows in some email apps and is read by screen readers. -->
<title>Your newsletter title</title>
<style>
  body { margin: 0; padding: 0; background: #f4f5f7; }
  a { color: #1549de; }
  @media (prefers-color-scheme: dark) { body, .card { background: #17191c !important; color: #f4f5f7 !important; } a { color: #8ec3ff !important; } }
</style>
</head>
<body>
<!-- Preview text: the first line many inboxes show. Keep it meaningful. -->
<div style="display:none;max-height:0;overflow:hidden;">One sentence that sums up this email.</div>
<!-- Layout tables get role="presentation" so screen readers don't announce rows and columns. -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:8px;">
        <tr>
          <td style="padding:24px 32px 0;">
            <!-- A logo is informative: its alt is the organization's name. -->
            <img src="https://example.com/logo.png" width="120" height="40" alt="Example Organization">
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 32px;font:16px/1.6 Arial, Helvetica, sans-serif;color:#17191c;text-align:left;">
            <!-- Real headings, in order, so people can skim. -->
            <h1 style="font-size:26px;line-height:1.3;margin:0 0 12px;">The main message in a few words</h1>
            <p style="margin:0 0 16px;">Put the most important thing first, in real text. Many email apps block images, so never put your message only in an image.</p>
            <!-- A real link styled as a button, with text that says what it does. -->
            <p style="margin:0 0 24px;">
              <a href="https://example.com/register" style="display:inline-block;background:#1549de;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px;">Register for the webinar</a>
            </p>
            <h2 style="font-size:20px;margin:0 0 8px;">A second section</h2>
            <!-- Decorative images get an empty alt so they are skipped. -->
            <img src="https://example.com/divider.png" width="536" height="8" alt="" style="display:block;width:100%;height:auto;margin:0 0 16px;">
            <p style="margin:0 0 16px;">Keep text at least 16px, left aligned, with 4.5:1 contrast. Link words that say where they go, like <a href="https://example.com/report">the 2026 annual report</a>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px;font:14px/1.6 Arial, Helvetica, sans-serif;color:#4a4d52;border-top:1px solid #e3e5e8;">
            <p style="margin:0;">You're getting this because you signed up at example.com. <a href="https://example.com/unsubscribe">Unsubscribe</a> or <a href="https://example.com/preferences">change your email preferences</a>.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

const DOC = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Document title</title>
<!-- Open this file in Word or Google Docs. The headings below become real heading styles. -->
</head>
<body>
<h1>Document title</h1>
<p>A one-paragraph summary of what this document is for and what readers should do.</p>
<h2>First section</h2>
<p>Use short paragraphs. Use the built-in Heading 2 and Heading 3 styles for sections, never bold text alone.</p>
<ul>
  <li>Use the built-in bullet and numbered list buttons.</li>
  <li>Write link text that says where it goes.</li>
</ul>
<h2>A table</h2>
<table border="1" cellpadding="6">
  <caption>Table title that says what the table shows</caption>
  <thead><tr><th scope="col">Item</th><th scope="col">Owner</th><th scope="col">Due</th></tr></thead>
  <tbody><tr><td>Example row</td><td>Name</td><td>1 March</td></tr></tbody>
</table>
<h2>Images</h2>
<p>Add alt text to every image (right-click, then Edit alt text), or mark it as decorative.</p>
</body>
</html>
`;

const EXPORT_STEPS: { app: string; steps: string[] }[] = [
  {
    app: 'Microsoft Word',
    steps: [
      'Review, then Check Accessibility. Fix everything it lists.',
      'File, then Info, then Properties: set the Title.',
      'File, then Save As, then PDF. Under Options, tick “Document structure tags for accessibility”.',
    ],
  },
  {
    app: 'Google Docs',
    steps: [
      'Use Format, then Paragraph styles for every heading.',
      'Add alt text: right-click an image, then Alt text.',
      'For a tagged PDF, download as Microsoft Word (.docx), then export the PDF from Word using the steps above.',
    ],
  },
  {
    app: 'PowerPoint',
    steps: [
      'Build slides from the built-in layouts, and give every slide a unique title.',
      'Review, then Check Accessibility. Check the reading order in the Reading Order pane.',
      'File, then Save As, then PDF, with “Document structure tags for accessibility” ticked.',
    ],
  },
  {
    app: 'Adobe Acrobat (final check)',
    steps: [
      'All tools, then Prepare for accessibility, then Check for accessibility.',
      'Fix reading order, alt text and the document title it flags.',
      'Set the document language in File, then Properties, then Advanced.',
    ],
  },
];

export function Templates() {
  const [status, setStatus] = useState('');
  return (
    <div className="space-y-10">
      <section aria-labelledby="tpl-email" className="space-y-3">
        <h2 id="tpl-email" className="text-xl font-semibold">
          Email and newsletter template
        </h2>
        <p className="leading-7 text-muted">
          A single-column HTML email with real headings and text, a real text button, alt text on the logo, an empty alt on decorations, layout tables marked as presentation, and dark mode.
          Comments in the file explain each choice.
        </p>
        <Button
          className="btn-bold-primary"
          onClick={() => {
            download('accessible-email-template.html', EMAIL, 'text/html');
            setStatus('Email template downloaded.');
          }}
        >
          Download email template (.html)
        </Button>
        <p className="text-sm">Before you send: send a test with images turned off, and read it on your phone.</p>
      </section>

      <section aria-labelledby="tpl-doc" className="space-y-3">
        <h2 id="tpl-doc" className="text-xl font-semibold">
          Document starter
        </h2>
        <p className="leading-7 text-muted">A starter with a title, real headings, lists, a table with headers and a caption, and alt text reminders. Open it in Word or Google Docs and save in their format.</p>
        <Button
          weight="light"
          onClick={() => {
            download('accessible-document-starter.html', DOC, 'text/html');
            setStatus('Document starter downloaded.');
          }}
        >
          Download document starter (.html)
        </Button>
      </section>

      <p role="status" className="text-sm font-medium">
        {status}
      </p>

      <section aria-labelledby="tpl-pdf" className="space-y-3">
        <h2 id="tpl-pdf" className="text-xl font-semibold">
          Export an accessible PDF
        </h2>
        <p className="leading-7 text-muted">First ask whether it could be a web page instead. If it must be a PDF, make it from an accessible source file and export it with tags.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {EXPORT_STEPS.map((e) => (
            <div key={e.app} className="surface p-5">
              <h3 className="font-semibold">{e.app}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6">
                {e.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
