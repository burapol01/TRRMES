/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import LoadingScreen from './components/MUI/LoadingScreen';
import { SplashScreenProvider } from './core/SplashScreen';
import { _POST } from './service';

function App() {
  const isLoadding = useSelector(
    (state: any) => state?.loading_screen?.loading
  );

  // const testFunc = async () => {
  //   const datasend = {
  //     "account_id": "A607D0F3-CB14-41A4-B0D9-93C8E0A1CCE6",
  //     "repayment_date": "22/03/2025",
  //     "repayment_amount": 2000,
  //     "note": "HELP",
  //     "CurrentAccessModel": {
  //       "user_id": "feefee.fee"
  //     }
  //   }
  //   try {
  //     const reponse = await _POST(datasend,'')
  //   }catch (err) {
      
  //   }
  // }


  return (
    <SplashScreenProvider>
      {isLoadding && <LoadingScreen loading={isLoadding} />}
      <Outlet />
    </SplashScreenProvider>

  )
}

export default App