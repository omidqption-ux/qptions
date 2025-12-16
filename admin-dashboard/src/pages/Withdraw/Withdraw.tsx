import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { RootState } from "../../store";
import axiosInstance from "../../network/axios";
import { setWithdrawCount } from "../../store/slices/withdraw";
import Waiting from "./Waiting";
import Confirmed from "./Confimed";
import Rejected from "./Rejected";

export default function Blank() {
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const [value, setValue] = useState('Pending');
    const { rejectedCount, approvedCount, pendingCount } = useSelector((store: RootState) => store.withdraw)

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    };
    const getCounts = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/withdrawals/count')
            dispatch(setWithdrawCount({ rejectedCount: res.data.rejected, approvedCount: res.data.confirmed, pendingCount: res.data.waiting }))
        } catch (e) { }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCounts()
    }, [])
    return (
        <div>
            <PageBreadcrumb pageTitle="Withdrawals" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="primary tabs example"
                        sx={{
                            "& .MuiTab-root": {
                                color: "#999", // unselected text color
                            },
                            "& .Mui-selected": {
                                color: "#fff !important", // selected text color
                                fontWeight: "600",
                            }
                        }}
                    >
                        <Tab value="Pending" label={"Waiting (" + pendingCount + ")"} />
                        <Tab value="Approved" label={"Confirmed (" + approvedCount + ")"} />
                        <Tab value="Rejected" label={"Rejected (" + rejectedCount + ")"} />
                    </Tabs>
                    {loading && (
                        <LinearProgress color="info" />
                    )}
                    {
                        value === 'Pending' && <Waiting getCounts={getCounts} setLoading={setLoading} />
                    }
                    {
                        value === 'Approved' && <Confirmed setLoading={setLoading} />
                    }
                    {
                        value === 'Rejected' && <Rejected setLoading={setLoading} />
                    }
                </Box>
            </div>
        </div>
    )
}
