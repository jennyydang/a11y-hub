import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChecklistPage } from './pages/ChecklistPage';
import { ToolPage } from './pages/ToolPage';
import { ToolsIndex } from './pages/ToolsIndex';
import { ProgressPage } from './pages/ProgressPage';
import { ExamplePage, ExamplesIndex } from './pages/ExamplesPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ComponentPage } from './pages/ComponentPage';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { FoundationPage } from './pages/FoundationPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { RolePage } from './pages/RolePage';
import { AgencyPage } from './pages/AgencyPage';
import { BasicsPage } from './pages/BasicsPage';
import { FixesPage } from './pages/FixesPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProcessPage } from './pages/ProcessPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="components" element={<ComponentsIndex />} />
          <Route path="components/:slug" element={<ComponentPage />} />
          <Route path="foundations/:slug" element={<FoundationPage />} />
          <Route path="roles/:role" element={<RolePage />} />
          <Route path="basics" element={<BasicsPage />} />
          <Route path="fixes" element={<FixesPage />} />
          <Route path="changelog" element={<ChangelogPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="process" element={<ProcessPage />} />
          <Route path="agency" element={<AgencyPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="tools" element={<ToolsIndex />} />
          <Route path="tools/:id" element={<ToolPage />} />
          <Route path="choose" element={<Navigate to="/tools/component-picker" replace />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
          <Route path="examples" element={<ExamplesIndex />} />
          <Route path="examples/:id" element={<ExamplePage />} />
          <Route path="checker" element={<Navigate to="/tools/markup-checker" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
