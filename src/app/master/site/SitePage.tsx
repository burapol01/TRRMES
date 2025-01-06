import React from 'react'
import Site from '.'
import { SiteProvider } from './core/SiteProvider'

export default function SitePage() {
  return (
    <div>
      <SiteProvider>
        <Site />
      </SiteProvider>
    </div>
  );
}
