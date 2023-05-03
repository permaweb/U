import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Loader } from 'components/atoms/Loader';
import * as urls from 'helpers/urls';
import { View } from 'wrappers/View';

const Exchange = getLazyImport('Exchange');
const NotFound = getLazyImport('NotFound');

export default function _Routes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          path={urls.base}
          element={
            <View>
              <Exchange />
            </View>
          }
        />
        <Route
          path={`${urls.base}:active`}
          element={
            <View>
              <Exchange />
            </View>
          }
        />
        <Route
          path={'*'}
          element={
            <View>
              <NotFound />
            </View>
          }
        />
      </Routes>
    </Suspense>
  );
}

function getLazyImport(view: string) {
  return lazy(() =>
    import(`../views/${view}/index.tsx`).then((module) => ({
      default: module.default,
    }))
  );
}
