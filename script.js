document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const customizeButton = document.getElementById('customizeButton');
    const customizationModal = document.getElementById('customizationModal');
    const closeButton = document.querySelector('.close-button');
    const saveCustomizationButton = document.getElementById('saveCustomizationButton');
    const addLevelButton = document.getElementById('addLevelButton');
    const levelsDiv = document.getElementById('levels');
    const roomsDiv = document.getElementById('rooms');
    const levelContentDiv = document.getElementById('levelContent');
    const levelButtonsContainer = document.getElementById('levelButtonsContainer');
    const levelButtons = document.querySelectorAll('.levelButton');
    const backButton = document.getElementById('backButton');
    const backToLevelsButton = document.getElementById('backToLevelsButton');
    const roomsContainer = document.getElementById('roomsContainer');
    const resetLevelsButton = document.getElementById('resetLevelsButton');
    const resetRoomsButton = document.getElementById('resetRoomsButton');
    const resetRoomButton = document.getElementById('resetRoomButton');

    let levelRooms = JSON.parse(localStorage.getItem('levelRooms')) || {
        1: [30, 6, 7, 6, 3, 3, 30, 45],
        2: [5, 5, 5, 5, 5, 30],
        3: []
    };

    function saveLevelRooms() {
        localStorage.setItem('levelRooms', JSON.stringify(levelRooms));
    }

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        customizeButton.style.display = 'none';
        levelsDiv.style.display = 'block';
    });

    customizeButton.addEventListener('click', () => {
        customizationModal.style.display = 'block';
        loadCustomizationOptions();
    });

    closeButton.addEventListener('click', () => {
        customizationModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === customizationModal) {
            customizationModal.style.display = 'none';
        }
    });

    saveCustomizationButton.addEventListener('click', () => {
        saveCustomization();
        saveLevelRooms();
        customizationModal.style.display = 'none';
    });

    addLevelButton.addEventListener('click', () => {
        const newLevelNumber = Object.keys(levelRooms).length + 1;
        levelRooms[newLevelNumber] = [];
        saveLevelRooms();
        loadCustomizationOptions();
    });

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const level = button.getAttribute('data-level');
            showRooms(level);
        });
    });

    backToLevelsButton.addEventListener('click', () => {
        roomsDiv.style.display = 'none';
        levelsDiv.style.display = 'block';
    });

    backButton.addEventListener('click', () => {
        levelContentDiv.style.display = 'none';
        roomsDiv.style.display = 'block';
    });

    resetLevelsButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetLevels();
            saveLevelRooms();
        }
    });

    resetRoomsButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetRooms();
            saveLevelRooms();
        }
    });

    resetRoomButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            resetRoom();
            saveLevelRooms();
        }
    });

    function showRooms(level) {
        roomsContainer.innerHTML = '';
        levelRooms[level].forEach((numButtons, index) => {
            const roomButton = document.createElement('button');
            roomButton.classList.add('roomButton', 'green');
            roomButton.textContent = `Room ${index + 1}`;
            roomButton.dataset.level = level;
            roomButton.dataset.room = index + 1;
            const savedRoomColor = localStorage.getItem(`level-${level}-room-${index + 1}-color`);
            if (savedRoomColor) {
                roomButton.classList.remove('green', 'red');
                roomButton.classList.add(savedRoomColor);
            }
            roomButton.addEventListener('click', () => {
                showRoom(level, index + 1, numButtons);
            });
            roomsContainer.appendChild(roomButton);
        });
        levelsDiv.style.display = 'none';
        roomsDiv.style.display = 'block';
    }

    function showRoom(level, room, numButtons) {
        levelButtonsContainer.innerHTML = '';
        levelButtonsContainer.dataset.level = level;
        levelButtonsContainer.dataset.room = room;
        for (let i = 1; i <= numButtons; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            const buttonState = localStorage.getItem(`level-${level}-room-${room}-button-${i}`);
            if (buttonState === 'red') {
                button.classList.add('red');
            } else {
                button.classList.add('green');
            }
            button.addEventListener('click', () => {
                button.classList.toggle('red');
                button.classList.toggle('green');
                localStorage.setItem(`level-${level}-room-${room}-button-${i}`, button.classList.contains('red') ? 'red' : 'green');
                checkRoomCompletion(level, room);
            });
            levelButtonsContainer.appendChild(button);
        }
        roomsDiv.style.display = 'none';
        levelContentDiv.style.display = 'block';
    }

    function checkRoomCompletion(level, room) {
        const buttons = Array.from(levelButtonsContainer.children);
        if (buttons.every(button => button.classList.contains('red'))) {
            document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`).classList.add('red');
            localStorage.setItem(`level-${level}-room-${room}-color`, 'red');
        } else {
            document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`).classList.remove('red');
            localStorage.setItem(`level-${level}-room-${room}-color`, 'green');
        }
        checkLevelCompletion(level);
    }

    function checkLevelCompletion(level) {
        const roomButtons = Array.from(document.querySelectorAll(`.roomButton[data-level="${level}"]`));
        if (roomButtons.every(button => button.classList.contains('red'))) {
            document.querySelector(`.levelButton[data-level="${level}"]`).classList.add('red');
            localStorage.setItem(`level-${level}-color`, 'red');
        } else {
            document.querySelector(`.levelButton[data-level="${level}"]`).classList.remove('red');
            localStorage.setItem(`level-${level}-color`, 'green');
        }
    }

