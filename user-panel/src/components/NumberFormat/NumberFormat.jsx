import Loading from "../Loading/SingleLoading"
const formatCurrency = (amount, currency) => {
     return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
     }).format(amount)
}

const CurrencyDisplay = ({ amount, currency, loading, ...rest }) => {
     return (
          <div {...rest}>
               {loading ? (
                    <Loading />
               ) : (
                    formatCurrency(amount, currency)
               )}
          </div>
     )
}

export default CurrencyDisplay
