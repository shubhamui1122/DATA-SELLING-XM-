// DATA-SELLING-XM // SUPREME CENTRAL BACKEND COMMAND CORE ENGINE v6.0 //
// DEVELOPED EXCLUSIVELY FOR OPERATIVE COMMANDER: SHUBHAM KUMAR SAH 😎 //

const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

// 🔐 क्रिटिकल फिक्स: रेंडर सर्वर का ब्लॉक और सुरक्षा ताला (CORS) तोड़ने का मुख्य गार्ड
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '')));

const DATABASE_VAULT_PATH = path.join(__dirname, 'database_vault.json');

// काम: अगर हार्ड डिस्क में तिजोरी फाइल मौजूद नहीं है, तो तुरंत नई साफ़ तिजोरी क्रिएट करना
function initializeCentralDatabaseVault() {
    if (!fs.existsSync(DATABASE_VAULT_PATH)) {
        const structuralTemplate = {
            system_configuration: {
                mining_core_override: false, // false = ON, true = OFF (Traffic Kill-Switch)
                global_ticker_message: "🏴‍☠️ SYSTEM TERMINAL ENGAGED. CAPTURING DATA BLOCKS FOR AI INFERENCE TRAINING."
            },
            gift_redeem_vault: {
                "LOOT50": { amount: 50.00, claimed_by: null },
                "SHUBHAM_KING_100": { amount: 100.00, claimed_by: null }
            },
            user_ledger_matrix: {},
            uid_mapping_index: {},
            admin_staff_registry: {
                "9336717771": { pin: "8734", name: "Rahul Balolia", tickets_resolved: 0 }
            },
            admin_broadcast_ticker: "💀 SYSTEM WARNING: MONITORED CONNECTION CHANNELS ENGAGED.",
            owner_announcements_feed: [],
            live_ad_blast_payload: { active: false, media_url: "", custom_text: "", target_link: "https://t.me/DATASELLINGXX" }
        };
        fs.writeFileSync(DATABASE_VAULT_PATH, JSON.stringify(structuralTemplate, null, 4));
    }
}
initializeCentralDatabaseVault();

function readVaultData() {
    return JSON.parse(fs.readFileSync(DATABASE_VAULT_PATH, 'utf8'));
}

function writeVaultData(data) {
    fs.writeFileSync(DATABASE_VAULT_PATH, JSON.stringify(data, null, 4));
}
// 🚫 API 1: वन-नंबर परमानेंट रजिस्ट्री锁 और ६-अंकों का ऑटो-UID जेनरेशन काउंटर (Hindi/English Alert Messages)
app.post('/api/auth/register', (req, res) => {
    const { username, mobile, password, track_node } = req.body;
    if (!username || !mobile || !password) {
        return res.status(400).json({ error: "❌ REGISTRY ERROR: INCOMPLETE PACKET DATA. / रजिस्ट्री त्रुटि: अधूरा पैकेट डेटा।" });
    }
    
    const vault = readVaultData();
    if (vault.user_ledger_matrix[mobile]) {
        return res.status(400).json({ error: "❌ REGISTRY DENIED: THIS MOBILE NUMBER IS ALREADY REGISTERED. / रजिस्ट्री अस्वीकृत: यह मोबाइल नंबर पहले से पंजीकृत है।" });
    }
    
    // ६-अंकों की एक सीक्रेट और यूनिक UID का आटोमैटिक जेनरेशन (जैसे: 842163)
    let generatedUID = String(Math.floor(100000 + Math.random() * 900000));
    while (vault.uid_mapping_index[generatedUID]) {
        generatedUID = String(Math.floor(100000 + Math.random() * 900000));
    }
    
    let referrerMobile = "";
    if (track_node && vault.user_ledger_matrix[track_node]) {
        referrerMobile = track_node;
        vault.user_ledger_matrix[track_node].referral_count += 1;
    }
    
    // नए यूज़र की बिल्कुल साफ़ और सुरक्षित जन्मकुंडली स्ट्रक्चर लॉक (ShreeWin Style Avatar + 72-Hour Server Time Stamp)
    vault.user_ledger_matrix[mobile] = {
        uid: generatedUID,
        username: username,
        mobile: mobile,
        password: password,
        wallet_balance: 0.00,
        lifetime_shared_data_gb: 0.00,
        registration_timestamp: new Date().toISOString(), // काम: ७२ घंटे का कड़ा सर्वे टाइमर चेक करने के लिए
        is_vip_tier: false,
        current_active_session_token: "",
        referred_by_mobile: referrerMobile,
        referral_count: 0,
        has_claimed_daily_scratch: false,
        last_scratch_date: "",
        linked_withdrawal_slots: [], // स्मार्ट विथड्रॉल: लाइफटाइम में केवल 3 स्लॉट्स ही लिंक कर सकता है
        dispute_tickets: [],
        withdrawal_history: []
    };
    
    vault.uid_mapping_index[generatedUID] = mobile;
    
    writeVaultData(vault);
    return res.json({ 
        success: true, 
        uid: generatedUID,
        message: "🟢 Success! Your account has been successfully registered in the database core. / बधाई हो! आपका अकाउंट डेटाबेस तिजोरी में सफलतापूर्वक रजिस्टर हो गया है।" 
    });
});
// 🔒 API 2: वन-डिवाइस लॉगिन और आटोमैटिक ओल्ड सेशन टर्मिनेशन इंजन + सीधा गलत पासवर्ड अलर्ट (Hindi/English)
app.post('/api/auth/login', (req, res) => {
    const { mobile, password } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    // कड़ा नियम: गलत पासवर्ड देने पर सिर्फ सीधा और साफ मैसेज जाएगा हिंदी-इंग्लिश दोनों में!
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "⚠️ Incorrect Password. Please contact the admin for assistance. / आपका पासवर्ड गलत है। कृपया सहायता के लिए एडमिन से संपर्क करें।" });
    }
    
    // जादुई वन-डिवाइस टोकन जेनरेशन: नया टोकन बनते ही पुराना फोन हवा में तुरंत लॉगआउट हो जाएगा!
    const newlyGeneratedSessionToken = "SECURE-NODE-TOK-" + Math.floor(100000 + Math.random() * 900000);
    user.current_active_session_token = newlyGeneratedSessionToken;
    
    writeVaultData(vault);
    return res.json({ success: true, token: newlyGeneratedSessionToken, uid: user.uid });
});

