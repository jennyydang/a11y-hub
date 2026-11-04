import { Link } from 'react-router-dom';
import { PageHeader } from './PageHeader';
import { usePageTitle } from './usePageTitle';

export function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="max-w-2xl">
      <PageHeader title="Page not found">
        <p>
          We couldn’t find that page. Go back to the <Link className="link" to="/">overview</Link> or browse the{' '}
          <Link className="link" to="/components">components</Link>.
        </p>
      </PageHeader>
    </div>
  );
}
