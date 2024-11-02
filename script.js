document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('overlay');

    // 페이드 아웃 효과 후 오버레이 제거
    setTimeout(() => {
        overlay.style.opacity = '0'; // 페이드 아웃
        setTimeout(() => {
            overlay.style.display = 'none'; // 완전히 사라지면 클릭 가능하게
        }, 2000); // 페이드 아웃 시간과 동일하게 설정
    }, 3000); // 3초 동안 이미지 표시 후 페이드 아웃 시작
    const startScreen = document.getElementById('startScreen');
    const iconSelection = document.getElementById('iconSelection');
    const selectedIconX = document.getElementById('selectedIconX');
    const selectedIconO = document.getElementById('selectedIconO');
    const confirmIconX = document.getElementById('confirmIconX');
    const confirmIconO = document.getElementById('confirmIconO');
    const player2Selection = document.getElementById('player2Selection');
    const rulesBtn = document.getElementById('rulesBtn');
    const rulesMessage = document.getElementById('rulesMessage');
    const messageDisplay = document.getElementById('message');
    const restartBtn = document.getElementById('restartBtn');
    const playerXScore = document.getElementById('playerXScore');
    const playerOScore = document.getElementById('playerOScore');
    const chooseIconBtn = document.getElementById('chooseIconBtn');
    const spanContainer = document.getElementById('spanContainer'); // spanContainer 추가
    
    let player1Icon = 'X';
    let player2Icon = 'O';
    let player1Wins = 0;
    let player2Wins = 0;
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let countdown;

    const showRules = () => {
        rulesMessage.textContent = "게임 방법: 두 플레이어가 차례로 아이콘을 선택하고, 3개의 아이콘을 먼저 가로, 세로, 대각선으로 정렬하면 승리하는 게임입니다. 2판을 먼저 승리할 시 최종 승리합니다.";
        rulesMessage.style.display = rulesMessage.style.display === "none" ? "block" : "none";
    };

    rulesBtn.addEventListener('click', showRules);

    chooseIconBtn.addEventListener('click', () => {
        iconSelection.style.display = 'block';
        confirmIconX.style.display = 'block';
        // 아이콘 선택 버튼 숨기기
        spanContainer.style.visibility = 'hidden';
    });

    confirmIconX.addEventListener('click', () => {
        const selectedIcon = document.querySelector('.icon.selected');
        if (selectedIcon) {
            player1Icon = selectedIcon.getAttribute('data-icon');
            selectedIconX.textContent = player1Icon;
            confirmIconX.style.display = 'none';
            player2Selection.style.display = 'block';
            confirmIconO.style.display = 'block';
        }
    });

    confirmIconO.addEventListener('click', () => {
        const selectedIcon = document.querySelector('.icon.selected');
        if (selectedIcon) {
            player2Icon = selectedIcon.getAttribute('data-icon');
            selectedIconO.textContent = player2Icon;
            iconSelection.style.display = 'none';
            confirmIconO.style.display = 'none';
            // 아이콘 선택 버튼 다시 나타나기
            chooseIconBtn.style.display = 'block';
            rulesBtn.style.display = 'block';
            
            // spanContainer 다시 나타나기
            spanContainer.style.visibility = 'visible'; // 추가된 부분
        }
    });

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', () => {
            document.querySelectorAll('.icon').forEach(i => {
                i.classList.remove('selected');
            });
            icon.classList.add('selected');
        });
    });

    const startGameBtn = document.getElementById('startGameBtn');
    const board = document.getElementById('board');
    const scoreboard = document.getElementById('scoreboard');

    startGameBtn.addEventListener('click', () => {
        // 아이콘이 선택되지 않은 경우 경고
        if (selectedIconX.textContent === '선택 안됨' || selectedIconO.textContent === '선택 안됨') {
            alert("아이콘을 선택한 후 게임을 시작할 수 있습니다.");
            return; // 아이콘이 선택되지 않았으면 게임 시작을 중단
        }
    
        // 플레이어1과 플레이어2의 아이콘 비교
        if (player1Icon === player2Icon) {
            alert("플레이어1과 플레이어2의 아이콘은 동일할 수 없습니다. 다른 아이콘을 선택해주세요.");
            selectedIconX.textContent = '선택 안됨'; // 초기화
            selectedIconO.textContent = '선택 안됨'; // 초기화
            return; // 함수 종료
        }
        // 점수판에 플레이어의 아이콘 표시
        document.getElementById('iconX').textContent = player1Icon;
        document.getElementById('iconO').textContent = player2Icon;

        startScreen.style.display = 'none';
        board.style.display = 'grid';
        scoreboard.style.display = 'block';
    });
    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a]; // 승리한 아이콘 반환
            }
        }

        return boardState.every(cell => cell !== null) ? 'Draw' : null; // 모든 셀이 채워져 있을 경우 무승부 반환
    };

    const resetBoard = () => {
        boardState.fill(null);
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('clicked');
        });
    };

    const handleCellClick = (event) => {
        const index = event.target.getAttribute('data-index');
        if (boardState[index] || !startScreen.style.display) return;

        boardState[index] = currentPlayer === 'X' ? player1Icon : player2Icon;
        event.target.textContent = boardState[index];
        event.target.classList.add('clicked');

        const winner = checkWinner();
        if (winner) {
            if (winner === player1Icon) {
                player1Wins++;
                messageDisplay.textContent = "플레이어 1 승리!";
            } else if (winner === player2Icon) {
                player2Wins++;
                messageDisplay.textContent = "플레이어 2 승리!";
            } else {
                messageDisplay.textContent = "무승부입니다!";
            }

            playerXScore.textContent = player1Wins;
            playerOScore.textContent = player2Wins;

            if (player1Wins >= 2 || player2Wins >= 2) {
                endGame();
            } else {
                startCountdown();
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // 다음 플레이어로 전환
        }
    };

    const startCountdown = () => {
        let count = 3;
        messageDisplay.textContent = `${count}..`;

        countdown = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countdown);
                resetBoard();
                messageDisplay.textContent = ''; // 메시지 초기화
            } else {
                messageDisplay.textContent = `${count}..`;
            }
        }, 1000);
    };

    const endGame = () => {
        clearInterval(countdown);
        messageDisplay.textContent += " 게임이 종료되었습니다.";
        board.style.display = 'none';
        restartBtn.style.display = 'block';
    };

    const restartGame = () => {
        startScreen.style.display = 'block';
        scoreboard.style.display = 'none';
        restartBtn.style.display = 'none';
        player1Wins = 0;
        player2Wins = 0;
        playerXScore.textContent = player1Wins;
        playerOScore.textContent = player2Wins;
        resetBoard();
        messageDisplay.textContent = ''; // 메시지 초기화
    };

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartBtn.addEventListener('click', restartGame);
});