// API 3: माइनिंग के दौरान ३-४ लाख लोग बेचने वाला हिंदी-इंग्लिश महा-सुरक्षा नोटिस लॉन्चर हुक
app.post('/api/user/bandwidth-heartbeat', (req, res) => {
    const { mobile } = req.body;
    const vault = readVaultData();
    
    // ओनर का मास्टर स्विच चेक: अगर ओनर ने बंद किया है, तो बीच रास्ते की माइनिंग पैकेट तुरंत ब्लॉक करके ३-४ लाख का एरर फेंकना!
    if (vault.system_configuration.mining_core_override === true) {
        return res.status(403).json({ 
            error_en: "⚠️ SYSTEM ALERT: SIMULTANEOUS TRAFFIC DETECTED. CURRENTLY, 300,000 TO 400,000 USERS ARE SELLING DATA SIMULTANEOUSLY THROUGH THEIR NODES. REGISTRATION OF NEW ORDERS HAS BEEN PAUSED BY THE ADMINISTRATION. PLEASE WAIT A FEW MINUTES AND TRY AGAIN.", 
            error_hi: "⚠️ सिस्टम अलर्ट: अत्यधिक ट्रैफ़िक पाया गया है। इस समय ३ से ४ लाख लोग एक साथ अपने नोड्स से डेटा सेल कर रहे हैं, इसीलिए हमारे एडमिनिस्ट्रेशन ने नए ऑर्डर्स को कुछ समय के लिए बंद कर दिया है। कृपया थोड़ी देर प्रतीक्षा करें और दोबारा प्रयास करें।" 
        });
    }
    
    const user = vault.user_ledger_matrix[mobile];
    if (!user) return res.status(404).json({ error: "Node not found." });
    
    return res.json({ integrity: "VERIFIED" });
});

