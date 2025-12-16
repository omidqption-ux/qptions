import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import axiosInstance from "../../network/axios";
type Period = 'Yesterday' | 'This-Month' | 'This-Year' | 'All-The-Time';

export default function MonthlyTarget() {

  const periods: Period[] = ['Yesterday', 'This-Month', 'This-Year', 'All-The-Time']
  const [period, setPeriod] = useState('Yesterday')
  const [_loading, setloading] = useState(false)
  const [revenue, setRevenue] = useState({
    revenue: 0,
    totals: {
      deposits: 0,
      withdrawals: 0
    },
    totalRevenue: 0
  })
  const changePeriod = async (period: 'Yesterday' | 'This-Month' | 'This-Year' | 'All-The-Time', initial = false) => {
    try {
      setloading(true)
      setPeriod(period)
      const res = await axiosInstance.get('/admins/revenue', { params: { period } })
      setRevenue({
        revenue: res.data.revenue,
        totals: res.data.totals,
        totalRevenue: res.data.totalRevenue
      })
    } catch (e) { }
    finally {
      setloading(false)
      if (!initial)
        toggleDropdown()
    }
  }
  useEffect(() => {

    changePeriod('Yesterday', true)
  }, [])
  const series = [revenue.totalRevenue ? (Number(revenue.revenue) / Number(revenue.totalRevenue)) : 0];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  }
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] ">
      <div className="px-5 py-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {period.replace(/-/g, ' ') + " "}Net Revenue
            </h3>
          </div>
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              {periods.map((p: 'Yesterday' | 'This-Month' | 'This-Year' | 'All-The-Time', index: number) => (
                <DropdownItem
                  key={index}
                  onItemClick={() => changePeriod(p)}
                  className={`flex w-full font-normal text-left text-gray-500 
                      rounded-lg ${period === p ? 'bg-gray-300 text-gray-700 ' : 'dark:text-gray-400 '}hover:bg-gray-100 hover:text-gray-700  dark:hover:bg-white/5 dark:hover:text-gray-300`}
                >
                  {p.replace(/-/g, ' ')}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="h-[228px]" id="chartDarkStyle">
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={228}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            %{revenue.totalRevenue ? (Number(revenue.revenue) / Number(revenue.totalRevenue)) * 100 : 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${revenue.revenue}
          </p>
        </div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Deposits
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${revenue.totals.deposits}
          </p>
        </div>
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Withdrawals
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            ${revenue.totals.withdrawals}
          </p>
        </div>
      </div>
    </div>
  )
}
