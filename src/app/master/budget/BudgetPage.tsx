import React from 'react'
import Budget from '.'
import { BudgetProvider } from './core/BudgetProvider'

export default function BudgetPage() {
    return (
        <div>
            <BudgetProvider>
                <Budget />
            </BudgetProvider>
        </div>
    );
}