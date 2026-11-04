import { useId, useRef, useState } from 'react';
import { Button } from '@fluid-design/fluid-ui';
import type { ComponentSpec } from '../types';
import { WCAG } from '../wcag';

const MAX_MB = 5;

function Demo() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const add = (list: FileList | null) => {
    if (!list) return;
    const ok: File[] = [];
    const rejected: string[] = [];
    Array.from(list).forEach((f) => (f.size > MAX_MB * 1024 * 1024 ? rejected.push(f.name) : ok.push(f)));
    setFiles((prev) => [...prev, ...ok]);
    setError(rejected.length ? `${rejected.join(', ')} ${rejected.length > 1 ? 'are' : 'is'} larger than ${MAX_MB} MB.` : '');
    if (ok.length) setStatus(`${ok.length} file${ok.length > 1 ? 's' : ''} added.`);
  };

  const remove = (i: number) => {
    const name = files[i].name;
    setFiles((prev) => prev.filter((_, j) => j !== i));
    setStatus(`${name} removed.`);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add(e.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center ${
          dragging ? 'border-primary-600 bg-primary-50 dark:border-primary-300 dark:bg-primary-900/30' : 'border-gray-400 dark:border-gray-500'
        }`}
      >
        <label htmlFor={id} className="block text-sm font-semibold">
          Attachments
        </label>
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          PDF or image, up to {MAX_MB} MB each. Drag files here or choose them.
        </p>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept=".pdf,image/*"
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
          className="mx-auto mt-3 block text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary-800 dark:file:bg-primary-300 dark:file:text-gray-900"
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
          Error: {error}
        </p>
      )}
      {files.length > 0 && (
        <ul aria-label="Selected files" className="divide-y divide-gray-100 rounded-lg ring-1 ring-gray-200 dark:divide-gray-800 dark:ring-gray-700">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="min-w-0 truncate">
                {f.name} <span className="text-muted">({Math.max(1, Math.round(f.size / 1024))} KB)</span>
              </span>
              <Button size="xs" weight="light" color="red" onClick={() => remove(i)} aria-label={`Remove ${f.name}`}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p role="status" className="sr-only">
        {status}
      </p>
    </div>
  );
}

export const fileUpload: ComponentSpec = {
  slug: 'file-upload',
  name: 'File upload',
  category: 'Forms',
  summary: 'A file upload lets people attach files, by choosing them or by dragging them onto a drop zone.',
  semantics: '<input type="file"> + <label>',
  whenToUse: ['Use a file input whenever people need to attach documents or images.', 'Drag and drop is a shortcut on top of the file picker, never a replacement for it.'],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the file button.' },
    { keys: ['Enter', 'Space'], action: 'Opens the system file picker.' },
    { keys: ['Tab'], action: 'In the file list, moves to each Remove button.' },
  ],
  aria: [
    { attr: '<label for>', where: 'file input', usage: 'Names the input. The native button text (“Choose files”) is added by the browser.' },
    { attr: 'accept / multiple', where: 'file input', usage: 'Limits file types and allows several files. Also say the limits in the hint text.' },
    { attr: 'aria-describedby', where: 'file input', usage: 'Links the hint and any error.' },
    { attr: 'aria-label="Remove report.pdf"', where: 'remove buttons', usage: 'Makes each Remove button unique when read out of context.' },
    { attr: 'role="status"', where: 'hidden region', usage: 'Announces “2 files added” or “report.pdf removed”.' },
    { attr: 'role="alert"', where: 'error', usage: 'Announces rejected files right away.' },
  ],
  focus: [
    'After removing a file, move focus somewhere sensible, such as the file input or the next file. Never leave it on a button that no longer exists.',
    'Keep the real file input focusable. If you hide it and use a custom button, the button must open the picker with Enter and Space.',
  ],
  screenReader: ['Announced as: “Attachments, Choose files, button, PDF or image, up to 5 MB each”.', 'After choosing: “2 files added”.'],
  dos: ['List the allowed types and size before people choose.', 'Show each selected file with a way to remove it.', 'Explain exactly which file was rejected and why.'],
  donts: ['Don’t make drag and drop the only way to add files (WCAG 2.5.7).', 'Don’t hide the input with display:none.'],
  wcag: [WCAG.keyboard, WCAG.dragging, WCAG.labels, WCAG.statusMessages, WCAG.errorId],
  testing: [
    'Add files using only the keyboard.',
    'Add a file that’s too large and confirm the error is announced.',
    'Remove a file and confirm focus moves somewhere sensible and the removal is announced.',
  ],
  Demo,
  code: `<label for="files">Attachments</label>
<p id="files-hint">PDF or image, up to 5 MB each.</p>
<input id="files" type="file" multiple accept=".pdf,image/*" aria-describedby="files-hint" />

<ul aria-label="Selected files">
  <li>report.pdf <button aria-label="Remove report.pdf">Remove</button></li>
</ul>
<p role="status" class="sr-only">1 file added.</p>`,
  fluid: {
    source: 'Native HTML + Fluid styles',
    notes: ['Fluid UI has no file input. The native input’s button is styled with Fluid’s primary color through the file: variant, and the Remove buttons are Fluid Buttons.'],
  },
};
