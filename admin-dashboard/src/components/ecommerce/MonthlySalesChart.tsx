import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import Skeleton from "@mui/material/Skeleton";
import axiosInstance from "../../network/axios";

export default function MonthlySalesChart(props: { chartType: 'orders' | 'deposits' | 'withdrawals' | 'customers' }) {
  const { chartType } = props
  const [isOpen, setIsOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
  const [series, setSeries] = useState([
    {
      name: period + chartType,
      data: [],
    }
  ])
  const [options, setOptions] = useState<ApexOptions>({
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  })

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  const choosePeriod = (v: 'daily' | 'monthly') => {
    setPeriod(v)
    closeDropdown()
  }
  useEffect(() => {
    getChartData()
  }, [period, chartType])

  const getChartData = async () => {
    try {
      setLoading(true)
      let res: any
      if (chartType === 'customers')
        res = await axiosInstance.get(`users/customersCountPeriodlically`, { params: { period } })
      else if (chartType === 'deposits')
        res = await axiosInstance.get(`deposits/depositsCountPeriodlically`, { params: { period } })
      else if (chartType === 'orders')
        res = await axiosInstance.get(`admins/ordersCountPeriodlically`, { params: { period } })
      else if (chartType === 'withdrawals')
        res = await axiosInstance.get(`withdrawals/withdrawalsCountPeriodlically`, { params: { period } })

      setSeries([{
        name: period + " " + chartType,
        data: res.data.counts.map((dT: any) => dT.count)
      }])
      setOptions({
        colors: ["#465fff"],
        chart: {
          fontFamily: "Outfit, sans-serif",
          type: "bar",
          height: 180,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "39%",
            borderRadius: 5,
            borderRadiusApplication: "end",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 4,
          colors: ["transparent"],
        },
        xaxis: {
          categories: res.data.dates.map((dT: any) => dT.key),
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          fontFamily: "Outfit",
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        grid: {
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        fill: {
          opacity: 1,
        },

        tooltip: {
          x: {
            show: false,
          },
          y: {
            formatter: (val: number) => `${val}`,
          },
        },
      })

    } catch (e) {
    } finally {
      setTimeout(() => { setLoading(false) }, 1000)
    }
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {period.toUpperCase()} {chartType.toUpperCase()}
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => choosePeriod('monthly')}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Monthly
            </DropdownItem>
            <DropdownItem
              onItemClick={() => choosePeriod('daily')}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Daily
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {Loading ? (
            <Skeleton height={180} width="100%" variant="rectangular" className="my-2" />
          ) : (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}