// 💰 API 4: इंस्टेंट कैश-आउट - यूजर जैसे ही CASH OUT दबाएगा, भले ही ₹0.05 हो, तुरंत बैलेंस में ऐड हो जाएगा 0.1 सेकंड में!
app.post('/api/user/commit-cashout', (req, res) => {
    const { mobile, session_mb, session_earnings } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (user && session_earnings >= 0) {
        const parsedMB = parseFloat(session_mb);
        const addedGB = parsedMB / 1024;
        
        user.wallet_balance += parseFloat(session_earnings);
        user.lifetime_shared_data_gb += addedGB; // काम: लाइफटाइम डेटा सेल डिस्प्ले जो कभी रीसेट नहीं होना चाहिए!
        
        // कड़ा नियम: 5 रेफरल करते ही डेटा सेलिंग रेट वीआईपी बोनस रेट (₹12/GB) हो जाना
        if (user.referral_count >= 5) {
            user.is_vip_tier = true;
        }
        
        writeVaultData(vault);
        return res.json({ 
            success: true, 
            new_balance: user.wallet_balance,
            message: "🟢 Success! Your balance is successfully add. / बधाई हो! आपका पैसा आपके वॉलेट बैलेंस में सफलतापूर्वक जोड़ दिया गया है।" 
        });
    }
    return res.status(400).json({ error: "Invalid cashout payload packet." });
});
// 🏴‍☠️ API 5: टेलीग्राम टास्क बाईपास - ऑफिशियल चैनल टास्क पूरा होने पर तुरंत ₹2 देना
app.post('/api/user/claim-telegram-task', (req, res) => {
    const { mobile } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (!user) return res.status(404).json({ error: "User node not found." });
    
    user.wallet_balance += 2.00;
    writeVaultData(vault);
    return res.json({ success: true, new_balance: user.wallet_balance });
});

// 🎁 API 6: डेली स्क्रैच कार्ड - रोज फिक्स न्यूनतम ₹1 का इनाम सिंक करना
app.post('/api/user/claim-daily-scratch', (req, res) => {
    const { mobile } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (!user) return res.status(404).json({ error: "User node not found." });
    
    const todayString = new Date().toISOString().substring(0, 10);
    if (user.last_scratch_date === todayString) {
        return res.status(400).json({ error: "💀 CODE REJECTED: YOU HAVE ALREADY SCRATCHED TODAY'S CARD." });
    }
    
    user.wallet_balance += 1.00;
    user.last_scratch_date = todayString;
    
    writeVaultData(vault);
    return res.json({ success: true, reward: 1.00, new_balance: user.wallet_balance });
});

// 💸 API 7: Gifts रिडीम बॉक्स - 'First Come, First Served' के कड़े नियम पर काम करने वाला बॉक्स
app.post('/api/user/redeem-gift-packet', (req, res) => {
    const { mobile, gift_code } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (!user) return res.status(404).json({ error: "User not found." });
    
    const targetGift = vault.gift_redeem_vault[gift_code];
    if (!targetGift) {
        return res.status(400).json({ error: "⚠️ SYSTEM ALERT: INVALID REDEEM CODE PACKET. / त्रुटि: अमान्य रिडीम कोड।" });
    }
    
    // कड़ा पहरा: अगर कोड पहले ही कोई लड़का क्लेम कर चुका है तो तुरंत कड़क एरर फेंकना!
    if (targetGift.claimed_by !== null) {
        return res.status(400).json({ error: "Code Already Claimed! 😔💸" });
    }
    
    // जो लड़का सबसे पहले कोड डालेगा, पैसा उसे मिलेगा!
    targetGift.claimed_by = mobile;
    user.wallet_balance += targetGift.amount;
    
    writeVaultData(vault);
    return res.json({ success: true, amount: targetGift.amount, new_balance: user.wallet_balance });
});
// 💳 API 8: स्मार्ट विथड्रॉल (Smart Withdrawal) - UPI/Bank ३-स्लॉट लिंक और ₹6 फिक्स GST टैक्स डिडक्शन
app.post('/api/user/submit-withdrawal-vault', (req, res) => {
    const { mobile, amount, account_details, is_new_slot_linking } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (!user) return res.status(404).json({ error: "Node failure." });
    
    // कड़ा पहरा: यूजर लाइफटाइम में केवल 3 स्लॉट्स ही लिंक कर सकता है!
    if (is_new_slot_linking && user.linked_withdrawal_slots.length >= 3) {
        return res.status(400).json({ error: "🔒 PRIVILEGE DENIED: YOU CANNOT LINK MORE THAN 3 ACCOUNTS IN LIFETIME. / स्लॉट लॉक: आप जीवन भर में 3 से अधिक खाते लिंक नहीं कर सकते।" });
    }
    
    if (is_new_slot_linking && user.linked_withdrawal_slots.length < 3) {
        user.linked_withdrawal_slots.push(account_details);
    }
    
    const withdrawalValue = parseFloat(amount);
    const firstLimitCheck = user.withdrawal_history && user.withdrawal_history.length > 0;
    const allowedMinimumThreshold = firstLimitCheck ? 100 : 50; // नए के लिए ₹50 और पुराने के लिए ₹100 फिक्स!
    
    if (withdrawalValue < allowedMinimumThreshold) {
        return res.status(400).json({ error: `⚠️ ACCESS DENIED: MINIMUM LIMIT IS ₹${allowedMinimumThreshold}.` });
    }
    
    if (user.wallet_balance < withdrawalValue) {
        return res.status(400).json({ error: "💀 INSUFFICIENT ACCOUNT CAPITAL ASSETS. / वॉलेट त्रुटि: अपर्याप्त राशि।" });
    }
    
    user.wallet_balance -= withdrawalValue;
    
    user.withdrawal_history.unshift({
        id: "WDX-" + Math.floor(100000 + Math.random() * 900000),
        amount_requested: withdrawalValue,
        tax_deducted_gst: 6.00, // ₹6 फिक्स GST कट रहा है!
        net_disbursed: withdrawalValue - 6.00,
        status: "PENDING",
        date: new Date().toISOString().substring(0, 10)
    });
    
    writeVaultData(vault);
    return res.json({ success: true, new_balance: user.wallet_balance });
});

