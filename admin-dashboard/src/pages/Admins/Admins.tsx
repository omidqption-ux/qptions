import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminList from "./AdminList";

export default function Admins() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Admins" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full  text-center">
                    <AdminList />
                </div>
            </div>
        </div>
    )
}
