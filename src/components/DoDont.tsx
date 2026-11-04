export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="surface border-t-4 border-emerald-600 p-5 dark:border-emerald-400">
        <h3 className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
          Do
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          {dos.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
      <div className="surface border-t-4 border-red-600 p-5 dark:border-red-400">
        <h3 className="flex items-center gap-2 font-semibold text-red-800 dark:text-red-200">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.58l4.3-4.3a1 1 0 1 1 1.4 1.42L11.42 10l4.3 4.3a1 1 0 0 1-1.42 1.4L10 11.42l-4.3 4.3a1 1 0 0 1-1.4-1.42L8.58 10l-4.3-4.3a1 1 0 0 1 0-1.4Z" clipRule="evenodd" /></svg>
          Don’t
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          {donts.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </div>
    </div>
  );
}
