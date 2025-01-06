import React from 'react'
import { ServiceRequestProvider } from './core/service_request_provider'
import ServiceRequest from '.'

export default function ServiceRequestPage() {
  return (
    //สร้าง Provider ครอบเพื่อให้สามารถเรียกใช้ Validate แบบ Global 
    <ServiceRequestProvider>
         <ServiceRequest/>       
      
    </ServiceRequestProvider>
  )
}
