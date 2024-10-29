import React from 'react'
import CostCenter from '.'
import { ConstCenterProvider } from './core/CostCenterProvider'

export default function CostCenterPage() {
    return (
        <ConstCenterProvider>
            <CostCenter />
        </ConstCenterProvider>
    )
}
