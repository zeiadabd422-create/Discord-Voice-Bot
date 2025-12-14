const { Client, GatewayIntentBits, Events } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعداد DisTube (تم تحديثه لإصلاح خطأ INVALID_KEY)
const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin()], 
    emitNewSongOnly: true
    // تم حذف الإعدادات القديمة التي تسبب المشاكل
});

// 1. استقبال الأوامر
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options, member, guild, channel } = interaction;

    if (commandName === 'play') {
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: '❌ يجب أن تكون في روم صوتي أولاً!', ephemeral: true });
        }

        const query = options.getString('query');
        await interaction.deferReply();

        try {
            await distube.play(voiceChannel, query, {
                member: member,
                textChannel: channel
            });
            await interaction.editReply(`✅ جاري البحث وتشغيل: **${query}**`);
        } catch (e) {
            console.error(e);
            await interaction.editReply(`❌ خطأ: ${e.message}`);
        }
    }

    else if (commandName === 'stop') {
        const queue = distube.getQueue(guild);
        if (!queue) return interaction.reply('❌ لا يوجد شيء يعمل حالياً!');
        distube.voices.leave(guild);
        interaction.reply('🛑 تم الإيقاف وخروج البوت.');
    }

    else if (commandName === 'skip') {
        const queue = distube.getQueue(guild);
        if (!queue) return interaction.reply('❌ لا توجد أغاني لتخطيها!');
        try {
            await queue.skip();
            interaction.reply('⏭️ تم التخطي!');
        } catch (e) {
            interaction.reply('❌ هذه آخر أغنية في القائمة.');
        }
    }
});

// 2. رسائل الحالة
distube
    .on('playSong', (queue, song) => {
        queue.textChannel.send(`🎶 يشتغل الآن: **${song.name}** - \`${song.formattedDuration}\``);
    })
    .on('addSong', (queue, song) => {
        queue.textChannel.send(`✅ تمت الإضافة: **${song.name}**`);
    })
    .on('error', (channel, e) => {
        console.error(e); 
        // رسالة خطأ بسيطة للمستخدم
    });

client.once(Events.ClientReady, c => {
    console.log(`✅ البوت جاهز باسم: ${c.user.tag}`);
});

client.login('MTQ0OTg1NDc2MjQyOTMyMTMzNw.GaCEkf.5ka6nrsQcRLVPD7GN3FWHXd4ME-lVYlIeQPAK8');
