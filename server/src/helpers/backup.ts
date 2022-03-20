const { execute } = require('@getvim/execute');
const schedule = require('node-schedule');

/**
 * Initialize the backup script. This will be called automatically when the server starts.
 * By default, every Friday at 8:00 PM, the backup script will be executed and will save the file in AppData/Roaming.
 */
function initBackup() {

    // Schedule backup every Friday at 8PM
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 5; // 5 = Friday
    rule.hour = 20; // 20:00
    rule.minute = 0; // 0:00

    // Create backup background job
    schedule.scheduleJob(rule, async () => {


        // Get current date
        const currentTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

        console.log(`Backup initiated at ${currentTime}.`);

        // Execute backup command
        execute(`pg_dump --dbname=postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME} -f %appdata%/inventory_backup_${currentTime}.tar -F t`).then(async () => {
            
            // Backup successful
            console.log('Backup finished.');
        }).catch((err : any) => {

            // Backup failed
            console.log(err);
        });

    });
}

module.exports = { initBackup }