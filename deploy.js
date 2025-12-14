const { REST, Routes } = require('discord.js');

// ⚠️⚠️ عدّل هذه الأرقام بالبيانات الخاصة بك ⚠️⚠️
const CLIENT_ID = '1449854762429321337'; // ضع ID البوت هنا
const GUILD_ID = '1449104671737380915'; // ضع ID السيرفر هنا

const commands = [
    {
        name: 'play',
        description: 'تشغيل أغنية',
        options: [{ name: 'query', description: 'اسم الأغنية أو الرابط', type: 3, required: true }]
    },
    { name: 'stop', description: 'إيقاف البوت' },
    { name: 'skip', description: 'تخطي الأغنية' }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('🔄 جاري تسجيل الأوامر الجديدة...');
        
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
        
        console.log('✅ تم تسجيل 3 أوامر (play, stop, skip) بنجاح!');
    } catch (error) {
        console.error(error);
    }
})();
