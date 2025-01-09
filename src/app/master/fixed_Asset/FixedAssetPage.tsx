import React from 'react'
import FixedAsset from '.';
import { FixedAssetProvider } from './core/FixedAssetProvider'

export default function FixedAssetPage() {
    return (
        <div>
            <FixedAssetProvider>
                <FixedAsset />
            </FixedAssetProvider>
        </div>
    );
}