function resetLevels() {
    Object.keys(levelRooms).forEach(level => {
        // Reset room button colors to green
        Array.from(document.querySelectorAll(`.roomButton[data-level="${level}"]`)).forEach(button => {
            button.classList.remove('red');
            button.classList.add('green');
            localStorage.removeItem(`level-${level}-room-${button.dataset.room}-color`);
            resetRoomButtons(level, button.dataset.room);
        });

        // Reset level color to green
        const levelButton = document.querySelector(`.levelButton[data-level="${level}"]`);
        if (levelButton) {
            levelButton.classList.remove('red');
            levelButton.classList.add('green');
            localStorage.removeItem(`level-${level}-color`);
        }
    });
}

    function resetRooms() {
        const level = getCurrentLevel();
        if (level) {
            levelRooms[level].forEach((numButtons, index) => {
                Array.from(document.querySelectorAll(`.roomButton[data-level="${level}"][data-room="${index + 1}"]`)).forEach(button => {
                    button.classList.remove('red');
                    button.classList.add('green');
                    localStorage.removeItem(`level-${level}-room-${button.dataset.room}-color`);
                    resetRoomButtons(level, button.dataset.room);
                });
            });
        }
    }

    function resetRoom() {
        const level = getCurrentLevel();
        const room = getCurrentRoom();
        if (level !== undefined && room !== undefined) {
            resetRoomButtons(level, room);
            const roomButton = document.querySelector(`.roomButton[data-level="${level}"][data-room="${room}"]`);
            if (roomButton) {
                roomButton.classList.remove('red');
                roomButton.classList.add('green');
                localStorage.removeItem(`level-${level}-room-${room}-color`);
            }
        }
    }

    function resetRoomButtons(level, room) {
        Array.from(levelButtonsContainer.children).forEach(button => {
            button.classList.remove('red');
            button.classList.add('green');
            localStorage.removeItem(`level-${level}-room-${room}-button-${button.textContent}`);
        });
    }

    function getCurrentLevel() {
        if (levelsDiv.style.display === 'block') return null;
        if (roomsDiv.style.display === 'block') return Array.from(document.querySelectorAll('.roomButton')).map(b => b.dataset.level)[0];
        if (levelContentDiv.style.display === 'block') return levelButtonsContainer.dataset.level;
        return null;
    }

    function getCurrentRoom() {
        if (levelContentDiv.style.display === 'block') return levelButtonsContainer.dataset.room;
        return null;
    }

    function loadCustomizationOptions() {
        const customizationOptions = document.getElementById('customizationOptions');
        customizationOptions.innerHTML = '';
        Object.keys(levelRooms).forEach(level => {
            const levelDiv = document.createElement('div');
            levelDiv.classList.add('customizationLevel');
            levelDiv.innerHTML = `<strong>Level ${level}</strong>`;
            levelRooms[level].forEach((room, index) => {
                const roomDiv = document.createElement('div');
                roomDiv.classList.add('customizationRoom');
                roomDiv.innerHTML = `Room ${index + 1}: <input type="number" min="1" max="100" value="${room}" data-level="${level}" data-room="${index + 1}" />`;
                const deleteRoomButton = document.createElement('button');
                deleteRoomButton.textContent = 'Delete Room';
                deleteRoomButton.addEventListener('click', () => {
                    levelRooms[level].splice(index, 1);
                    loadCustomizationOptions();
                });
                roomDiv.appendChild(deleteRoomButton);
                levelDiv.appendChild(roomDiv);
            });
            const addRoomButton = document.createElement('button');
            addRoomButton.textContent = 'Add Room';
            addRoomButton.addEventListener('click', () => {
                levelRooms[level].push(1); // Default to 1 button in the new room
                loadCustomizationOptions();
            });
            levelDiv.appendChild(addRoomButton);
            const deleteLevelButton = document.createElement('button');
            deleteLevelButton.textContent = 'Delete Level';
            deleteLevelButton.addEventListener('click', () => {
                delete levelRooms[level];
                loadCustomizationOptions();
            });
            levelDiv.appendChild(deleteLevelButton);
            customizationOptions.appendChild(levelDiv);
        });
    }

    function saveCustomization() {
        const inputs = document.querySelectorAll('#customizationOptions input');
        inputs.forEach(input => {
            const level = input.getAttribute('data-level');
            const room = input.getAttribute('data-room');
            const numButtons = parseInt(input.value, 10);
            levelRooms[level][room - 1] = numButtons;
        });
    }
});
