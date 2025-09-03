// グローバル変数
let sessions = [];
let currentSessionIndex = 0;
let timeRemaining = 0;
let timerInterval = null;
let isRunning = false;

// DOM要素の取得
const currentSessionName = document.getElementById('currentSessionName');
const timeRemainingDisplay = document.getElementById('timeRemaining');
const startStopBtn = document.getElementById('startStopBtn');
const nextBtn = document.getElementById('nextBtn');
const sessionNameInput = document.getElementById('sessionName');
const sessionDurationInput = document.getElementById('sessionDuration');
const addBtn = document.getElementById('addBtn');
const sessionsList = document.getElementById('sessionsList');

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderSessions();
    updateDisplay();
});

// データの読み込み
function loadData() {
    const savedData = localStorage.getItem('workshop-timer-data');
    if (savedData) {
        const data = JSON.parse(savedData);
        sessions = data.sessions || [];
        currentSessionIndex = data.currentSessionIndex || 0;
    }
}

// データの保存
function saveData() {
    const data = {
        sessions: sessions,
        currentSessionIndex: currentSessionIndex
    };
    localStorage.setItem('workshop-timer-data', JSON.stringify(data));
}

// セッション追加
addBtn.addEventListener('click', () => {
    const name = sessionNameInput.value.trim();
    const duration = parseInt(sessionDurationInput.value);
    
    if (name && duration && duration > 0) {
        const session = {
            id: Date.now(),
            name: name,
            duration: duration,
            status: 'pending'
        };
        
        sessions.push(session);
        saveData();
        renderSessions();
        updateDisplay();
        
        // 入力フィールドをクリア
        sessionNameInput.value = '';
        sessionDurationInput.value = '';
        
        // 最初のセッションが追加されたらボタンを有効化
        if (sessions.length === 1) {
            startStopBtn.disabled = false;
        }
    }
});

// セッション削除
function deleteSession(id) {
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
        // 実行中のタイマーを停止
        if (isRunning) {
            stopTimer();
        }
        
        sessions.splice(index, 1);
        
        // 現在のインデックスを調整
        if (currentSessionIndex >= sessions.length) {
            currentSessionIndex = sessions.length > 0 ? sessions.length - 1 : 0;
        }
        
        saveData();
        renderSessions();
        updateDisplay();
    }
}

// セッション一覧の表示
function renderSessions() {
    sessionsList.innerHTML = '';
    
    sessions.forEach((session, index) => {
        const li = document.createElement('li');
        li.className = 'session-item';
        
        // ステータスに応じてクラスを追加
        if (index === currentSessionIndex && sessions.length > 0) {
            li.classList.add('active');
        }
        if (session.status === 'completed') {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <div class="session-info">
                <span class="session-name">${session.name}</span>
                <span class="session-duration">${session.duration}分</span>
            </div>
            <button class="btn-delete" onclick="deleteSession(${session.id})">削除</button>
        `;
        
        sessionsList.appendChild(li);
    });
}

// 表示の更新
function updateDisplay() {
    if (sessions.length > 0 && currentSessionIndex < sessions.length) {
        const currentSession = sessions[currentSessionIndex];
        currentSessionName.textContent = currentSession.name;
        
        if (!isRunning) {
            timeRemaining = currentSession.duration * 60;
        }
        
        updateTimerDisplay();
        
        // ボタンの状態を更新
        startStopBtn.disabled = false;
        nextBtn.disabled = currentSessionIndex >= sessions.length - 1;
    } else {
        currentSessionName.textContent = 'セッションを追加してください';
        timeRemainingDisplay.textContent = '00:00';
        startStopBtn.disabled = true;
        nextBtn.disabled = true;
    }
}

// タイマー表示の更新
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timeRemainingDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// スタート/ストップボタン
startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

// タイマー開始
function startTimer() {
    if (sessions.length === 0) return;
    
    isRunning = true;
    startStopBtn.textContent = 'ストップ';
    startStopBtn.classList.add('stop');
    
    // 現在のセッションをアクティブに
    sessions[currentSessionIndex].status = 'active';
    renderSessions();
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            stopTimer();
            // 時間切れの通知（ビープ音の代わりに背景色を一時的に変更）
            timeRemainingDisplay.style.color = '#e74c3c';
            setTimeout(() => {
                timeRemainingDisplay.style.color = '#3498db';
            }, 1000);
        }
    }, 1000);
}

// タイマー停止
function stopTimer() {
    isRunning = false;
    startStopBtn.textContent = 'スタート';
    startStopBtn.classList.remove('stop');
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // タイマーが0になったらセッションを完了にする
    if (timeRemaining === 0) {
        sessions[currentSessionIndex].status = 'completed';
        renderSessions();
        saveData();
    }
}

// 次へボタン
nextBtn.addEventListener('click', () => {
    if (currentSessionIndex < sessions.length - 1) {
        // 現在のタイマーを停止
        if (isRunning) {
            stopTimer();
        }
        
        // 現在のセッションを完了にする
        sessions[currentSessionIndex].status = 'completed';
        
        // 次のセッションへ
        currentSessionIndex++;
        saveData();
        renderSessions();
        updateDisplay();
    }
});

// Enterキーでセッション追加
sessionNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

sessionDurationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});
