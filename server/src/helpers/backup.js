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
    if (!process.env.DB_USER)
        throw new Error('DB_USER environment variable is not set');
    if (!process.env.DB_NAME)
        throw new Error('DB_NAME environment variable is not set');
    if (!process.env.DB_PASSWORD)
        throw new Error('DB_PASSWORD environment variable is not set');
    schedule.scheduleJob(rule, () => __awaiter(this, void 0, void 0, function* () {
        console.log('Backup initiated');
        execute(`pg_dump --dbname=postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME} -f inventory_backup.dump -F t`).then(() => {
            console.log('Backup finished');
        }).catch((err) => {
            console.log(err);
        });
    }));
}
module.exports = { initBackup };
//# sourceMappingURL=backup.js.map