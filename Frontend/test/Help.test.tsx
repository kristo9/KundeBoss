import React from 'react';
import { render } from '@testing-library/react';

import Help from '../src/components/pages/help/Help';

test('dette er en test', () => {
  const { debug, getByTestId, getByText } = render(<Help />);

  getByText('Velkommen');
});
