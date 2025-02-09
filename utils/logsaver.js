(function () {
    let logs = []; // Array to store log messages

    // Override console.log to capture logs
    const originalLog = console.log;
    console.log = function (...args) {
        logs.push(`[${new Date().toISOString()}] ${args.map(arg => JSON.stringify(arg)).join(" ")}`);
        originalLog.apply(console, args);
    };

    // Function to save logs as a TXT file
    function downloadLogsAsTXT() {
        if (logs.length === 0) {
            alert("No logs to save!");
            return;
        }

        // Convert logs array to a single string
        const txtContent = logs.join("\n");
        const txtBlob = new Blob([txtContent], { type: "text/plain" });

        // Create a download link and trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(txtBlob);
        link.download = `console_logs_${new Date().toISOString()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Expose download function globally
    window.downloadConsoleLogs = downloadLogsAsTXT;
})();
