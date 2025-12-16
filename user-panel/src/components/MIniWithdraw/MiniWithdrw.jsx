import * as React from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Box, Button, Chip, Divider } from '@mui/material'
import PaymentMethod from '../../components/PaymentMethod/PaymentMethod'
import StarIcon from '@mui/icons-material/Star'
import PaymentsIcon from '@mui/icons-material/Payments'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import Usdttrc20 from '../../assets/payments/usdt-trc20.png'
import Visa from '../../assets/payments/visa.png'
import BinancePay from '../../assets/payments/binance@2x.png'
import WebMoney from '../../assets/payments/wm.png'
import Payeer from '../../assets/payments/payeer.png'
import Usdtpolygon from '../../assets/payments/usdt-polygon@2x.png'
import Gatepay from '../../assets/payments/gatepay.png'
import Ripple from '../../assets/payments/ripple.png'
import UsdtSolano from '../../assets/payments/usdt-solana.png'
import UsdtAvalanche from '../../assets/payments/usdt-avalanche@2x.png'
import UsdtOptimism from '../../assets/payments/usdt-optimism@2x.png'
import TetherArbitrum from '../../assets/payments/usdt-arbitrumone@2x.png'
import Dash from '../../assets/payments/dash@2x.png'
import Solana from '../../assets/payments/solana@2x.png'
import EURC from '../../assets/payments/eurc@2x.png'
import MATIC from '../../assets/payments/polygon.png'
import Avalanche from '../../assets/payments/avalanche@2x.png'
import Shiba from '../../assets/payments/shiba_inu@2x.png'
import Cardano from '../../assets/payments/cardano@2x.png'
import DOGE from '../../assets/payments/dogecoin.png'
import Cosmos from '../../assets/payments/cosmos.png'
import DAI from '../../assets/payments/dai@2x.png'
import EthereumClassic from '../../assets/payments/ethereum.png'
import Tron from '../../assets/payments/tron.png'
import USDCTRC20 from '../../assets/payments/usd-coin-trc20.png'
import BTC from '../../assets/payments/btc@2x.png'
import BTCCash from '../../assets/payments/btc_cach@2x.png'
import LTC from '../../assets/payments/ltc.png'
import Toncoin from '../../assets/payments/ton@2x.png'
import USdtTon from '../../assets/payments/usdt-ton.png'
import eos from '../../assets/payments/eos.png'
import { useDispatch, useSelector } from 'react-redux'
import { setUserBalance, updateBalance } from '../../redux/slices/userSlice'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import axiosInstance from '../../network/axios'
import {
     setWithdrawAmount,
     setWithdrawMethod,
} from '../../redux/slices/withdrawSlice'

const steps = ['Amount', 'Details', 'Process']

