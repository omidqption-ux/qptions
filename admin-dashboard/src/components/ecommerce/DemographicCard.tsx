import { useEffect, useState } from "react";
import CountryMap from "./CountryMap";
import Skeleton from "@mui/material/Skeleton";
import axiosInstance from "../../network/axios";

interface Country {
  name: string, count: number, percentage: number, latLng: number
}
export interface Marker {
  latLng: number,
  name: string,
}
export default function DemographicCard() {
  const [loading, setloading] = useState(false)
  const [customerPerCountry, setCustomerPerCountry] = useState<{
    totalCustomers: 0,
    countries: Country[],
    markers: Marker[]
  }>({
    totalCustomers: 0,
    countries: [],
    markers: []
  })

  useEffect(() => {
    getCustomersPerCountries()
  }, [])

  const getCustomersPerCountries = async () => {
    try {
      setloading(true)
      const res = await axiosInstance.get('/users/customersPerCountry')
      setCustomerPerCountry({
        totalCustomers: res.data.totalCustomers,
        countries: res.data.countries,
        markers: res.data.marker,
      })
    } catch (e) { }
    finally {
      setloading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Number of customer based on country
          </p>
        </div>

      </div>
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap markers={customerPerCountry.markers} />
        </div>
      </div>
      {loading ? (
        <div className="space-y-5">
          <Skeleton height={280} width="100%" variant="rectangular" className="my-2" />
        </div>
      ) : (
        <>
          {
            customerPerCountry.countries.map((cPC: Country) => (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="items-center w-full rounded-full max-w-8">
                      <img src="./images/country/country-01.svg" alt="usa" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                        {cPC.name}
                      </p>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {cPC.count} Customers
                      </span>
                    </div>
                  </div >

                  <div className="flex w-full max-w-[140px] items-center gap-3">
                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                      <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
                    </div>
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {cPC.percentage}%
                    </p>
                  </div>
                </div >
              </div >
            ))
          }
        </>
      )
      }
    </div >
  );
}
