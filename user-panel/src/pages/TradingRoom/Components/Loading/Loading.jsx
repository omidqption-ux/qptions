const Loading = () => {
    console.log("here")
    return (
        <div
            class="fixed inset-0 z-50 flex flex-col items-center justify-center
         w-full h-full
         bg-gradient-to-br from-slate-900/95 to-blue-500/10
        pointer-events-none transition-opacity duration-300"
        >
            <div class="flex flex-col items-center justify-center space-y-4">
                <div
                    class="flex items-center justify-center w-24 h-24 rounded-full
             border-4 border-blue-500/40 border-t-transparent
             animate-spin"
                >
                    <div class="w-12 h-12 rounded-full bg-slate-900/80 flex items-center justify-center">
                        <img
                            src="/Logo.png"
                            alt="qption Logo"
                            class="w-8 h-8 object-contain"
                        />
                    </div>
                </div>
                <div class="text-white text-sm tracking-[0.25em] uppercase">
                    Qption
                </div>
            </div>
        </div>
    )
}
export default Loading