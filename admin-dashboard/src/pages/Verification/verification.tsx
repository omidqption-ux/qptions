import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import VerificationList from "./VerificationList";

export default function Blank() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Verification" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full  text-center">
                    <VerificationList />
                </div>
            </div>
        </div>
    )
}
