import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChecklistPage } from './pages/ChecklistPage';
import { ChoosePage } from './pages/ChoosePage';
import { ComponentPage } from './pages/ComponentPage';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { FoundationPage } from './pages/FoundationPage';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { RolePage } from './pages/RolePage';

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
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="choose" element={<ChoosePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