const MiniWithdraw = () => {
     const dispatch = useDispatch()
     const [activeStep, setActiveStep] = React.useState(0)
     const [loading, setLoading] = React.useState(false)
     const [BalanceToShow, setBalanceToShow] = React.useState(0)

     const { method, amount: withdrawAmount } = useSelector(
          (store) => store.withdraw
     )
     const { balance } = useSelector((store) => store.user)

     React.useEffect(() => {
          if (balance) setBalanceToShow(balance)
     }, [balance])

     const handleNext = () => {
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
     }

     const handleBack = () => {
          setActiveStep((prevActiveStep) => prevActiveStep - 1)
     }

     const handleReset = () => {
          setActiveStep(0)
     }

     const setPaymentMethod = (method) => {
          dispatch(setWithdrawMethod(method))
          handleNext()
     }
     const withdraw = async () => {
          try {
               setLoading(true)
               const res = await axiosInstance.post('/withdraw/makeAWithdraw', {
                    method: method.title,
                    amount: withdrawAmount,
               })
               dispatch(updateBalance(res.userBalance))
               handleNext()
          } catch (e) {
          } finally {
               setLoading(false)
          }
     }

     React.useEffect(() => {
          getUserBalance()
     }, [])

     const getUserBalance = async () => {
          try {
               const res = await axiosInstance.get('/users/balance')
               dispatch(setUserBalance(res.balance))
          } catch (e) {}
     }

     const onChangeWithdraw = (value) => {
          if (value < 0 || value % 1 !== 0 || value > balance) return

          dispatch(setWithdrawAmount(value))
          setBalanceToShow(balance - value)
     }

     return (
          <Box className='w-full p-5 '>
               <span className='flex justify-center w-full mb-5 mt-3 text-lg font-semibold'>
                    <span>Withdrawal</span>
               </span>
               <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                         const stepProps = {}
                         const labelProps = {}
                         return (
                              <Step
                                   key={label}
                                   {...stepProps}
                              >
                                   <StepLabel {...labelProps}>
                                        <span className='text-menuTxt'>
                                             {label}
                                        </span>
                                   </StepLabel>
                              </Step>
                         )
                    })}
               </Stepper>
               {activeStep === steps.length ? (
                    <React.Fragment>
                         <Box
                              sx={{
                                   display: 'flex',
                                   flexDirection: 'row',
                                   pt: 2,
                              }}
                         >
                              <Box sx={{ flex: '1 1 auto' }} />
                              <Button onClick={handleReset}>
                                   <RefreshIcon fontSize='small' />
                                   Withdrawal
                              </Button>
                         </Box>
                    </React.Fragment>
               ) : (
                    <React.Fragment>
                         <Box
                              sx={{
                                   display: 'flex',
                                   flexDirection: 'row',
                                   pt: 2,
                              }}
                         >
                              <Button
                                   color='inherit'
                                   disabled={activeStep === 0}
                                   onClick={handleBack}
                                   sx={{ mr: 1 }}
                                   variant='outlined'
                              >
                                   <ArrowBackIcon
                                        fontSize='small'
                                        className='mx-2'
                                   />
                                   Step Back
                              </Button>
                              <Box sx={{ flex: '1 1 auto' }} />
                         </Box>
                    </React.Fragment>
               )}

               {activeStep === 0 && (
                    <div className='flex justify-center items-center my-4 w-full gap-4'>
                         <div className='w-[380px] border border-lightGrey rounded-lg p-5 flex flex-col justify-center items-center'>
                              <div className='flex items-center justify-around w-full'>
                                   <div className='flex flex-col '>
                                        <span className='text-sm font-semibold leading-5'>
                                             Available Cash Out: {BalanceToShow}
                                        </span>
                                   </div>
                              </div>
                              <div className='flex items-center justify-around w-full my-5'>
                                   <span className='text-sm text-menuTxt'>
                                        Amount:
                                   </span>
                                   <input
                                        type='number'
                                        className={`bg-[#20293E]  px-2 rounded-xs focus:outline-none h-[28px] w-[170px] text-xs rounded-lg`}
                                        autoComplete='off'
                                        value={withdrawAmount}
                                        onChange={(e) => {
                                             onChangeWithdraw(e.target.value)
                                        }}
                                   />
                              </div>
                              <div className='flex flex-col justify-start items-start w-full p-4'>
                                   <span className='text-xs  leading-6'>
                                        Minimum withdrawal amount: 10$
                                   </span>
                                   <span className='text-xs leading-6'>
                                        Commission: 0$
                                   </span>
                              </div>
                              <div className='flex items-center justify-around w-full my-5'>
                                   <Button
                                        disabled={withdrawAmount < 1}
                                        onClick={handleNext}
                                        variant='contained'
                                        className='bg-LightNavy w-full'
                                   >
                                        withdraw
                                   </Button>
                              </div>
                         </div>
                    </div>
               )}
               {activeStep === 1 && (
                    <div className='flex flex-col my-4 w-full gap-4 '>
                         <Divider textAlign='left'>
                              <Chip
                                   icon={<StarIcon fontSize='small' />}
                                   className='text-OffWhite p-2'
                                   label='Popular'
                                   size='small'
                              />
                         </Divider>
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) TRC-20',
                                        minDeposit: '30$',
                                        logo: Usdttrc20,
                                   })
                              }
                              title={'Tether (USDT) TRC-20'}
                              min={'30$'}
                              period={'Instant'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Usdttrc20}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Visa, Mastercard (USD)',
                                        minDeposit: '20$',
                                        logo: Visa,
                                   })
                              }
                              title={'Visa, Mastercard (USD)'}
                              min={'20$'}
                              period={'20 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Visa}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Binance Pay',
                                        minDeposit: '5$',
                                        logo: BinancePay,
                                   })
                              }
                              title={'Binance Pay'}
                              min={'5$'}
                              period={'5 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={BinancePay}
                                        className='w-20'
                                   />
                              }
                         />
                         <Divider
                              textAlign='left'
                              className='col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  my-5'
                         >
                              <Chip
                                   icon={<PaymentsIcon fontSize='small' />}
                                   className='text-OffWhite p-2'
                                   label=' E-Payments'
                                   size='small'
                              />
                         </Divider>
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'WebMoney',
                                        minDeposit: '5$',
                                        logo: WebMoney,
                                   })
                              }
                              title={'WebMoney'}
                              min={'5$'}
                              period={'5 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={WebMoney}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Payeer',
                                        minDeposit: '5$',
                                        logo: Payeer,
                                   })
                              }
                              title={'Payeer'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Payeer}
                                        className='w-20'
                                   />
                              }
                         />
                         <Divider
                              textAlign='left'
                              className='col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  my-5'
                         >
                              <Chip
                                   icon={<CreditCardIcon fontSize='small' />}
                                   className='text-OffWhite p-2'
                                   label='Cards'
                                   size='small'
                              />
                         </Divider>
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Visa, Mastercard (USD)',
                                        minDeposit: '20$',
                                        logo: Visa,
                                   })
                              }
                              title={'Visa, Mastercard (USD)'}
                              min={'20$'}
                              period={'5 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Visa}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Mastercard (EUR)',
                                        minDeposit: '20$',
                                        logo: Visa,
                                   })
                              }
                              title={'Mastercard (EUR)'}
                              min={'20$'}
                              period={'5 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Visa}
                                        className='w-20'
                                   />
                              }
                         />
                         <Divider
                              textAlign='left'
                              className='col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  my-5'
                         >
                              <Chip
                                   icon={
                                        <CurrencyBitcoinIcon fontSize='small' />
                                   }
                                   className='text-OffWhite p-2'
                                   label=' Crypto currency'
                                   size='small'
                              />
                         </Divider>
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether(USDT) TRC-20',
                                        minDeposit: '30$',
                                        logo: Usdttrc20,
                                   })
                              }
                              title={'Tether(USDT) TRC-20'}
                              min={'30$'}
                              period={'Instant'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Usdttrc20}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Binance Pay',
                                        minDeposit: '5$',
                                        logo: BinancePay,
                                   })
                              }
                              title={'Binance Pay'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={BinancePay}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) Polygon',
                                        minDeposit: '5$',
                                        logo: Usdtpolygon,
                                   })
                              }
                              title={'Tether (USDT) Polygon'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Usdtpolygon}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Binance Coin (BNBBSC)',
                                        minDeposit: '5$',
                                        logo: BinancePay,
                                   })
                              }
                              title={'Binance Coin (BNBBSC)'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={BinancePay}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Gate Pay',
                                        minDeposit: '5$',
                                        logo: Gatepay,
                                   })
                              }
                              title={'Gate Pay'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Gatepay}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Ripple (XRP)',
                                        minDeposit: '5$',
                                        logo: Ripple,
                                   })
                              }
                              title={'Ripple (XRP)'}
                              min={'5$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Ripple}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) Solana',
                                        minDeposit: '10$',
                                        logo: UsdtSolano,
                                   })
                              }
                              title={'Tether (USDT) Solana'}
                              min={'10$'}
                              period={'1 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={UsdtSolano}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) Optimism',
                                        minDeposit: '10$',
                                        logo: UsdtOptimism,
                                   })
                              }
                              title={'Tether (USDT) Optimism'}
                              min={'10$'}
                              period={'10 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={UsdtOptimism}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) Arbitrum One',
                                        minDeposit: '10$',
                                        logo: TetherArbitrum,
                                   })
                              }
                              title={'Tether (USDT) Arbitrum One'}
                              min={'10$'}
                              period={'10 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={TetherArbitrum}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) Avalanche',
                                        minDeposit: '10$',
                                        logo: UsdtAvalanche,
                                   })
                              }
                              title={'Tether (USDT) Avalanche'}
                              min={'10$'}
                              period={'10 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={UsdtAvalanche}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Dash(DASH)',
                                        minDeposit: '25$',
                                        logo: Dash,
                                   })
                              }
                              title={'Dash(DASH)'}
                              min={'25$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Dash}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Solana(SOL)',
                                        minDeposit: '20$',
                                        logo: Solana,
                                   })
                              }
                              title={'Solana(SOL)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Solana}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Solana(SOL)',
                                        minDeposit: '20$',
                                        logo: EURC,
                                   })
                              }
                              title={'EURC'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={EURC}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Polygon(MATIC)',
                                        minDeposit: '20$',
                                        logo: MATIC,
                                   })
                              }
                              title={'Polygon(MATIC)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={MATIC}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Avalanche (AVAX)',
                                        minDeposit: '20$',
                                        logo: Avalanche,
                                   })
                              }
                              title={'Avalanche (AVAX)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Avalanche}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Shiba Inu (SHIB)',
                                        minDeposit: '20$',
                                        logo: Shiba,
                                   })
                              }
                              title={'Shiba Inu (SHIB)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Shiba}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Cardano (ADA)',
                                        minDeposit: '20$',
                                        logo: Cardano,
                                   })
                              }
                              title={'Cardano (ADA)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Cardano}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Dogecoin (DOGE)',
                                        minDeposit: '20$',
                                        logo: DOGE,
                                   })
                              }
                              title={'Dogecoin (DOGE)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={DOGE}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Cosmos (ATOM)',
                                        minDeposit: '20$',
                                        logo: Cosmos,
                                   })
                              }
                              title={'Cosmos (ATOM)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Cosmos}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Cosmos (ATOM)',
                                        minDeposit: '20$',
                                        logo: DAI,
                                   })
                              }
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={DAI}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Ethereum Classic (ETC)',
                                        minDeposit: '20$',
                                        logo: EthereumClassic,
                                   })
                              }
                              title={'Ethereum Classic (ETC)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={EthereumClassic}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tron(TRX)',
                                        minDeposit: '20$',
                                        logo: Tron,
                                   })
                              }
                              title={'Tron(TRX)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Tron}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'USD Coin (USDC) TRC-20',
                                        minDeposit: '20$',
                                        logo: USDCTRC20,
                                   })
                              }
                              title={'USD Coin (USDC) TRC-20'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={USDCTRC20}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Bitcoin(BTC)',
                                        minDeposit: '20$',
                                        logo: BTC,
                                   })
                              }
                              title={'Bitcoin(BTC)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={BTC}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Litecoin (LTC)',
                                        minDeposit: '20$',
                                        logo: LTC,
                                   })
                              }
                              title={'Litecoin (LTC)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={LTC}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Bitcoin Cash (BCH)',
                                        minDeposit: '20$',
                                        logo: BTCCash,
                                   })
                              }
                              title={'Bitcoin Cash (BCH)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={BTCCash}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Toncoin (TON)',
                                        minDeposit: '20$',
                                        logo: Toncoin,
                                   })
                              }
                              title={'Toncoin (TON)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={Toncoin}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Tether (USDT) TON',
                                        minDeposit: '20$',
                                        logo: USdtTon,
                                   })
                              }
                              title={'Tether (USDT) TON'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={USdtTon}
                                        className='w-20'
                                   />
                              }
                         />
                         <PaymentMethod
                              onClick={() =>
                                   setPaymentMethod({
                                        title: 'Stellar (XLM)',
                                        minDeposit: '20$',
                                        logo: eos,
                                   })
                              }
                              title={'Stellar (XLM)'}
                              min={'20$'}
                              period={'15 min'}
                              logo={
                                   <img
                                        alt='qption'
                                        src={eos}
                                        className='w-20'
                                   />
                              }
                         />
                    </div>
               )}
               {activeStep === 2 && (
                    <div className='flex justify-center w-full gap-4 p-4'>
                         <Button
                              variant='contained'
                              className='bg-darkEnd'
                              onClick={withdraw}
                         >
                              withdraw
                         </Button>
                    </div>
               )}
               <div className='text-xs text-darkGrey py-3 flex justify-center w-full'>
                    <span className='w-[280px] text-center'>
                         Typically, a withdrawal request is processed
                         automatically and takes a few minutes, and in some
                         cases up to 3 business days.
                    </span>
               </div>
          </Box>
     )
}
export default MiniWithdraw
