import React from 'react'
import { ServiceTimeSheetProvider } from './core/service_time_sheet_provider'
import ServiceTimeSheet from '.'

export default function ServiceTimeSheetPage() {
  return (
    //สร้าง Provider ครอบเพื่อให้สามารถเรียกใช้ Validate แบบ Global 
    <ServiceTimeSheetProvider>
         <ServiceTimeSheet/>       
      
    </ServiceTimeSheetProvider>
  )
}
