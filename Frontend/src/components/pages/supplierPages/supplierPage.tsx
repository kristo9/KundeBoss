import React, { useState } from 'react';
import LoadingSymbol from '../../basicComp/loading';

function SupplierPage() {
  const [pageState, setPageState] = useState(<LoadingSymbol />);
  const [supplierInfo, setSupplierInfo] = useState(null);

  async function loadSupplierInfo() {
    // const supplierI =
  }

  return <div>test</div>;
}

export default SupplierPage;