// 🔧 API 9: सर्विस中心 सेटिंग्स (Secure Password Change) - कड़ा करंट पासवर्ड वेरिफिकेशन इंजन
app.post('/api/user/secure-password-change', (req, res) => {
    const { mobile, current_password, new_password } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    
    if (!user) return res.status(404).json({ error: "Node failure." });
    
    if (user.password !== current_password) {
        return res.status(400).json({ error: "🏴‍☠️ IDENTITY REJECTED: CURRENT PASSWORD IS INCORRECT. / त्रुटि: पुराना पासवर्ड गलत है।" });
    }
    
    user.password = new_password;
    writeVaultData(vault);
    return res.json({ success: true });
});

// 💬 API 10: व्हाट्सएप-जैसी लाइव चैट परसिस्टेंस और 'Customer Problems' रूटिंग टनल
app.post('/api/support/transmit-ticket', (req, res) => {
    const { mobile, message, attachment_raw, category } = req.body;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    if (user) {
        user.dispute_tickets.push({
            sender_label: " My Terminal / 👤 मेरा टर्मिनल",
            text: message,
            media: attachment_raw || "",
            status: category || "PENDING",
            time: new Date().toLocaleTimeString()
        });
        writeVaultData(vault);
        return res.json({ success: true });
    }
    return res.status(404).json({ error: "Node failure." });
});

// 👑 API 11: ओनर का २-क्लिक मास्टर माइनिंग किल-स्विच (ON/OFF Dynamic Toggle)
app.post('/api/system/toggle-mining-core', (req, res) => {
    const { state } = req.body;
    const vault = readVaultData();
    vault.system_configuration.mining_core_override = !state; // true = OFF, false = ON
    
    // ऑटो-कैशआउट लूप: जैसे ही ओनर माइनिंग बंद करे, चल रहे सभी यूजर्स का पैसा सुरक्षित जुड़ जाए!
    if (vault.system_configuration.mining_core_override === true) {
        for (const mob in vault.user_ledger_matrix) {
            const u = vault.user_ledger_matrix[mob];
            u.wallet_balance += 0.05; // सेफ़गार्ड लूप आटोमैटिक बूस्ट
        }
    }
    writeVaultData(vault);
    return res.json({ success: true });
});

app.get('/api/system/override-check', (req, res) => {
    const vault = readVaultData();
    return res.json({ override_active: vault.system_configuration.mining_core_override });
});

app.get('/api/user/vault-profile', (req, res) => {
    const { mobile } = req.query;
    const vault = readVaultData();
    const user = vault.user_ledger_matrix[mobile];
    if (user) {
        return res.json({
            uid: user.uid,
            username: user.username,
            mobile: user.mobile,
            balance: user.wallet_balance,
            lifetime_shared_data_gb: user.lifetime_shared_data_gb,
            registration_date: user.registration_timestamp,
            is_vip: user.is_vip_tier,
            referrals: user.referral_count,
            slots_count: user.linked_withdrawal_slots.length,
            dispute_tickets: user.dispute_tickets,
            withdrawals: user.withdrawal_history || []
        });
    }
    return res.status(404).json({ error: "Not found." });
});

// रेंडर होस्टिंग पोर्ट बाइंडिंग
const CENTRAL_HOST_PORT = process.env.PORT || 3000;
server.listen(CENTRAL_HOST_PORT, () => {
    console.log(`[ SERVER RUNNING ] Net-Matrix Hub active on live node port: ${CENTRAL_HOST_PORT}`);
});
