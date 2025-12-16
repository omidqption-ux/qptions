import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router"
import { io } from "socket.io-client"

const SOCKET_URL =
    import.meta.env.VITE_ADMIN_SOCKET_URL

type NotificationType = "deposit" | "withdrawal" | "verification"

interface AdminNotificationMeta {
    paidCurrency?: string;
    paidCurrencyTitle?: string;
    type?: string;
    methodTitle?: string;
    walletAddress?: string;
    issuingCountry?: string;
    documentType?: string;
    [key: string]: any;
}

interface AdminNotification {
    id: string;
    type: NotificationType;
    userId?: string;
    amount?: number | null;
    currency?: string | null;
    status?: string | null;
    meta?: AdminNotificationMeta;
    link?: string | null;
    createdAt?: string;
}

function formatTitle(n: AdminNotification) {
    if (n.type === "deposit") return `Deposit ${n.status || ""}`.trim();
    if (n.type === "withdrawal") return `Withdrawal ${n.status || ""}`.trim();
    if (n.type === "verification")
        return `Verification request ${n.status || ""}`.trim();
    return "Notification";
}

function formatSubtitle(n: AdminNotification) {
    if (n.type === "deposit") {
        const parts: string[] = [];
        if (n.amount && n.currency) parts.push(`${n.amount} ${n.currency}`);
        if (n.meta?.paidCurrency)
            parts.push(`paid in ${n.meta.paidCurrency.toUpperCase()}`);
        if (n.meta?.paidCurrencyTitle) parts.push(n.meta.paidCurrencyTitle);
        return parts.join(" · ");
    }

    if (n.type === "withdrawal") {
        const parts: string[] = [];
        if (n.amount && n.currency) parts.push(`${n.amount} ${n.currency}`);
        if (n.meta?.methodTitle) parts.push(n.meta.methodTitle);
        if (n.meta?.walletAddress) parts.push(n.meta.walletAddress);
        return parts.join(" · ");
    }

    if (n.type === "verification") {
        const parts: string[] = [];
        if (n.meta?.documentType) parts.push(n.meta.documentType);
        if (n.meta?.issuingCountry) parts.push(n.meta.issuingCountry);
        return parts.join(" · ");
    }

    return "";
}

function formatTime(ts?: string) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleString();
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [filter, setFilter] = useState<NotificationType | "all">("all");

    useEffect(() => {
        const socket = io(`${SOCKET_URL}/admin-notifications`, {
            withCredentials: true,
            path: "/socket.io",
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("Notifications page connected:", socket.id);
        });

        socket.on(
            "admin-notification",
            (notification: AdminNotification | any) => {
                // If your backend isn't strictly typed, we trust shape from socket.js
                setNotifications((prev) =>
                    [
                        {
                            ...notification,
                            id: notification.id || notification._id,
                        } as AdminNotification,
                        ...prev,
                    ].slice(0, 100)
                );
            }
        );

        socket.on("disconnect", () => {
            console.log("Notifications page disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const filtered = useMemo(() => {
        if (filter === "all") return notifications;
        return notifications.filter((n) => n.type === filter);
    }, [notifications, filter]);

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Live updates for deposits, withdrawals, and verification requests.
                    </p>
                </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className={`rounded-full px-3 py-1 text-sm font-medium border ${filter === "all"
                        ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                >
                    All ({notifications.length})
                </button>

                <button
                    type="button"
                    onClick={() => setFilter("deposit")}
                    className={`rounded-full px-3 py-1 text-sm font-medium border ${filter === "deposit"
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-400"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                >
                    Deposits
                </button>

                <button
                    type="button"
                    onClick={() => setFilter("withdrawal")}
                    className={`rounded-full px-3 py-1 text-sm font-medium border ${filter === "withdrawal"
                        ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-400"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                >
                    Withdrawals
                </button>

                <button
                    type="button"
                    onClick={() => setFilter("verification")}
                    className={`rounded-full px-3 py-1 text-sm font-medium border ${filter === "verification"
                        ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-400"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                >
                    Verifications
                </button>
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {filtered.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filtered.map((n) => (
                            <li key={n.id || `${n.type}-${n.createdAt}`}>
                                <Link
                                    to={n.link || "/"}
                                    className="flex gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    {/* Icon bubble */}
                                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                        <span
                                            className={`h-3 w-3 rounded-full ${n.type === "deposit"
                                                ? "bg-emerald-500"
                                                : n.type === "withdrawal"
                                                    ? "bg-blue-500"
                                                    : "bg-amber-500"
                                                }`}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatTitle(n)}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                    {formatSubtitle(n)}
                                                </p>
                                            </div>
                                            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                {formatTime(n.createdAt)}
                                            </span>
                                        </div>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                            {n.status && (
                                                <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 dark:border-gray-700">
                                                    Status:{" "}
                                                    <span className="ml-1 font-medium text-gray-700 dark:text-gray-200">
                                                        {n.status}
                                                    </span>
                                                </span>
                                            )}
                                            {n.userId && (
                                                <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 dark:border-gray-700">
                                                    User ID:{" "}
                                                    <span className="ml-1 font-mono text-[10px]">
                                                        {String(n.userId)}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
