import React from 'react'
import { ServiceCostProvider } from './core/service_cost_provider'
import ServiceCost from '.'

export default function ServiceCostPage() {
  return (
    //สร้าง Provider ครอบเพื่อให้สามารถเรียกใช้ Validate แบบ Global 
    <ServiceCostProvider>
         <ServiceCost/>       
      
    </ServiceCostProvider>
  )
}
