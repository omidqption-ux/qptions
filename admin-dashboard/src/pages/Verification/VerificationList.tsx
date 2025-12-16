import { useEffect, useState } from "react"
import axiosInstance from "../../network/axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { setVerificationsCount } from "../../store/slices/verification"
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import React from "react"
import { Box, LinearProgress } from "@mui/material"
import Pending from "./Pending"
import Approved from "./Approved"
import Sending from "./Sending"
import Rejected from "./Rejected"
export default function VerificationList() {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [value, setValue] = React.useState('Pending');

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const { rejectedCount, approvedCount, pendingCount, sendingCount } = useSelector((store: RootState) => store.verification)

    const getCounts = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.get('/verifications/verificationCounts')
            dispatch(setVerificationsCount({ rejectedCount: res.data.rejected, approvedCount: res.data.approved, pendingCount: res.data.pending, sendingCount: res.data.sending }))
        } catch (e) { }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCounts()
    }, [])


    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white dark:text-gray-300 dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                    <Tab value="Pending" label={"Pending (" + pendingCount + ")"} />
                    <Tab value="Approved" className="dark:text-gray-300" label={"Approved (" + approvedCount + ")"} />
                    <Tab value="Sending" className="dark:text-gray-300" label={"Sending (" + sendingCount + ")"} />
                    <Tab value="Rejected" className="dark:text-gray-300" label={"Rejected (" + rejectedCount + ")"} />
                </Tabs>
                {loading && (
                    <LinearProgress color="info" />
                )}
                {
                    value === 'Pending' && <Pending setLoading={setLoading} />
                }
                {
                    value === 'Approved' && <Approved setLoading={setLoading} />
                }
                {
                    value === 'Sending' && <Sending setLoading={setLoading} />
                }
                {
                    value === 'Rejected' && <Rejected setLoading={setLoading} />
                }

            </Box>
        </div>
    )
}
