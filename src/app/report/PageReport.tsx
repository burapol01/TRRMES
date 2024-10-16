import React from 'react'
import {ListReportProvider } from './core/ListReportContext'
import Report from '.'

export default function PageReport() {
    return (
        <ListReportProvider>
            <Report />
        </ListReportProvider>
    )
}
