var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { execute } = require('@getvim/execute');
const schedule = require('node-schedule');
function initBackup() {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 5;
    rule.hour = 20;
    rule.minute = 0;
    schedule.scheduleJob(rule, () => __awaiter(this, void 0, void 0, function* () {
        const currentTime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
        console.log(`Backup initiated at ${currentTime}.`);
        execute(`pg_dump --dbname=postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME} -f %appdata%/inventory_backup_${currentTime}.tar -F t`).then(() => __awaiter(this, void 0, void 0, function* () {
            console.log('Backup finished.');
        })).catch((err) => {
            console.log(err);
        });
    }));
}
module.exports = { initBackup };
//# sourceMappingURL=backup.js.map