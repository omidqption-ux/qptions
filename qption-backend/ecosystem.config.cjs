// ecosystem.config.cjs
module.exports = {
    apps: [
        // ===== Watchers (unchanged) =====
        {
            name: "watcher-eth",
            script: "watchers/run.js",
            args: "eth",
            cwd: "/root/apps/qptions/qption-backend",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            time: true,
            env: {
                NODE_ENV: "production",
                DOTENV_CONFIG_PATH: "/root/apps/qptions/qption-backend/.env.production",
            },
            error_file: "/root/.pm2/logs/watcher-eth-error.log",
            out_file: "/root/.pm2/logs/watcher-eth-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "512M"
        },
        {
            name: "watcher-tron",
            script: "watchers/run.js",
            args: "tron",
            cwd: "/root/apps/qptions/qption-backend",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            time: true,
            env: {
                NODE_ENV: "production",
                DOTENV_CONFIG_PATH: "/root/apps/qptions/qption-backend/.env.production",
                // If your env loader doesn’t read .env.production for Mongo,
                // keep this explicit:
                MONGO_URI: "mongodb://qptionUser:22125854ZzAQ@localhost:27017/qptionDB?authSource=admin&replicaSet=rs0"
            },
            error_file: "/root/.pm2/logs/watcher-tron-error.log",
            out_file: "/root/.pm2/logs/watcher-tron-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "512M"
        },

        // ===== Sweepers (split per chain) =====
        {
            name: "tron-sweeper",
            script: "jobs/sweeper.js",
            args: "tron",
            cwd: "/root/apps/qptions/qption-backend",
            instances: 1,            // IMPORTANT: keep 1 to avoid double-hitting TronGrid
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            time: true,
            env: {
                NODE_ENV: "production",
                DOTENV_CONFIG_PATH: "/root/apps/qptions/qption-backend/.env.production",

                // Conservative defaults to avoid 429s (can tune later)
                TRON_RESERVOIR: "1",
                TRON_REFRESH: "1",
                TRON_INTERVAL_MS: "2000",
                TRON_CONCURRENT: "1",
                TRON_MIN_GAP_MS: "1500",
                TRON_GLOBAL_PAUSE_MS: "90000",
                TRON_ADDR_BACKOFF_MS: "30000",

                // Optional debug toggle (0/1); you can override at restart time
                SWEEPER_DEBUG: "0"
            },
            error_file: "/root/.pm2/logs/tron-sweeper-error.log",
            out_file: "/root/.pm2/logs/tron-sweeper-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "512M"
        },
        {
            name: "eth-sweeper",
            script: "jobs/sweeper.js",
            args: "eth",
            cwd: "/root/apps/qptions/qption-backend",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            time: true,
            env: {
                NODE_ENV: "production",
                DOTENV_CONFIG_PATH: "/root/apps/qptions/qption-backend/.env.production",

                // ETH rate-limit knobs (safe starters)
                ETH_RESERVOIR: "20",
                ETH_REFRESH: "20",
                ETH_INTERVAL_MS: "1000",
                ETH_CONCURRENT: "2",
                ETH_MIN_GAP_MS: "75",
                ETH_ADDR_BACKOFF_MS: "20000",
                ETH_MC_CHUNK: "250",

                // Gas thresholds
                ETH_GAS_MIN_ETH: "0.0002",
                ETH_GAS_DRIP_ETH: "0.0005",

                // Optional debug toggle
                SWEEPER_DEBUG: "0"
            },
            error_file: "/root/.pm2/logs/eth-sweeper-error.log",
            out_file: "/root/.pm2/logs/eth-sweeper-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            max_memory_restart: "512M"
        }


    ]
}
